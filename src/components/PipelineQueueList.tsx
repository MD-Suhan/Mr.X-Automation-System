import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Trash2,
  ExternalLink,
  Layers,
  Facebook,
  Instagram,
  Clock,
  Send,
} from 'lucide-react';
import type { PipelineItem } from '../types/index.ts';

interface PipelineQueueListProps {
  items: PipelineItem[];
  onOpenStudio: (item: PipelineItem) => void;
  onQuickApprove?: (itemId: string) => void;
  onApproveAndPublish: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

export const PipelineQueueList: React.FC<PipelineQueueListProps> = ({
  items,
  onOpenStudio,
  onQuickApprove,
  onApproveAndPublish,
  onReject,
  onDelete,
}) => {
  const [filter, setFilter] = useState<'all' | 'drafts' | 'approved' | 'published' | 'recycled'>('all');

  const draftCount = items.filter((i) => i.stage === 'draft_review').length;
  const approvedCount = items.filter(
    (i) => i.stage === 'ready_approved' || i.stage === 'quality_approved'
  ).length;
  const publishedCount = items.filter((i) => i.stage === 'published').length;
  const recycledCount = items.filter((i) => i.isRecycled).length;

  const filteredItems = items.filter((item) => {
    if (filter === 'drafts') return item.stage === 'draft_review';
    if (filter === 'approved')
      return item.stage === 'ready_approved' || item.stage === 'quality_approved';
    if (filter === 'published') return item.stage === 'published';
    if (filter === 'recycled') return item.isRecycled;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header with Segmented Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Autonomous Pipeline Queue (পোস্টার কিউ ও রিভিউ)
          </h2>
          <p className="text-xs text-slate-500">
            ১০-১২টি পোস্টার ও ক্যাপশন পর্যবেক্ষণ করুন, অ্যাপ্রুভ করুন বা সোশ্যাল পাবলিশ করুন
          </p>
        </div>

        {/* Filter Segments */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('drafts')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'drafts'
                ? 'bg-amber-100 text-amber-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Awaiting Review ({draftCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'approved'
                ? 'bg-emerald-100 text-emerald-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved Ready ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'published'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published ({publishedCount})
          </button>
          {recycledCount > 0 && (
            <button
              onClick={() => setFilter('recycled')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'recycled'
                  ? 'bg-indigo-100 text-indigo-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recycled ({recycledCount})
            </button>
          )}
        </div>
      </div>

      {/* Product Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No products found in this view</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click "+ ১০-১২টি নতুন পোস্টার তৈরি করুন" উপরে বাফার পূরণ করতে
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => {
            const isPublished = item.stage === 'published';
            const isApproved =
              item.stage === 'ready_approved' || item.stage === 'quality_approved';
            const isDraft = item.stage === 'draft_review';
            const isRejected = item.stage === 'quality_rejected';
            const isRecycled = !!item.isRecycled;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Left: Product Thumbnail & Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={item.heroImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                    {item.images && item.images.length > 0 && (
                      <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] px-1 py-0.2">
                        {item.images.length}P
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
                        {item.productName}
                      </span>
                      {isRecycled && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ♻️ Recycled (Fresh Caption)
                        </span>
                      )}
                      {item.angleVariation && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.angleVariation}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-600 font-medium">Trend: {item.trendScore}%</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-600 font-medium">Stock Verified</span>
                      <span aria-hidden="true">·</span>
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600"
                      >
                        <span>Badhons World</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Stage Status and Publication Tag */}
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      {isPublished ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published to Facebook & Instagram</span>
                          <span className="text-slate-300 ml-1">·</span>
                          <span className="text-slate-500 font-normal">
                            Likes: {item.publishing.facebook.metrics.likes + item.publishing.instagram.metrics.likes}
                          </span>
                        </div>
                      ) : isApproved ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Ready — In Posting Reserve Buffer</span>
                        </div>
                      ) : isDraft ? (
                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Draft Awaiting Review — Click "Approve" or "View Studio"</span>
                        </div>
                      ) : isRejected ? (
                        <div className="flex items-center gap-1 text-rose-600 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected: {item.errorLog || 'Quality or stock mismatch'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-blue-600 font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Analyzing & Generating Creatives...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onOpenStudio(item)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Studio</span>
                  </button>

                  {isDraft && onQuickApprove && (
                    <button
                      onClick={() => onQuickApprove(item.id)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                      title="Approve this poster into the scheduled posting buffer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {(isApproved || isDraft) && (
                    <button
                      onClick={() => onApproveAndPublish(item.id)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                      title="Publish immediately to Facebook Page & Instagram"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Publish Now</span>
                    </button>
                  )}

                  {!isPublished && !isRejected && (
                    <button
                      onClick={() => onReject(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Reject from posting"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
