import React, { useState } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Search,
  Sparkles,
  Flame,
  ArrowUpRight,
  Facebook,
  Instagram,
  Globe,
  Info,
} from 'lucide-react';
import type { TrendTopic, PostingRules } from '../types/index.ts';

interface TrendsSectionProps {
  trends: TrendTopic[];
  postingRules: PostingRules;
  onRefreshTrends: () => Promise<void>;
  onTriggerTrendPipeline: (category: string) => void;
}

export const TrendsSection: React.FC<TrendsSectionProps> = ({
  trends,
  postingRules,
  onRefreshTrends,
  onTriggerTrendPipeline,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshTrends();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Niche Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Social & Search Trend Intelligence Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              Analyzing publicly observable social signals across Facebook engagement, Instagram Reels, Google
              search velocity, and regional Bangladeshi demand patterns for niche:{' '}
              <span className="font-semibold text-slate-700">{postingRules.primaryNiche}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh via Gemini AI</span>
            </button>
          </div>
        </div>

        {/* Disclaimer per Specification Item 18 */}
        <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">Notice:</span> Facebook/Instagram private sales data is not directly
            accessible. These metrics represent publicly observable demand, search velocity, and social engagement
            signals to evaluate promotional relevance before stock verification.
          </p>
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map((trend) => {
          const isSurging = trend.momentum === 'surging';

          return (
            <div
              key={trend.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">{trend.category}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      Score: {trend.trendScore}/100
                    </span>
                    {isSurging && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {trend.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {trend.reasoning}
                </p>

                {/* Viral Signals Breakdown */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      Facebook Buzz
                    </span>
                    <span className="font-semibold text-slate-900">
                      {trend.viralSignals.facebookBuzz}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      Reels Index
                    </span>
                    <span className="font-semibold text-slate-900">
                      {trend.viralSignals.instagramReelsIndex}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      Search Velocity
                    </span>
                    <span className="font-semibold text-slate-900">
                      {trend.viralSignals.googleSearchDemand}%
                    </span>
                  </div>
                </div>

                {/* Keywords & Seasonal fit */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Tags:</span>
                  {trend.recommendedKeywords.map((kw, i) => (
                    <span key={i} className="text-slate-600">
                      #{kw.replace(/\s+/g, '')}
                      {i < trend.recommendedKeywords.length - 1 && ' ·'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onTriggerTrendPipeline(trend.category)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Match Catalogue & Run Auto Pipeline</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
