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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm tracking-wider">
              {brandSettings.logoText || 'AR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  AutoResell AI
                </span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs font-semibold text-blue-600">
                  {brandSettings.brandName}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Supplier: Badhons World · Niche: {postingRules.primaryNiche}
              </p>
            </div>
          </div>

          {/* Navigation Segments */}
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

          {/* Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* Autonomous Daemon Status Switch */}
            <button
              onClick={onToggleAutonomous}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
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
              <span className="hidden sm:inline">
                {postingRules.autonomousEnabled ? 'Autonomous Active' : 'Autonomous Paused'}
              </span>
              {postingRules.autonomousEnabled ? (
                <Pause className="w-3 h-3 text-emerald-600" />
              ) : (
                <Play className="w-3 h-3 text-amber-600" />
              )}
            </button>

            {/* Run Pipeline Now Button */}
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Run Pipeline</span>
                  <span className="sm:hidden">Run</span>
                </>
              )}
            </button>

            {/* Connect Real Accounts & API Keys */}
            <button
              onClick={onOpenIntegrations}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
              title="Connect Real Facebook, Instagram, Telegram & Badhons World credentials"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline">Connect Accounts</span>
            </button>

            {/* Console Logs */}
            <button
              onClick={onOpenLogs}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="System Activity Logs"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Posting Rules & Brand Identity"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1 rounded ${
              activeTab === 'dashboard' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            Queue
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-2 py-1 rounded ${
              activeTab === 'trends' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-2 py-1 rounded ${
              activeTab === 'catalogue' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            Website
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-2 py-1 rounded ${
              activeTab === 'meta' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            Feeds
          </button>
        </div>
      </div>
    </header>
  );
};
