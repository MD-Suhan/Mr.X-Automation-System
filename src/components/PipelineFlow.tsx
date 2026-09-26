import React from 'react';
import {
  TrendingUp,
  PackageCheck,
  Globe,
  Brain,
  Palette,
  ShieldAlert,
  Share2,
  Check,
} from 'lucide-react';
import type { PipelineItem } from '../types/index.ts';

interface PipelineFlowProps {
  items: PipelineItem[];
  onSelectItem?: (item: PipelineItem) => void;
}

export const PipelineFlow: React.FC<PipelineFlowProps> = ({ items, onSelectItem }) => {
  const steps = [
    {
      num: '01',
      title: 'Trend Discovery',
      description: 'Facebook, Reels & Search signals',
      icon: TrendingUp,
      count: items.length,
      color: 'blue',
    },
    {
      num: '02',
      title: 'Stock Verification',
      description: 'Badhons World public catalogue',
      icon: PackageCheck,
      count: items.filter((i) => i.stockVerified).length,
      color: 'emerald',
    },
    {
      num: '03',
      title: 'Website Media Sourcing',
      description: 'Badhons World direct photos',
      icon: Globe,
      count: items.filter((i) => i.images && i.images.length > 0).length,
      color: 'cyan',
    },
    {
      num: '04',
      title: 'AI Product Analyst',
      description: 'Audience & feature comprehension',
      icon: Brain,
      count: items.filter((i) => !!i.aiAnalysis).length,
      color: 'indigo',
    },
    {
      num: '05',
      title: 'Poster & Caption',
      description: 'Cinematic ad & Bangla copy',
      icon: Palette,
      count: items.filter((i) => !!i.creative).length,
      color: 'purple',
    },
    {
      num: '06',
      title: 'Safety Quality Gate',
      description: 'Product fidelity & copy check',
      icon: ShieldAlert,
      count: items.filter((i) => i.qualityCheck?.passed).length,
      color: 'amber',
    },
    {
      num: '07',
      title: 'Meta FB & IG',
      description: 'Automated dual publishing',
      icon: Share2,
      count: items.filter((i) => i.stage === 'published').length,
      color: 'pink',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Autonomous Marketing Execution Pipeline
          </h2>
          <p className="text-xs text-slate-500">
            Real-time multi-agent workflow: Trend detection to Facebook & Instagram publication
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Supplier: Badhons World / Mayons BD</span>
          <span aria-hidden="true">·</span>
          <span>Zero Login Required</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-3 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  {step.num}
                </span>
                <span className="text-xs font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                  {step.count}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <h3 className="text-xs font-semibold text-slate-900 truncate">
                  {step.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
