import React from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ShieldCheck,
  PlusCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type { PipelineItem } from '../types/index.ts';

interface BufferStockBannerProps {
  items: PipelineItem[];
  isGeneratingBatch: boolean;
  onGenerateBatch: () => Promise<void>;
  onApproveAllDrafts: () => Promise<void>;
  onTestFailSafe: () => Promise<void>;
  onOpenStudio: (item: PipelineItem) => void;
}

export const BufferStockBanner: React.FC<BufferStockBannerProps> = ({
  items,
  isGeneratingBatch,
  onGenerateBatch,
  onApproveAllDrafts,
  onTestFailSafe,
  onOpenStudio,
}) => {
  const drafts = items.filter((i) => i.stage === 'draft_review');
  const readyApproved = items.filter(
    (i) => i.stage === 'ready_approved' || i.stage === 'quality_approved'
  );
  const published = items.filter((i) => i.stage === 'published');
  const recycled = items.filter((i) => i.isRecycled);

  const totalStock = drafts.length + readyApproved.length;
  const isLowStock = totalStock <= 4;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-700/60 mb-4 sm:mb-6">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Layers className="w-3 h-3" />
              10-12 Poster Stock Inventory
            </span>
            {isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Low Stock Alert (≤ 4)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3" /> Healthy Reserve ({totalStock} Ready)
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            অটোনোমাস পোস্টার বাফার পুল ও স্মার্ট ফেইল-সেফ
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            সিস্টেম একসাথে ১০-১২টি পোস্টার ও ক্যাপশন বাফারে রাখে। আপনি রিভিউ করবেন, আর স্টকে ৪-৫টি নামলে নিজে থেকেই আবার রিফিল করবে!
          </p>
        </div>

        {/* Action Controls - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 shrink-0">
          <button
            onClick={onGenerateBatch}
            disabled={isGeneratingBatch}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
            title="Generate a batch of 10-12 diverse multi-angle posters across in-stock products"
          >
            {isGeneratingBatch ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <PlusCircle className="w-3.5 h-3.5" />
            )}
            <span>+ ১০-১২টি নতুন পোস্টার</span>
          </button>

          {drafts.length > 0 && (
            <button
              onClick={onApproveAllDrafts}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-md transition-all cursor-pointer"
              title="1-click approve all pending drafts for scheduled publishing"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>সব ড্রাফট অ্যাপ্রুভ ({drafts.length})</span>
            </button>
          )}

          <button
            onClick={onTestFailSafe}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-700/80 hover:bg-indigo-600 active:scale-95 text-indigo-100 border border-indigo-500/30 transition-all cursor-pointer"
            title="Simulate the smart recycler: Takes an approved poster, writes a fresh Bangla caption & publishes"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>ফেইল-সেফ টেস্ট</span>
          </button>
        </div>
      </div>

      {/* Stock Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Metric 1: Total Stock Reserve */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
          <div className="text-[11px] font-semibold uppercase text-slate-400">
            Total Ready Buffer
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">{totalStock}</span>
            <span className="text-xs text-slate-400">পোস্টার স্টকে</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-300 flex items-center gap-1">
            <span>লক্ষ্যমাত্রা: ১০-১২টি বাফার</span>
          </div>
        </div>

        {/* Metric 2: Drafts Awaiting Review */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
          <div className="text-[11px] font-semibold uppercase text-slate-400">
            Awaiting Review
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400">{drafts.length}</span>
            <span className="text-xs text-slate-400">টি রিভিউ বাকি</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-300">
            দেখে অ্যাপ্রুভ করুন বা এডিট করুন
          </div>
        </div>

        {/* Metric 3: Approved Ready to Post */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
          <div className="text-[11px] font-semibold uppercase text-slate-400">
            Approved & Ready
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400">{readyApproved.length}</span>
            <span className="text-xs text-slate-400">টি শিডিউলড</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-300">
            অটোনোমাস পাবলিশের জন্য রেডি
          </div>
        </div>

        {/* Metric 4: Auto-Refill & Recycler Logic */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
          <div className="text-[11px] font-semibold uppercase text-slate-400">
            Low Stock Threshold
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-300">≤ ৪ টি</span>
            <span className="text-xs text-slate-400">হলেই রিফিল</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-300 flex items-center gap-1 truncate">
            <RotateCcw className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>রিসাইকেলড পোস্ট: {recycled.length} টি</span>
          </div>
        </div>
      </div>

      {/* Visual Stock Level Progress Bar */}
      <div className="mt-4 pt-4 border-t border-slate-700/40">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            স্টক লেভেল ইন্ডিকেটর (Current Buffer: {totalStock}/12)
          </span>
          <span className="text-[11px] text-slate-400">
            {isLowStock
              ? '⚠️ লো স্টক ট্র্রিগার সক্রিয় — অটোনোমাস ইঞ্জিন স্বয়ংক্রিয়ভাবে নতুন পোস্টার তৈরি করবে'
              : '✅ পর্যাপ্ত স্টক মজুত আছে'}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden flex">
          {/* Approved Green */}
          <div
            className="bg-emerald-500 h-2 transition-all duration-500"
            style={{ width: `${Math.min((readyApproved.length / 12) * 100, 100)}%` }}
            title={`Approved: ${readyApproved.length}`}
          />
          {/* Drafts Yellow */}
          <div
            className="bg-amber-400 h-2 transition-all duration-500"
            style={{ width: `${Math.min((drafts.length / 12) * 100, 100)}%` }}
            title={`Drafts: ${drafts.length}`}
          />
        </div>
      </div>
    </div>
  );
};
