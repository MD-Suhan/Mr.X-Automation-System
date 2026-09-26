import React from 'react';
import {
  TrendingUp,
  PackageCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { TrendTopic, PipelineItem, PostingRules } from '../types/index.ts';

interface DashboardStatsProps {
  publishedToday: number;
  maxPostsPerDay: number;
  inStockCount: number;
  totalProductsCount: number;
  trends: TrendTopic[];
  pipelineItems: PipelineItem[];
  postingRules: PostingRules;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  publishedToday,
  maxPostsPerDay,
  inStockCount,
  totalProductsCount,
  trends,
  pipelineItems,
  postingRules,
}) => {
  const publishedCount = pipelineItems.filter((i) => i.stage === 'published').length;
  const qualityPassedCount = pipelineItems.filter(
    (i) => i.stage === 'published' || i.stage === 'quality_approved'
  ).length;
  const qualityPassRate =
    pipelineItems.length > 0
      ? Math.round((qualityPassedCount / pipelineItems.length) * 100)
      : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Daily Posts Velocity */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Daily Social Quota
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{publishedToday}</span>
          <span className="text-sm font-medium text-slate-400">/ {maxPostsPerDay} posts today</span>
        </div>
        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((publishedToday / maxPostsPerDay) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>FB Page: Connected</span>
          <span aria-hidden="true">·</span>
          <span>IG: Connected</span>
        </div>
      </div>

      {/* 2. Today's Top Trends */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Viral Signals
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{trends.length}</span>
          <span className="text-sm font-medium text-slate-400">active trends</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
          {trends.slice(0, 3).map((t, idx) => (
            <span key={t.id} className="font-medium text-slate-800">
              {idx === 0 ? '🔥' : idx === 1 ? '⚡' : '✨'} {t.category}
              {idx < 2 && <span className="text-slate-300 ml-1.5">/</span>}
            </span>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Niche: {postingRules.primaryNiche}</span>
        </div>
      </div>

      {/* 3. Badhons World Stock Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Supplier Stock Status
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{inStockCount}</span>
          <span className="text-sm font-medium text-slate-400">/ {totalProductsCount} in stock</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Promotion
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 truncate">
          Badhons World · Mayons BD
        </div>
      </div>

      {/* 4. Quality Gate & Safety */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quality Gate
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{qualityPassRate}%</span>
          <span className="text-sm font-medium text-slate-400">pass rate</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>{publishedCount} Published</span>
          <span aria-hidden="true">·</span>
          <span>Fidelity Verified</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Bangla copy & stock validated
        </div>
      </div>
    </div>
  );
};
