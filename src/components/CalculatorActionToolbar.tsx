import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  RotateCcw,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
} from 'lucide-react';
import { CalculatorMeta } from '../types/calculator';

interface ActionToolbarProps {
  resultText: string;
  onReset: () => void;
  onCalculate?: () => void;
  calculateLabel?: string;
}

export const CalculatorActionBar: React.FC<ActionToolbarProps> = ({
  resultText,
  onReset,
  onCalculate,
  calculateLabel = 'Calculate Result',
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedStatus, setSharedStatus] = useState<string | null>(null);
  const [recalcPulse, setRecalcPulse] = useState(false);

  const handleCopy = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (!resultText) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SmartCalc Result',
          text: resultText,
        });
        return;
      } catch {
        // Fallback to clipboard copy if user cancels or share fails
      }
    }
    try {
      await navigator.clipboard.writeText(resultText);
      setSharedStatus('Result Copied');
      setTimeout(() => setSharedStatus(null), 2200);
    } catch {
      // Ignore
    }
  };

  const handleRecalculate = () => {
    setRecalcPulse(true);
    setTimeout(() => setRecalcPulse(false), 350);
    if (onCalculate) {
      onCalculate();
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Primary Prominent Calculate Button */}
      {onCalculate && (
        <button
          type="button"
          onClick={onCalculate}
          className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-sm shadow-sky-600/20"
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span>{calculateLabel}</span>
        </button>
      )}

      {/* Quick Actions Bar: ↻ Recalculate · Reset · Copy Result · Share Result */}
      <div className="flex flex-wrap items-center gap-2">
        {onCalculate && (
          <button
            type="button"
            onClick={handleRecalculate}
            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                recalcPulse ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
              }`}
            />
            <span>↻ Recalculate</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {resultText && (
          <>
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Result</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{sharedStatus || 'Share Result'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

interface BreakdownStep {
  label: string;
  expression: string;
  highlight?: boolean;
}

export const HowWasThisCalculated: React.FC<{
  title?: string;
  steps: BreakdownStep[];
  defaultOpen?: boolean;
}> = ({ title = 'How was this calculated?', steps, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-900 transition-colors cursor-pointer"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-200/70 dark:border-slate-800/80">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex flex-wrap items-baseline justify-between gap-2 py-1.5 text-xs sm:text-sm ${
                idx < steps.length - 1
                  ? 'border-b border-slate-200/60 dark:border-slate-800/60'
                  : ''
              }`}
            >
              <span
                className={
                  step.highlight
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }
              >
                {step.label}
              </span>
              <span
                className={`font-mono tabular-nums ${
                  step.highlight
                    ? 'font-extrabold text-sky-600 dark:text-sky-400 text-sm sm:text-base'
                    : 'font-semibold text-slate-900 dark:text-slate-200'
                }`}
              >
                {step.expression}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TermTooltipProps {
  label: string;
  explanation: string;
}

export const LabelWithTooltip: React.FC<TermTooltipProps> = ({ label, explanation }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label={`Explanation for ${label}`}
        className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer p-0.5"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-slate-100 text-xs leading-relaxed shadow-lg border border-slate-700 z-30 pointer-events-none"
        >
          {explanation}
        </div>
      )}
    </div>
  );
};

export const ToolHowToAccordion: React.FC<{ meta: CalculatorMeta }> = ({ meta }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-2 text-left text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
      >
        <span>How to Use {meta.name} & Example</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2.5">
              Step-by-Step Instructions
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {meta.howToSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Formula Reference
            </div>
            <div className="font-mono text-xs text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
              {meta.formulaSummary}
            </div>
            <div className="pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Worked Example — {meta.example.scenario}
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="font-semibold">Inputs:</strong> {meta.example.inputs}
            </div>
            <div className="text-xs text-sky-700 dark:text-sky-400 font-mono">
              <strong className="font-sans font-semibold">Result:</strong> {meta.example.output}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
