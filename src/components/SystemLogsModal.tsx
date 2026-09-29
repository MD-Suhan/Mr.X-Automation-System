import React, { useState } from 'react';
import { X, Trash2, Terminal, RefreshCw, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { SystemLog } from '../types/index.ts';

interface SystemLogsModalProps {
  logs: SystemLog[];
  onClose: () => void;
  onClear: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const SystemLogsModal: React.FC<SystemLogsModalProps> = ({
  logs,
  onClose,
  onClear,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stages = [
    'all',
    'TREND_ENGINE',
    'STOCK_CHECK',
    'TELEGRAM',
    'AI_ANALYST',
    'CREATIVE_STUDIO',
    'QUALITY_GATE',
    'META_PUBLISH',
  ];

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.stage === filter;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
      <div className="bg-slate-950 text-slate-100 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-800 font-mono text-xs">
        {/* Terminal Header - Sticky top with guaranteed close button */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-slate-200 truncate text-[11px] sm:text-xs">Orchestration Logs</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors ml-1"
              aria-label="Close logs"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500">Stage:</span>
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === st
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Log Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-slate-950">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No logs recorded yet.</div>
          ) : (
            filteredLogs.map((log) => {
              const isError = log.level === 'error';
              const isWarn = log.level === 'warn';
              const isSuccess = log.level === 'success';

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2.5 py-1 leading-relaxed border-b border-slate-900"
                >
                  <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      isError
                        ? 'text-rose-400'
                        : isWarn
                        ? 'text-amber-400'
                        : isSuccess
                        ? 'text-emerald-400'
                        : 'text-blue-400'
                    }`}
                  >
                    [{log.stage}]
                  </span>
                  <span
                    className={`${
                      isError
                        ? 'text-rose-300'
                        : isWarn
                        ? 'text-amber-200'
                        : isSuccess
                        ? 'text-emerald-200'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
