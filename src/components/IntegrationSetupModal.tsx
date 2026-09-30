import React, { useState } from 'react';
import {
  X,
  Share2,
  Send,
  Globe,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Check,
  Save,
} from 'lucide-react';
import type { PostingRules } from '../types/index.ts';
import { api } from '../services/api.ts';

interface IntegrationSetupModalProps {
  postingRules: PostingRules;
  onClose: () => void;
  onSaveCredentials: (credentials: any) => Promise<void>;
}

export const IntegrationSetupModal: React.FC<IntegrationSetupModalProps> = ({
  postingRules,
  onClose,
  onSaveCredentials,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'meta' | 'website' | 'n8n'>('overview');

  // Meta Credentials State (Real Values from Posting Rules)
  const [metaPageId, setMetaPageId] = useState(postingRules.metaFacebookPageId || '');
  const [metaPageToken, setMetaPageToken] = useState(postingRules.metaFacebookPageToken || '');
  const [igAccountId, setIgAccountId] = useState(postingRules.metaInstagramAccountId || '');
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Webhook / n8n State
  const [webhookUrl, setWebhookUrl] = useState('https://your-n8n-instance.com/webhook/badhons-marketing');
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleTestMeta = async () => {
    setIsTestingMeta(true);
    setMetaTestResult(null);
    try {
      const res = await api.testMetaCredentials({
        pageId: metaPageId,
        pageToken: metaPageToken,
        igAccountId,
      });
      if (res.success) {
        setMetaTestResult({
          success: true,
          message: res.message || `Meta Graph API Connected! Page verified: "${res.pageName || metaPageId}".`,
        });
      } else {
        setMetaTestResult({
          success: false,
          message: res.error || 'Meta connection verification failed. Please check your Page ID and Token.',
        });
      }
    } catch (err: any) {
      setMetaTestResult({
        success: false,
        message: `Network error: ${err.message}`,
      });
    } finally {
      setIsTestingMeta(false);
    }
  };

  const handleSaveMeta = async () => {
    setIsSaving(true);
    try {
      await onSaveCredentials({
        metaFacebookPageId: metaPageId,
        metaFacebookPageToken: metaPageToken,
        metaInstagramAccountId: igAccountId,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const copyCurlCode = () => {
    const code = `curl -X POST "${window.location.origin}/api/pipeline/run-full" \\
  -H "Content-Type: application/json" \\
  -d '{"autoPublish": true}'`;
    navigator.clipboard.writeText(code);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[96vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header - Sticky top with guaranteed close button */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white shrink-0 flex items-center justify-center font-bold text-xs">
              <Key className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Connect Accounts & APIs
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                Facebook Page, Instagram, Telegram & Badhons World Scraper
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all shadow-xs border border-slate-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-3 sm:px-6 pt-2 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            কীভাবে কাজ করে (Overview)
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'meta'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            Facebook + Instagram API
          </button>
          <button
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'website'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            Badhons World Website (Direct)
          </button>
          <button
            onClick={() => setActiveTab('n8n')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'n8n'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            n8n / Webhook Trigger
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 leading-relaxed">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  💡 আমি আপনাকে কোনো ক্রেডেনশিয়াল/কী দেইনি, তবে সিস্টেম তৈরি হলো কীভাবে?
                </h3>
                <p className="text-slate-700 mb-2">
                  আমরা আপনার প্রজেক্টের <strong>সম্পূর্ণ আর্কিটেকচার, অটোমেশন ইঞ্জিন, এআই লজিক ও ড্যাশবোর্ড</strong> তৈরি করে দিয়েছি যাতে আপনি সরাসরি স্ক্রিন থেকেই দেখতে ও নিয়ন্ত্রণ করতে পারেন।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-slate-800 font-medium">
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gemini 3.8 Flash AI মডেল দিয়ে রিয়েল-টাইম ট্রেন্ড অ্যানালাইসিস ও বাংলা ক্যাপশন ইঞ্জিন সম্পূর্ণ সক্রিয়।</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Canvas Poster Studio তৈরি যা অরিজিনাল প্রোডাক্টের শেপ/বাটন অবিকৃত রেখে ১০৮০×১০৮০ পোস্টার রেন্ডার করে।</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>ডুপ্লিকেট প্রোটেকশন ডাটাবেজ এবং কোয়ালিটি গেট সেফটি ফিল্টার শতভাগ প্রস্তুত।</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>এখন শুধু আপনার নিজস্ব ফেসবুক/ইনস্টাগ্রাম টোকেন এবং টেলিগ্রাম আইডি কানেক্ট করলেই এটি লাইভ কাজ শুরু করবে!</span>
                  </div>
                </div>
              </div>

              {/* 3 Step Workflow */}
              <div className="pt-2 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  প্রোডাকশনে লাইভ চালানোর ৩টি সাধারণ ধাপ:
                </h4>

                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-0.5">টেলিগ্রাম প্রাইভেট চ্যানেল থেকে ফটো ও লিংক সংগ্রহ:</h5>
                    <p className="text-slate-600">
                      যেহেতু Badhons World-এর টেলিগ্রাম চ্যানেল প্রাইভেট এবং আপনি মেম্বার, তাই টেলিগ্রামের অফিশিয়াল ক্লায়েন্ট (GramJS/Telethon বা n8n টেলিগ্রাম ট্রিগার) দিয়ে স্বয়ংক্রিয়ভাবে নতুন পোস্টের ১০-১৫টি ছবি ডাউনলোড করা যায়। অথবা সরাসরি Badhons World-এর পাবলিক ওয়েবসাইট থেকেই ছবি ও স্টক স্টেটাস নেওয়া যায়।
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-0.5">এআই ক্রিয়েটিভ ও কোয়ালিটি গেট:</h5>
                    <p className="text-slate-600">
                      সংগৃহীত ছবি ও প্রোডাক্টের স্পেক দেখে এআই প্রোডাক্টের ফিজিক্যাল শেপ অবিকৃত রেখে ব্যানার পোস্টার বানায়, বাংলা ক্যাপশন তৈরি করে এবং স্টক ও বানান যাচাই করে।
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-0.5">Facebook ও Instagram-এ স্বয়ংক্রিয় পোস্ট:</h5>
                    <p className="text-slate-600">
                      মেটার অফিশিয়াল নিয়ম অনুযায়ী ফেসবুক পাসওয়ার্ড লাগে না। <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">developers.facebook.com</a> থেকে একটি ফ্রি "Page Access Token" নিয়ে আমাদের সিস্টেমে দিয়ে দিলেই স্বয়ংক্রিয়ভাবে পোস্ট হওয়া শুরু হবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: META (FACEBOOK + INSTAGRAM) */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">
                  Facebook Page ও Instagram-এ স্বয়ংক্রিয় পোস্ট কীভাবে হয়?
                </span>
                <p className="text-slate-600">
                  মেটা (Meta)-এর অফিশিয়াল <strong>Graph API</strong> ব্যবহার করে পোস্ট হয়। কোনো ব্রাউজার এক্সটেনশন বা পাসওয়ার্ড দেওয়ার দরকার নেই। আপনি শুধু একটি <code>Page Access Token</code> দিলে ব্যাকএন্ড সরাসরি মেটার সার্ভারে পোস্ট পাঠিয়ে দেয়।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Facebook Page ID</label>
                  <input
                    type="text"
                    value={metaPageId}
                    onChange={(e) => setMetaPageId(e.target.value)}
                    placeholder="e.g. 109283749102938"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    আপনার ফেসবুক পেইজের About সেকশন থেকে Page ID পাবেন।
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Instagram Business Account ID</label>
                  <input
                    type="text"
                    value={igAccountId}
                    onChange={(e) => setIgAccountId(e.target.value)}
                    placeholder="e.g. 178414002938471"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    ফেসবুক পেইজের সাথে লিঙ্ক করা ইনস্টাগ্রাম প্রফেশনাল একাউন্ট আইডি।
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-800 block mb-1">
                    Meta Page Access Token (Never Expires / Permanent Token)
                  </label>
                  <input
                    type="password"
                    value={metaPageToken}
                    onChange={(e) => setMetaPageToken(e.target.value)}
                    placeholder="EAAOx..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Required Scopes: <code>pages_manage_posts</code>, <code>pages_read_engagement</code>, <code>instagram_content_publish</code>
                  </span>
                </div>
              </div>

              {metaTestResult && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-2 border text-xs leading-relaxed ${
                    metaTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {metaTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{metaTestResult.message}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Meta credentials saved successfully to backend!</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestMeta}
                  disabled={isTestingMeta}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingMeta ? 'animate-spin' : ''}`} />
                  <span>{isTestingMeta ? 'Verifying with Meta API...' : 'Test Meta Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveMeta}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Meta Credentials'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BADHONS WORLD DIRECT WEBSITE SCRAPER */}
          {activeTab === 'website' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">
                  Badhons World পাবলিক ওয়েবসাইট স্ক্র্যাপার (Direct Image & Stock Sourcing)
                </span>
                <p className="text-slate-600">
                  টেলিগ্রামের কোনো ঝামেলা নেই—সরাসরি <code>badhonsworld.com</code> / <code>mayonsbd.com</code> পাবলিক ওয়েবসাইট থেকে প্রোডাক্টের নাম, স্পেসিফিকেশন, ইমেজ ও <strong>রিয়েল-টাইম স্টক স্ট্যাটাস</strong> নেওয়া হয়। ওয়েবসাইট ইমেজ যেমন রেজোলিউশনেরই হোক, AI প্রম্পট ইঞ্জিনে প্রোডাক্টকে হিরো সাবজেক্ট বানিয়ে সিনেমাটিক পোস্টার তৈরি করে।
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Target Supplier URL</span>
                    <span className="text-slate-500 font-mono text-[11px]">https://badhonsworld.com</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                    Direct Sourcing Active
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Authentication Requirement</span>
                    <span className="text-slate-500 text-[11px]">No Login / No Reseller Dashboard Needed</span>
                  </div>
                  <span className="text-slate-600 text-xs font-semibold">100% Free Public Access</span>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Product Media Extraction</span>
                    <span className="text-slate-500 text-[11px]">Direct website gallery images used as visual truth</span>
                  </div>
                  <span className="text-emerald-700 text-xs font-semibold">Automatic Extraction</span>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Stock Verification Strategy</span>
                    <span className="text-slate-500 text-[11px]">Verifies "Add to Cart" / Stock Badge before generating ad</span>
                  </div>
                  <span className="text-blue-600 text-xs font-semibold">Automated Gatekeeper</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: N8N / WEBHOOK */}
          {activeTab === 'n8n' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">
                  n8n ক্লাউড ওয়ার্কফ্লো ইন্টিগ্রেশন
                </span>
                <p className="text-slate-600">
                  আপনার স্পেসিফিকেশনে n8n-এর প্রস্তাবনা ছিল। আপনি চাইলে n8n-এর মাধ্যমে একটি ক্রন শিডিউল বা কাস্টম ট্রিগার নোড বানিয়ে সরাসরি আমাদের এই অ্যাপের API-কে কল করতে পারেন।
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Pipeline Execution Webhook Endpoint (cURL / HTTP Request Node)
                </label>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto relative">
                  <pre>{`curl -X POST "${window.location.origin}/api/pipeline/run-full" \\
  -H "Content-Type: application/json" \\
  -d '{"autoPublish": true}'`}</pre>
                  <button
                    type="button"
                    onClick={copyCurlCode}
                    className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] flex items-center gap-1"
                  >
                    {copiedCurl ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            AutoResell AI Security: Credentials are encrypted and kept server-side only.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
