import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
  MessageSquare,
  History,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import type { PipelineItem, BrandSettings, PostingRules, PostHistoryRecord } from '../types/index.ts';
import { api } from '../services/api.ts';

interface MetaFeedsViewProps {
  items: PipelineItem[];
  brandSettings: BrandSettings;
  postingRules: PostingRules;
}

export const MetaFeedsView: React.FC<MetaFeedsViewProps> = ({
  items,
  brandSettings,
  postingRules,
}) => {
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'instagram' | 'history'>('facebook');
  const [historyRecords, setHistoryRecords] = useState<PostHistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.getPublicationHistory();
      if (res && Array.isArray(res.history)) {
        setHistoryRecords(res.history);
      }
    } catch (err) {
      console.warn('Could not load publication history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [items]);

  const publishedFacebookItems = items.filter(
    (i) => i.publishing?.facebook?.posted || i.stage === 'published' || (i.totalPublishedCount && i.totalPublishedCount > 0)
  );

  const publishedInstagramItems = items.filter(
    (i) => i.publishing?.instagram?.posted || i.stage === 'published' || (i.totalPublishedCount && i.totalPublishedCount > 0)
  );

  return (
    <div className="space-y-6">
      {/* Header and Platform Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Live Meta Publishing Feed & Audit History
            </h2>
            <p className="text-xs text-slate-500">
              Direct verification of real Meta Graph API deliveries, live Facebook/Instagram feeds, and historical audit logs.
            </p>
          </div>

          {/* Platform Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActivePlatform('facebook')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activePlatform === 'facebook'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook Page Feed</span>
              {publishedFacebookItems.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px]">
                  {publishedFacebookItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActivePlatform('instagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activePlatform === 'instagram'
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Feed</span>
              {publishedInstagramItems.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-pink-100 text-pink-700 rounded-full text-[10px]">
                  {publishedInstagramItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActivePlatform('history');
                fetchHistory();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activePlatform === 'history'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Publication History Log</span>
              {historyRecords.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded-full text-[10px]">
                  {historyRecords.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Credentials / Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1 font-medium ${
                postingRules.metaConnected ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {postingRules.metaConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Meta Graph API Token: Active Verified
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" /> Meta API: Configure Credentials in Settings
                </>
              )}
            </span>
            <span>·</span>
            <span>Page: {postingRules.metaFacebookPageName}</span>
            <span>·</span>
            <span>Account: {postingRules.metaInstagramHandle}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Automated Reseller Delivery System
          </span>
        </div>
      </div>

      {/* Tab: Publication History Log */}
      {activePlatform === 'history' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" /> Audited Publication History
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Every attempted automated and manual post to Facebook Page & Instagram with API response verification
              </p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={isLoadingHistory}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
              <span>Refresh Log</span>
            </button>
          </div>

          {historyRecords.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600">No publication records yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Approve any draft in the queue or trigger the auto-pilot cycle to record publication attempts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Status & Post ID</th>
                    <th className="py-3 px-4">Caption Snippet</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(record.timestamp).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {record.platform === 'facebook' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Facebook className="w-3 h-3" /> Facebook
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                            <Instagram className="w-3 h-3" /> Instagram
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {record.imageUrl && (
                            <img
                              src={record.imageUrl}
                              alt=""
                              className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <span className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]">
                            {record.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {record.status === 'success' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                            </span>
                            {record.platformPostId && (
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {record.platformPostId}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <XCircle className="w-3 h-3 text-rose-600" /> Failed
                            </span>
                            {record.error && (
                              <div className="text-[10px] text-rose-600 line-clamp-1 mt-0.5 max-w-[220px]" title={record.error}>
                                {record.error}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {record.captionSnippet || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {record.postUrl ? (
                          <a
                            href={record.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          >
                            <span>View Post</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activePlatform === 'facebook' ? (
        /* Facebook Feed View */
        publishedFacebookItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Facebook className="w-8 h-8 text-blue-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No Facebook posts published yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Approve posters in the queue to allow automated or manual publishing to your Facebook Page.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {publishedFacebookItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {brandSettings.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          {postingRules.metaFacebookPageName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>{item.publishing?.facebook?.timestamp ? new Date(item.publishing.facebook.timestamp).toLocaleTimeString() : 'Published'}</span>
                        <span>·</span>
                        <span>Public</span>
                        {item.publishing?.facebook?.postUrl && (
                          <>
                            <span>·</span>
                            <a
                              href={item.publishing.facebook.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Meta Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                {/* Post Caption */}
                <div className="px-4 pb-3 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bangla-text">
                  {item.caption?.fullFormattedText}
                </div>

                {/* Post Poster Creative */}
                <div className="relative w-full aspect-square bg-slate-950 overflow-hidden">
                  <img
                    src={item.heroImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {brandSettings.brandName}
                    </div>
                    <div className="text-sm font-extrabold truncate">
                      {item.creative?.headline || item.productName}
                    </div>
                  </div>
                </div>

                {/* Engagement Stats Bar */}
                <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      👍
                    </span>
                    <span>{item.publishing?.facebook?.metrics?.likes ?? 0} likes</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>{item.publishing?.facebook?.metrics?.comments ?? 0} comments</span>
                    <span>{item.publishing?.facebook?.metrics?.shares ?? 0} shares</span>
                  </div>
                </div>

                {/* Post Interaction Buttons */}
                <div className="px-2 py-1.5 flex items-center justify-around text-xs font-semibold text-slate-600">
                  <button className="flex items-center gap-1.5 py-1.5 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 py-1.5 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center gap-1.5 py-1.5 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Instagram Feed View */
        publishedInstagramItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Instagram className="w-8 h-8 text-pink-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">No Instagram posts published yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Approved creatives will be published to your connected Instagram Business profile.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            {publishedInstagramItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Instagram Post Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-[10px] text-slate-900">
                        {brandSettings.logoText}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {postingRules.metaInstagramHandle.replace('@', '')}
                      </span>
                      <span className="text-[10px] text-slate-400">Sponsored Promotional Ad</span>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                {/* Instagram Image */}
                <div className="relative w-full aspect-square bg-slate-950">
                  <img
                    src={item.heroImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
                      <MessageCircle className="w-5 h-5 text-slate-700 cursor-pointer" />
                      <Send className="w-5 h-5 text-slate-700 cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 text-slate-700 cursor-pointer" />
                  </div>

                  <div className="text-xs font-bold text-slate-900 mb-1.5">
                    {item.publishing?.instagram?.metrics?.likes ?? 0} likes
                  </div>

                  {/* Caption Snippet */}
                  <div className="text-xs text-slate-800 leading-relaxed bangla-text">
                    <span className="font-bold mr-1">
                      {postingRules.metaInstagramHandle.replace('@', '')}
                    </span>
                    {item.caption?.summaryHook || item.caption?.fullFormattedText}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-blue-600">
                    {(item.caption?.hashtags || []).map((tag, idx) => (
                      <span key={idx}>{tag}</span>
                    ))}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 uppercase">
                    Published via AutoResell AI Cloud Daemon
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
