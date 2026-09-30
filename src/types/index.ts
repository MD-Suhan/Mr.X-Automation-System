export type StockStatus = 'in_stock' | 'out_of_stock';

export type PipelineStage =
  | 'trend_discovered'
  | 'stock_verified'
  | 'media_collected'
  | 'analyzing'
  | 'creative_generated'
  | 'draft_review'
  | 'ready_approved'
  | 'quality_approved'
  | 'quality_rejected'
  | 'published'
  | 'recycled_fallback'
  | 'duplicate_skipped';

export interface TelegramPost {
  id: string;
  channelName: string;
  channelHandle: string;
  date: string;
  productName: string;
  productUrl: string;
  albumImages: string[];
  captionSnippet: string;
  sku: string;
}

export interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  url: string;
  sku: string;
  price?: number;
  stockStatus: StockStatus;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  telegramAlbumImages: string[];
  telegramPostId?: string;
  supplierName: string; // e.g. "Badhons World (Mayons BD)"
  lastStockCheck: string;
}

export interface TrendTopic {
  id: string;
  category: string;
  title: string;
  trendScore: number; // 0-100
  momentum: 'surging' | 'steady' | 'emerging';
  searchVolume: string;
  viralSignals: {
    facebookBuzz: number; // 0-100
    instagramReelsIndex: number; // 0-100
    googleSearchDemand: number; // 0-100
    seasonalFit: string;
  };
  reasoning: string;
  recommendedKeywords: string[];
  detectedAt: string;
}

export interface AIAnalysisResult {
  productSummary: string;
  targetCustomer: string;
  keySellingPoints: string[];
  visualStyle: 'cinematic_dark' | 'cyber_neon' | 'minimal_luxury' | 'studio_tech';
  heroImageIndex: number;
  angleToHighlight: string;
  sentimentAppeal: string;
}

export interface CreativeAsset {
  headline: string;
  subheadline: string;
  calloutBadges: string[];
  badgeColor: string;
  theme: 'cinematic_dark' | 'cyber_neon' | 'minimal_luxury' | 'studio_tech';
  heroImageUrl: string;
  generatedPosterUrl?: string;
  brandWatermark: boolean;
}

export interface SocialCaption {
  banglaTitle: string;
  summaryHook: string;
  bulletPoints: string[];
  callToAction: string;
  hashtags: string[];
  fullFormattedText: string;
}

export interface QualityCheckResult {
  passed: boolean;
  score: number; // 0-100
  checks: {
    imageClear: boolean;
    correctProductFidelity: boolean;
    textReadable: boolean;
    spellingCorrect: boolean;
    noMisleadingClaim: boolean;
    stockAvailable: boolean;
    badhonsWorldTruthGrounded?: boolean;
  };
  notes: string;
  checkedAt: string;
}

export interface PostHistoryRecord {
  id: string;
  contentId: string;
  productId: string;
  productName: string;
  platform: 'facebook' | 'instagram';
  status: 'success' | 'failure';
  timestamp: string;
  platformPostId?: string;
  postUrl?: string;
  error?: string;
  captionSnippet?: string;
  imageUrl?: string;
}

export interface PublishingRecord {
  facebook: {
    posted: boolean;
    postId?: string;
    pageName?: string;
    postUrl?: string;
    timestamp?: string;
    metrics: { likes: number; comments: number; shares: number };
    error?: string;
  };
  instagram: {
    posted: boolean;
    postId?: string;
    accountHandle?: string;
    postUrl?: string;
    timestamp?: string;
    metrics: { likes: number; comments: number; saves: number };
    error?: string;
  };
}

export interface PipelineItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  productUrl: string;
  price?: number;
  supplier: string;
  trendId: string;
  trendTitle: string;
  trendScore: number;
  stage: PipelineStage;
  stockVerified: boolean;
  telegramAlbumFound: boolean;
  images: string[];
  heroImage: string;
  aiAnalysis?: AIAnalysisResult;
  creative?: CreativeAsset;
  caption?: SocialCaption;
  qualityCheck?: QualityCheckResult;
  publishing: PublishingRecord;
  createdAt: string;
  updatedAt: string;
  errorLog?: string;
  angleVariation?: string;
  isRecycled?: boolean;
  originalItemId?: string;
  isApproved?: boolean;
  isPaused?: boolean;
  lastPublishedAt?: string;
  totalPublishedCount?: number;
  lastPlatformStatus?: {
    facebook?: 'success' | 'failure';
    instagram?: 'success' | 'failure';
  };
}

export interface BufferPoolStatus {
  reservePoolTotal: number;
  draftsAwaitingReview: number;
  approvedReadyToPost: number;
  lowStockThreshold: number; // e.g. 4
  autoReplenishActive: boolean;
  recycledFallbackActive: boolean;
  recycledCount: number;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  logoText: string;
  contactNumber: string;
  whatsappNumber: string;
  websiteUrl: string;
  socialHandle: string;
  accentColor: string;
  enablePriceInPoster: boolean;
  customLogoUrl?: string;
}

export interface PostingRules {
  primaryNiche: string;
  maxPostsPerDay: number;
  minTrendScore: number;
  allowedCategories: string[];
  blockedCategories: string[];
  autonomousEnabled: boolean;
  autoIntervalMinutes: number;
  requireManualApproval: boolean;
  metaFacebookPageId: string;
  metaFacebookPageName: string;
  metaFacebookPageToken?: string;
  metaInstagramHandle: string;
  metaInstagramAccountId?: string;
  metaConnected: boolean;
  peakHoursSlots?: string[];
  cronSecret?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  stage:
    | 'SYSTEM'
    | 'TREND_ENGINE'
    | 'STOCK_CHECK'
    | 'WEBSITE_MEDIA'
    | 'TELEGRAM'
    | 'AI_ANALYST'
    | 'CREATIVE_STUDIO'
    | 'QUALITY_GATE'
    | 'APPROVAL_GATE'
    | 'SCHEDULER'
    | 'META_PUBLISH';
  message: string;
  meta?: any;
}
