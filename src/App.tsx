import React, { useState, useEffect, useCallback } from 'react';
import { api, type SystemStatusResponse } from './services/api.ts';
import type {
  SupplierProduct,
  TelegramPost,
  TrendTopic,
  PipelineItem,
  BrandSettings,
  PostingRules,
  SystemLog,
} from './types/index.ts';

import { Header } from './components/Header.tsx';
import { DashboardStats } from './components/DashboardStats.tsx';
import { PipelineFlow } from './components/PipelineFlow.tsx';
import { BufferStockBanner } from './components/BufferStockBanner.tsx';
import { PipelineQueueList } from './components/PipelineQueueList.tsx';
import { PosterStudioModal } from './components/PosterStudioModal.tsx';
import { TrendsSection } from './components/TrendsSection.tsx';
import { CatalogueView } from './components/CatalogueView.tsx';
import { MetaFeedsView } from './components/MetaFeedsView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { SystemLogsModal } from './components/SystemLogsModal.tsx';
import { IntegrationSetupModal } from './components/IntegrationSetupModal.tsx';

import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trends' | 'catalogue' | 'meta'>('dashboard');

  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [catalogue, setCatalogue] = useState<SupplierProduct[]>([]);
  const [pipelineItems, setPipelineItems] = useState<PipelineItem[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    brandName: 'Mr.X Shop',
    tagline: 'SMART GADGETS · BETTER LIFE',
    logoText: 'Mr.X',
    contactNumber: '01822300348',
    whatsappNumber: '01822300348',
    websiteUrl: 'https://mrxshopbd.web.app',
    socialHandle: '@mrxshop.bd',
    accentColor: '#0088ff',
    enablePriceInPoster: false,
  });

  const [postingRules, setPostingRules] = useState<PostingRules>({
    primaryNiche: 'Tech Gadgets',
    maxPostsPerDay: 3,
    minTrendScore: 70,
    allowedCategories: ['Earbuds', 'Smartwatch', 'Speaker', 'Power Bank', 'Gaming accessories', 'Gimbals'],
    blockedCategories: ['Beauty', 'Kitchen', 'Toys', 'Clothing'],
    autonomousEnabled: true,
    autoIntervalMinutes: 30,
    requireManualApproval: false,
    metaFacebookPageId: 'fb_page_892301982',
    metaFacebookPageName: 'Mr.X Shop Official',
    metaInstagramHandle: '@mrxshop_official',
    metaConnected: true,
  });

  // Modal States
  const [selectedStudioItem, setSelectedStudioItem] = useState<PipelineItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [isSyncingBadhons, setIsSyncingBadhons] = useState(false);
  const [isRunningAutoPilot, setIsRunningAutoPilot] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      const [statusRes, trendsRes, catRes, pipeRes, logsRes] = await Promise.all([
        api.getStatus(),
        api.getTrends(),
        api.getCatalogue(),
        api.getPipeline(),
        api.getLogs(),
      ]);

      setStatus(statusRes);
      setBrandSettings(statusRes.brandSettings);
      setPostingRules(statusRes.postingRules);
      setTrends(trendsRes.trends);
      setCatalogue(catRes.products);
      setPipelineItems(pipeRes.items);
      setLogs(logsRes.logs);
    } catch (err: any) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll data every 10 seconds to keep live autonomous execution synced
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Execute Autonomous Pipeline (Full Cycle)
  const handleRunPipeline = async (productId?: string) => {
    setIsRunningPipeline(true);
    try {
      const res = await api.runFullPipeline(productId);
      if (res.success && res.item) {
        showToast(
          'success',
          `Autonomous Cycle Finished: "${res.item.productName}" processed and verified!`
        );
        fetchData();
        // If item generated creative, optionally open studio for user delight
        if (res.item.creative) {
          setSelectedStudioItem(res.item);
        }
      } else {
        showToast('info', res.message || 'Pipeline finished with warnings.');
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `Pipeline execution failed: ${err.message}`);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Toggle Autonomous Cloud Daemon
  const handleToggleAutonomous = async () => {
    const nextState = !postingRules.autonomousEnabled;
    try {
      const res = await api.updateSettings({
        newPostingRules: { autonomousEnabled: nextState },
      });
      setPostingRules(res.postingRules);
      showToast(
        'info',
        nextState
          ? 'Autonomous Daemon Started: Running 24/7 background marketing loop.'
          : 'Autonomous Daemon Paused.'
      );
    } catch (err: any) {
      showToast('error', `Failed to update autonomous status: ${err.message}`);
    }
  };

  // Buffer Pool Actions
  const handleGenerateBatch = async () => {
    setIsGeneratingBatch(true);
    try {
      const res = await api.generateBufferBatch(10);
      if (res.success) {
        showToast(
          'success',
          `১০টি নতুন পোস্টার ও সোশ্যাল ক্যাপশন সফলভাবে বাফারে তৈরি হয়েছে! এখন দেখে অ্যাপ্রুভ করুন।`
        );
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `ব্যাচ তৈরিতে সমস্যা: ${err.message}`);
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  const handleApproveAllDrafts = async () => {
    try {
      const res = await api.approveAllDrafts();
      if (res.success) {
        showToast(
          'success',
          `${res.approvedCount}টি ড্রাফট পোস্টার একসাথে অ্যাপ্রুভ হয়ে পোস্টিং বাফারে জমা হয়েছে!`
        );
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `সব ড্রাফট অ্যাপ্রুভ ব্যর্থ: ${err.message}`);
    }
  };

  const handleQuickApprove = async (itemId: string) => {
    try {
      const res = await api.pipelineAction(itemId, 'approve');
      if (res.success) {
        showToast('success', `পোস্টারটি অ্যাপ্রুভ হয়েছে এবং পোস্টিং বাফারে রেডি রাখা হয়েছে!`);
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `অ্যাপ্রুভ ব্যর্থ: ${err.message}`);
    }
  };

  const handleTestFailSafe = async () => {
    try {
      const res = await api.testFailSafeRecycle();
      if (res.success && res.item) {
        showToast(
          'success',
          `স্মার্ট ফেইল-সেফ টেস্ট সফল! পূর্বের অনুমোদিত পোস্টারের নতুন ইউনিক ক্যাপশন বানিয়ে পাবলিশ করা হয়েছে!`
        );
        fetchData();
        setSelectedStudioItem(res.item);
      } else {
        showToast('info', res.message || 'ফেইল-সেফ টেস্ট সম্পন্ন হতে পারেনি');
      }
    } catch (err: any) {
      showToast('error', `ফেইল-সেফ টেস্ট ব্যর্থ: ${err.message}`);
    }
  };

  const handleSyncBadhonsWorld = async () => {
    setIsSyncingBadhons(true);
    try {
      const res = await api.syncBadhonsWorld();
      if (res.success) {
        showToast('success', `badhonsworld.com থেকে মোট ${res.count}টি আসল প্রোডাক্ট ও ক্লাউডফ্রন্ট ছবি সফলভাবে সিঙ্ক হয়েছে!`);
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `সিঙ্ক ব্যর্থ: ${err.message}`);
    } finally {
      setIsSyncingBadhons(false);
    }
  };

  const handleRunAutoPilotCycle = async () => {
    setIsRunningAutoPilot(true);
    try {
      const res = await api.runAutoPilotCycle();
      if (res.success) {
        showToast('success', res.message || 'অটো-পাইলট প্রকাশ সফল হয়েছে!');
        fetchData();
        if (res.item) {
          setSelectedStudioItem(res.item);
        }
      } else {
        showToast('info', res.message || 'Auto-Pilot cycle failed');
      }
    } catch (err: any) {
      showToast('error', `Auto-Pilot ব্যর্থ: ${err.message}`);
    } finally {
      setIsRunningAutoPilot(false);
    }
  };

  // Pipeline Item Actions
  const handleApproveAndPublish = async (itemId: string) => {
    try {
      const res = await api.pipelineAction(itemId, 'approve_and_publish');
      if (res.success) {
        showToast('success', `Published to Facebook Page and Instagram!`);
        fetchData();
        if (selectedStudioItem?.id === itemId) {
          setSelectedStudioItem(res.item);
        }
      }
    } catch (err: any) {
      showToast('error', `Publish failed: ${err.message}`);
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      await api.pipelineAction(itemId, 'reject');
      showToast('info', 'Item rejected and marked in audit log.');
      fetchData();
    } catch (err: any) {
      showToast('error', `Reject failed: ${err.message}`);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await api.pipelineAction(itemId, 'delete');
      showToast('info', 'Item removed from queue.');
      fetchData();
    } catch (err: any) {
      showToast('error', `Delete failed: ${err.message}`);
    }
  };

  const handleTogglePause = async (itemId: string) => {
    try {
      const res = await api.pipelineAction(itemId, 'toggle_pause');
      if (res.success) {
        showToast('info', 'Evergreen rotation status updated.');
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `Status update failed: ${err.message}`);
    }
  };

  // Regenerate Creative in Studio
  const handleRegenerateCreative = async (itemId: string, theme?: string) => {
    try {
      const res = await api.regenerateCreative(itemId, theme);
      if (res.success && res.item) {
        setSelectedStudioItem(res.item);
        showToast('success', 'Regenerated fresh promotional copy & style with Gemini.');
        fetchData();
      }
    } catch (err: any) {
      showToast('error', `Regeneration failed: ${err.message}`);
    }
  };

  // Refresh Trends with Gemini
  const handleRefreshTrends = async () => {
    try {
      const res = await api.refreshTrends();
      if (res.success) {
        setTrends(res.trends);
        showToast('success', 'Live social signals & search trends refreshed with Gemini AI.');
      }
    } catch (err: any) {
      showToast('error', `Trends refresh failed: ${err.message}`);
    }
  };

  // Save Settings
  const handleSaveSettings = async (payload: {
    newBrandSettings?: Partial<BrandSettings>;
    newPostingRules?: Partial<PostingRules>;
  }) => {
    try {
      const res = await api.updateSettings(payload);
      if (res.success) {
        setBrandSettings(res.brandSettings);
        setPostingRules(res.postingRules);
        showToast('success', 'Posting rules & brand configuration saved.');
      }
    } catch (err: any) {
      showToast('error', `Failed to save settings: ${err.message}`);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    try {
      await api.clearLogs();
      setLogs([]);
      showToast('info', 'System logs cleared.');
    } catch (err: any) {
      showToast('error', `Failed to clear logs: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brandSettings={brandSettings}
        postingRules={postingRules}
        isRunningPipeline={isRunningPipeline}
        onRunPipeline={() => handleRunPipeline()}
        onToggleAutonomous={handleToggleAutonomous}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        onRunAutoPilotCycle={handleRunAutoPilotCycle}
        isRunningAutoPilot={isRunningAutoPilot}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md animate-fade-in shadow-xl">
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : toastMessage.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-snug">{toastMessage.text}</div>
          </div>
        </div>
      )}

      {/* Main Container - Mobile Responsive Padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Metric Cards Banner */}
        <DashboardStats
          publishedToday={status?.publishedToday || 0}
          maxPostsPerDay={postingRules.maxPostsPerDay}
          inStockCount={catalogue.filter((p) => p.stockStatus === 'in_stock').length}
          totalProductsCount={catalogue.length}
          trends={trends}
          pipelineItems={pipelineItems}
          postingRules={postingRules}
        />

        {/* Tab 1: Dashboard & Pipeline Queue View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Visual 7-Step Pipeline Tracker */}
            <PipelineFlow
              items={pipelineItems}
              onSelectItem={(item) => setSelectedStudioItem(item)}
            />

            {/* Poster Stock Buffer & Auto-Replenish Manager (10-12 Posts + Fail-Safe) */}
            <BufferStockBanner
              items={pipelineItems}
              isGeneratingBatch={isGeneratingBatch}
              onGenerateBatch={handleGenerateBatch}
              onApproveAllDrafts={handleApproveAllDrafts}
              onTestFailSafe={handleTestFailSafe}
              onOpenStudio={(item) => setSelectedStudioItem(item)}
            />

            {/* Pipeline Products Queue List */}
            <PipelineQueueList
              items={pipelineItems}
              onOpenStudio={(item) => setSelectedStudioItem(item)}
              onQuickApprove={handleQuickApprove}
              onApproveAndPublish={handleApproveAndPublish}
              onTogglePause={handleTogglePause}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* Tab 2: Trends Detection Engine */}
        {activeTab === 'trends' && (
          <TrendsSection
            trends={trends}
            postingRules={postingRules}
            onRefreshTrends={handleRefreshTrends}
            onTriggerTrendPipeline={(category) => {
              const matchingProd = catalogue.find(
                (p) => p.category === category && p.stockStatus === 'in_stock'
              );
              if (matchingProd) {
                handleRunPipeline(matchingProd.id);
              } else {
                handleRunPipeline();
              }
            }}
          />
        )}

        {/* Tab 3: Badhons World Supplier Catalogue & Stock Checker */}
        {activeTab === 'catalogue' && (
          <CatalogueView
            products={catalogue}
            onRunProductPipeline={(productId) => handleRunPipeline(productId)}
            isRunningPipeline={isRunningPipeline}
            onSyncBadhons={handleSyncBadhonsWorld}
            isSyncing={isSyncingBadhons}
          />
        )}

        {/* Tab 4: Live Meta Feeds (Facebook Page & Instagram) */}
        {activeTab === 'meta' && (
          <MetaFeedsView
            items={pipelineItems}
            brandSettings={brandSettings}
            postingRules={postingRules}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">AutoResell AI</span>
            <span>·</span>
            <span>Autonomous Cloud Marketing Agent</span>
            <span>·</span>
            <span>Source: Badhons World Public Website (Direct)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Duplicate Protection: Active</span>
            <span>·</span>
            <span>Meta Graph API: Connected</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">Telegram-Free Architecture</span>
          </div>
        </div>
      </footer>

      {/* Poster Studio Modal */}
      {selectedStudioItem && (
        <PosterStudioModal
          item={selectedStudioItem}
          brandSettings={brandSettings}
          postingRules={postingRules}
          onClose={() => setSelectedStudioItem(null)}
          onPublish={handleApproveAndPublish}
          onRegenerate={handleRegenerateCreative}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          brandSettings={brandSettings}
          postingRules={postingRules}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}

      {/* Real Integrations & Accounts Setup Modal */}
      {isIntegrationsOpen && (
        <IntegrationSetupModal
          postingRules={postingRules}
          onClose={() => setIsIntegrationsOpen(false)}
          onSaveCredentials={async (creds) => {
            await handleSaveSettings({
              newPostingRules: creds,
            });
          }}
        />
      )}

      {/* System Logs Modal */}
      {isLogsOpen && (
        <SystemLogsModal
          logs={logs}
          onClose={() => setIsLogsOpen(false)}
          onClear={handleClearLogs}
          onRefresh={async () => {
            const res = await api.getLogs();
            setLogs(res.logs);
          }}
        />
      )}
    </div>
  );
}
