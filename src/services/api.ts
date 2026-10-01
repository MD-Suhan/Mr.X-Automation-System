import type {
  SupplierProduct,
  TelegramPost,
  TrendTopic,
  PipelineItem,
  BrandSettings,
  PostingRules,
  SystemLog,
} from '../types/index.ts';

export interface SystemStatusResponse {
  autonomousEnabled: boolean;
  publishedToday: number;
  maxPostsPerDay: number;
  totalProductsInCatalogue: number;
  inStockCount: number;
  activeTrendsCount: number;
  queueCount: number;
  recentLogs: SystemLog[];
  brandSettings: BrandSettings;
  postingRules: PostingRules;
}

export const api = {
  async getStatus(): Promise<SystemStatusResponse> {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  async getSettings(): Promise<{ brandSettings: BrandSettings; postingRules: PostingRules }> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(payload: {
    newBrandSettings?: Partial<BrandSettings>;
    newPostingRules?: Partial<PostingRules>;
  }): Promise<{ success: boolean; brandSettings: BrandSettings; postingRules: PostingRules }> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async getTrends(): Promise<{ trends: TrendTopic[] }> {
    const res = await fetch('/api/trends');
    if (!res.ok) throw new Error('Failed to fetch trends');
    return res.json();
  },

  async refreshTrends(): Promise<{ success: boolean; trends: TrendTopic[] }> {
    const res = await fetch('/api/trends/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to refresh trends');
    return res.json();
  },

  async getCatalogue(): Promise<{ products: SupplierProduct[] }> {
    const res = await fetch('/api/catalogue');
    if (!res.ok) throw new Error('Failed to fetch supplier catalogue');
    return res.json();
  },

  async getTelegramFeed(): Promise<{ posts: TelegramPost[] }> {
    const res = await fetch('/api/telegram-feed');
    if (!res.ok) throw new Error('Failed to fetch Telegram feed');
    return res.json();
  },

  async getPipeline(): Promise<{ items: PipelineItem[] }> {
    const res = await fetch('/api/pipeline');
    if (!res.ok) throw new Error('Failed to fetch pipeline queue');
    return res.json();
  },

  async syncBadhonsWorld(): Promise<{ success: boolean; count: number; products: SupplierProduct[] }> {
    const res = await fetch('/api/supplier/sync', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to sync from Badhons World');
    return res.json();
  },

  async runAutoPilotCycle(): Promise<{ success: boolean; item?: PipelineItem; message: string }> {
    const res = await fetch('/api/pipeline/run-autopilot-cycle', { method: 'POST' });
    if (!res.ok) throw new Error('Auto-Pilot cycle failed');
    return res.json();
  },

  async runFullPipeline(productId?: string): Promise<{ success: boolean; item?: PipelineItem; message?: string }> {
    const res = await fetch('/api/pipeline/run-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    return res.json();
  },

  async pipelineAction(
    itemId: string,
    action: 'approve' | 'approve_and_publish' | 'reject' | 'delete' | 'toggle_pause'
  ): Promise<{ success: boolean; item: PipelineItem }> {
    const res = await fetch('/api/pipeline/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, action }),
    });
    if (!res.ok) throw new Error('Failed to execute pipeline action');
    return res.json();
  },

  async regenerateCreative(
    itemId: string,
    theme?: string
  ): Promise<{ success: boolean; item: PipelineItem }> {
    const res = await fetch(`/api/pipeline/${encodeURIComponent(itemId)}/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to regenerate creative');
    }
    return res.json();
  },

  async getBufferPool(): Promise<{
    reservePoolTotal: number;
    draftsAwaitingReview: number;
    approvedReadyToPost: number;
    publishedCount: number;
    recycledCount: number;
    lowStockThreshold: number;
    autoReplenishActive: boolean;
    recycledFallbackActive: boolean;
  }> {
    const res = await fetch('/api/buffer-pool');
    if (!res.ok) throw new Error('Failed to fetch buffer pool status');
    return res.json();
  },

  async generateBufferBatch(count: number = 10): Promise<{
    success: boolean;
    count: number;
    items: PipelineItem[];
  }> {
    const res = await fetch('/api/buffer-pool/generate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    });
    if (!res.ok) throw new Error('Failed to generate batch');
    return res.json();
  },

  async approveAllDrafts(): Promise<{ success: boolean; approvedCount: number }> {
    const res = await fetch('/api/buffer-pool/approve-all', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to approve all drafts');
    return res.json();
  },

  async testFailSafeRecycle(): Promise<{ success: boolean; item: PipelineItem; message?: string }> {
    const res = await fetch('/api/buffer-pool/test-fail-safe', {
      method: 'POST',
    });
    return res.json();
  },

  async getLogs(): Promise<{ logs: SystemLog[] }> {
    const res = await fetch('/api/logs');
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  async clearLogs(): Promise<{ success: boolean }> {
    const res = await fetch('/api/logs/clear', {
      method: 'POST',
    });
    return res.json();
  },

  async getPublicationHistory(): Promise<{ history: import('../types/index.ts').PostHistoryRecord[] }> {
    const res = await fetch('/api/publication-history');
    if (!res.ok) throw new Error('Failed to fetch publication history');
    return res.json();
  },

  async testMetaCredentials(payload: {
    pageId: string;
    pageToken: string;
    igAccountId?: string;
  }): Promise<{ success: boolean; message?: string; error?: string; pageName?: string; igConnected?: boolean }> {
    const res = await fetch('/api/meta/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async triggerCronPublish(forced: boolean = false): Promise<{
    success: boolean;
    executed: boolean;
    message: string;
    item?: PipelineItem;
    metaResult?: any;
  }> {
    const res = await fetch('/api/cron/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forced }),
    });
    return res.json();
  },

  async getCronStatus(): Promise<{
    autonomousEnabled: boolean;
    lastScheduledRun?: string;
    nextScheduledRun?: string;
    totalRuns: number;
    cronEndpoint: string;
  }> {
    const res = await fetch('/api/cron/status');
    if (!res.ok) throw new Error('Failed to fetch cron status');
    return res.json();
  },
};
