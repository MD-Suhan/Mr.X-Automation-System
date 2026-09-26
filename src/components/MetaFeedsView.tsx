import React, { useState } from 'react';
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
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import type { PipelineItem, BrandSettings, PostingRules } from '../types/index.ts';

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
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'instagram'>('facebook');

  const publishedItems = items.filter((i) => i.stage === 'published');

  return (
    <div className="space-y-6">
      {/* Header and Platform Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Live Meta Publishing Feed (Facebook Page & Instagram)
            </h2>
            <p className="text-xs text-slate-500">
              Direct verification of automatically published promotional creatives, Bangla copy, and customer
              engagement metrics
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
              <span>Instagram Business Feed</span>
            </button>
          </div>
        </div>

        {/* Credentials / Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Meta Graph API Token: Active
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

      {publishedItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Share2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No published posts yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Run the pipeline on any in-stock product to publish automatically
          </p>
        </div>
      ) : activePlatform === 'facebook' ? (
        /* Facebook Feed View */
        <div className="max-w-2xl mx-auto space-y-6">
          {publishedItems.map((item) => (
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
                      <span>Just now</span>
                      <span>·</span>
                      <span>Public</span>
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
                  <span>{item.publishing.facebook.metrics.likes} likes</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>{item.publishing.facebook.metrics.comments} comments</span>
                  <span>{item.publishing.facebook.metrics.shares} shares</span>
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
      ) : (
        /* Instagram Feed View */
        <div className="max-w-md mx-auto space-y-6">
          {publishedItems.map((item) => (
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
                  {item.publishing.instagram.metrics.likes} likes
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
      )}
    </div>
  );
};
