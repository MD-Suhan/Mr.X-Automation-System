import React, { useState } from 'react';
import {
  X,
  Save,
  Sliders,
  Sparkles,
  ShieldAlert,
  Smartphone,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import type { BrandSettings, PostingRules } from '../types/index.ts';

interface SettingsModalProps {
  brandSettings: BrandSettings;
  postingRules: PostingRules;
  onClose: () => void;
  onSave: (payload: {
    newBrandSettings?: Partial<BrandSettings>;
    newPostingRules?: Partial<PostingRules>;
  }) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  brandSettings,
  postingRules,
  onClose,
  onSave,
}) => {
  const [brand, setBrand] = useState<BrandSettings>({ ...brandSettings });
  const [rules, setRules] = useState<PostingRules>({ ...postingRules });
  const [isSaving, setIsSaving] = useState(false);
  const [newAllowedCat, setNewAllowedCat] = useState('');
  const [newBlockedCat, setNewBlockedCat] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        newBrandSettings: brand,
        newPostingRules: rules,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const addAllowedCategory = () => {
    if (newAllowedCat.trim() && !rules.allowedCategories.includes(newAllowedCat.trim())) {
      setRules({
        ...rules,
        allowedCategories: [...rules.allowedCategories, newAllowedCat.trim()],
      });
      setNewAllowedCat('');
    }
  };

  const removeAllowedCategory = (cat: string) => {
    setRules({
      ...rules,
      allowedCategories: rules.allowedCategories.filter((c) => c !== cat),
    });
  };

  const addBlockedCategory = () => {
    if (newBlockedCat.trim() && !rules.blockedCategories.includes(newBlockedCat.trim())) {
      setRules({
        ...rules,
        blockedCategories: [...rules.blockedCategories, newBlockedCat.trim()],
      });
      setNewBlockedCat('');
    }
  };

  const removeBlockedCategory = (cat: string) => {
    setRules({
      ...rules,
      blockedCategories: rules.blockedCategories.filter((c) => c !== cat),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Marketing Automation Rules & Brand Identity
              </h2>
              <p className="text-xs text-slate-500">
                Configure autonomous niche parameters, daily limits, and brand watermark
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Posting Rules (Specification Item 11) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
              Posting Rules & Discovery Bounds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Primary Niche
                </label>
                <input
                  type="text"
                  value={rules.primaryNiche}
                  onChange={(e) => setRules({ ...rules, primaryNiche: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Maximum Posts / Day
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={rules.maxPostsPerDay}
                  onChange={(e) =>
                    setRules({ ...rules, maxPostsPerDay: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Minimum Trend Score (0-100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={rules.minTrendScore}
                  onChange={(e) =>
                    setRules({ ...rules, minTrendScore: parseInt(e.target.value, 10) || 50 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Autonomous Cycle (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={1440}
                  value={rules.autoIntervalMinutes}
                  onChange={(e) =>
                    setRules({ ...rules, autoIntervalMinutes: parseInt(e.target.value, 10) || 30 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Allowed Categories */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Allowed Categories (Products to Pick)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {rules.allowedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-md border border-emerald-200"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => removeAllowedCategory(cat)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. Smart Watch, Earbuds"
                  value={newAllowedCat}
                  onChange={(e) => setNewAllowedCat(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 flex-1"
                />
                <button
                  type="button"
                  onClick={addAllowedCategory}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Blocked Categories */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Blocked Categories (Products to Exclude)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {rules.blockedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 text-xs px-2.5 py-1 rounded-md border border-rose-200"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => removeBlockedCategory(cat)}
                      className="text-rose-600 hover:text-rose-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. Clothing, Beauty"
                  value={newBlockedCat}
                  onChange={(e) => setNewBlockedCat(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 flex-1"
                />
                <button
                  type="button"
                  onClick={addBlockedCategory}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Manual Approval Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rules.requireManualApproval}
                  onChange={(e) =>
                    setRules({ ...rules, requireManualApproval: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Require manual review before publishing to Facebook and Instagram (Quality Approval Gate)
                </span>
              </label>
            </div>
          </div>

          {/* Section 2: Brand Identity (Specification Item 7) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
              Brand Identity & Social Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brand.brandName}
                  onChange={(e) => setBrand({ ...brand, brandName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Logo Initials / Monogram
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={brand.logoText}
                  onChange={(e) => setBrand({ ...brand, logoText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={brand.tagline}
                  onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  WhatsApp Contact Number (Order CTA)
                </label>
                <input
                  type="text"
                  value={brand.whatsappNumber}
                  onChange={(e) => setBrand({ ...brand, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Meta Authorization (Specification Item 9) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
              Meta Publishing Authorization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Facebook Page Name
                </label>
                <input
                  type="text"
                  value={rules.metaFacebookPageName}
                  onChange={(e) => setRules({ ...rules, metaFacebookPageName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={rules.metaInstagramHandle}
                  onChange={(e) => setRules({ ...rules, metaInstagramHandle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
