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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
      {/* 1. Daily Posts Velocity */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Daily Quota
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">{publishedToday}</span>
            <span className="text-[11px] sm:text-sm font-medium text-slate-400">/ {maxPostsPerDay} today</span>
          </div>
          <div className="mt-2 sm:mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((publishedToday / maxPostsPerDay) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-500 truncate">
          <span>FB & IG: Connected</span>
        </div>
      </div>

      {/* 2. Today's Top Trends */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Viral Signals
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">{trends.length}</span>
            <span className="text-[11px] sm:text-sm font-medium text-slate-400">trends active</span>
          </div>
          <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1 text-[11px] sm:text-xs text-slate-700">
            {trends.slice(0, 2).map((t, idx) => (
              <span key={t.id} className="font-medium text-slate-800 truncate">
                {idx === 0 ? '🔥' : '⚡'} {t.category}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-500 flex items-center gap-1 truncate">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="truncate">{postingRules.primaryNiche}</span>
        </div>
      </div>

      {/* 3. Badhons World Stock Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Supplier Stock
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">{inStockCount}</span>
            <span className="text-[11px] sm:text-sm font-medium text-slate-400">/ {totalProductsCount} stock</span>
          </div>
          <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Ready for Ads</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] sm:text-xs text-slate-400 truncate">
          badhonsworld.com
        </div>
      </div>

      {/* 4. Quality Gate & Safety */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Quality Gate
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">{qualityPassRate}%</span>
            <span className="text-[11px] sm:text-sm font-medium text-slate-400">pass rate</span>
          </div>
          <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 truncate">
            <span>{publishedCount} Published</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] sm:text-xs text-slate-400 truncate">
          Bangla & Stock Gate
        </div>
      </div>
    </div>
  );
};
