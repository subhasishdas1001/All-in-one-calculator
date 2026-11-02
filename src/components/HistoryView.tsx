import React, { useState } from 'react';
import { Trash2, Copy, Check, ArrowUpRight, Search, Clock, Bookmark } from 'lucide-react';
import { CalculationHistoryItem, ToolId } from '../types/calculator';

interface HistoryViewProps {
  history: CalculationHistoryItem[];
  onDeleteOne: (id: string) => void;
  onTogglePin: (id: string) => void;
  onClearAll: () => void;
  onOpenTool: (toolId: ToolId) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onDeleteOne,
  onTogglePin,
  onClearAll,
  onOpenTool,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inputsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resultSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPin = !filterSavedOnly || Boolean(item.isPinned);
    return matchesSearch && matchesPin;
  });

  const handleCopyItem = async (item: CalculationHistoryItem) => {
    try {
      await navigator.clipboard.writeText(
        `${item.toolName}\nInputs: ${item.inputsSummary}\nResult: ${item.resultSummary}\nTime: ${item.timestamp}`
      );
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Calculation History & Saved Records
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            All calculations are stored privately in your browser. Bookmark important calculations to keep them saved.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-xs font-semibold flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All History ({history.length})</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter history by calculator name or value..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterSavedOnly((v) => !v)}
            className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              filterSavedOnly
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved / Bookmarked Only</span>
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {history.length === 0 ? 'No Calculation History Yet' : 'No Matching History Entries'}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {history.length === 0
              ? 'When you calculate scores, percentages, EMIs, or conversions, your results are automatically logged here with timestamps.'
              : 'Try clearing your search or bookmark filter to see all saved calculations.'}
          </p>
          {history.length === 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenTool('negative-marking')}
                className="min-h-[42px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
              >
                Try Negative Marking Calculator
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => onOpenTool(item.toolId)}
                    className="font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{item.toolName}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{item.timestamp}</span>
                  {item.isPinned && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Saved
                      </span>
                    </>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono">
                  Inputs: {item.inputsSummary}
                </div>

                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {item.resultSummary}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onTogglePin(item.id)}
                  aria-label="Save or bookmark calculation"
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    item.isPinned
                      ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{item.isPinned ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyItem(item)}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteOne(item.id)}
                  aria-label="Delete history item"
                  className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
