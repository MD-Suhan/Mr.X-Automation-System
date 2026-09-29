import React from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Sliders,
  Terminal,
  RefreshCw,
  Layers,
  TrendingUp,
  Package,
  Send,
  Share2,
} from 'lucide-react';
import type { BrandSettings, PostingRules } from '../types/index.ts';

interface HeaderProps {
  activeTab: 'dashboard' | 'trends' | 'catalogue' | 'meta';
  setActiveTab: (tab: 'dashboard' | 'trends' | 'catalogue' | 'meta') => void;
  brandSettings: BrandSettings;
  postingRules: PostingRules;
  isRunningPipeline: boolean;
  onRunPipeline: () => void;
  onToggleAutonomous: () => void;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onOpenIntegrations: () => void;
  onRunAutoPilotCycle?: () => void;
  isRunningAutoPilot?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  brandSettings,
  postingRules,
  isRunningPipeline,
  onRunPipeline,
  onToggleAutonomous,
  onOpenSettings,
  onOpenLogs,
  onOpenIntegrations,
  onRunAutoPilotCycle,
  isRunningAutoPilot = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand & System Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs tracking-wider shrink-0">
              {brandSettings.logoText || 'AR'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  AutoResell AI
                </span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <span className="text-[11px] sm:text-xs font-semibold text-blue-600 truncate hidden xs:inline">
                  {brandSettings.brandName}
                </span>
                <span className="relative flex h-2 w-2 shrink-0">
                  {postingRules.autonomousEnabled && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      postingRules.autonomousEnabled ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  ></span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block truncate">
                Supplier: Badhons World · Niche: {postingRules.primaryNiche} · <span className="text-emerald-600 font-medium">Target: {postingRules.maxPostsPerDay} Posts/Day</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Segments */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pipeline & Queue</span>
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'trends'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trends Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('catalogue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'catalogue'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Badhons World (Website)</span>
            </button>
            <button
              onClick={() => setActiveTab('meta')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'meta'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Meta Feeds</span>
            </button>
          </nav>

          {/* Controls & Actions Header */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Desktop Autonomous Daemon Status Switch */}
            <button
              onClick={onToggleAutonomous}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                postingRules.autonomousEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
              title={
                postingRules.autonomousEnabled
                  ? 'Cloud Autonomous Runner is ON (24/7)'
                  : 'Autonomous Mode Paused'
              }
            >
              <span className="relative flex h-2 w-2">
                {postingRules.autonomousEnabled && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    postingRules.autonomousEnabled ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span>{postingRules.autonomousEnabled ? 'Auto ON' : 'Paused'}</span>
              {postingRules.autonomousEnabled ? (
                <Pause className="w-3 h-3 text-emerald-600" />
              ) : (
                <Play className="w-3 h-3 text-amber-600" />
              )}
            </button>

            {/* Instant Auto-Pilot Cycle Run */}
            {onRunAutoPilotCycle && (
              <button
                onClick={onRunAutoPilotCycle}
                disabled={isRunningAutoPilot}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
                title="badhonsworld.com থেকে অটোমেশনের মাধ্যমে এখনই ইনস্ট্যান্ট ১টি পোস্ট পাবলিশ করুন"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRunningAutoPilot ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRunningAutoPilot ? 'পোস্ট হচ্ছে...' : '⚡ Auto-Pilot'}</span>
                <span className="sm:hidden font-bold">Auto</span>
              </button>
            )}

            {/* Run Pipeline Now Button */}
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
              title="নতুন পোস্টার ও ট্রেন্ড প্রসেস করুন"
            >
              {isRunningPipeline ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isRunningPipeline ? 'Processing...' : 'Run Pipeline'}</span>
              <span className="sm:hidden font-bold">Run</span>
            </button>

            {/* Connect Real Accounts & API Keys */}
            <button
              onClick={onOpenIntegrations}
              className="w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 shrink-0"
              title="Connect Accounts (Facebook, Instagram, Telegram, Mayons BD)"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden xl:inline">Accounts</span>
            </button>

            {/* Console Logs */}
            <button
              onClick={onOpenLogs}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shrink-0"
              title="System Activity Logs"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shrink-0"
              title="Posting Rules & Brand Identity"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile App-Style Segmented Navigation Tab Bar */}
        <div className="md:hidden pb-2 pt-1">
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Queue</span>
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'trends'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trends</span>
            </button>
            <button
              onClick={() => setActiveTab('catalogue')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'catalogue'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>
            <button
              onClick={() => setActiveTab('meta')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'meta'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Feeds</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
