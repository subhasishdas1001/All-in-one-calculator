import React, { useState, useEffect, useCallback } from 'react';
import { Delete, History, Trash2 } from 'lucide-react';
import { evaluateScientificExpression, formatNum } from '../../utils/mathEngine';
import { CalculatorActionBar } from '../CalculatorActionToolbar';
import { ToolId } from '../../types/calculator';

interface CalcProps {
  mode: 'normal' | 'scientific';
  onLogHistory: (toolId: ToolId, toolName: string, inputs: string, result: string) => void;
}

interface TapeEntry {
  expression: string;
  result: string;
}

const NORMAL_CALC_EXAMPLES = [
  { label: 'Ex 1: (450 × 3) ÷ 5', expr: '(450×3)÷5' },
  { label: 'Ex 2: 1250 + 225 − 75', expr: '1250+225−75' },
  { label: 'Ex 3: 850 × 18%', expr: '850×18%' },
  { label: 'Ex 4: 99.95 + 140.05', expr: '99.95+140.05' },
];

const SCIENTIFIC_CALC_EXAMPLES = [
  { label: 'Ex 1: sin(30) + cos(60) + log(100)', expr: 'sin(30)+cos(60)+log(100)', deg: true },
  { label: 'Ex 2: √(144) + 5! − 2^4', expr: '√(144)+5!−2^4', deg: true },
  { label: 'Ex 3: tan(45) + sin⁻¹(0.5)', expr: 'tan(45)+sin⁻¹(0.5)', deg: true },
  { label: 'Ex 4: ln(e) + 10^3', expr: 'ln(e)+10^3', deg: false },
];

export const StandardScientificCalculator: React.FC<CalcProps> = ({ mode, onLogHistory }) => {
  const [expression, setExpression] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('0');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [error, setError] = useState<string | null>(null);
  const [localTape, setLocalTape] = useState<TapeEntry[]>([]);

  const appendToken = useCallback((token: string) => {
    setError(null);
    setExpression((prev) => prev + token);
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setDisplayResult('0');
    setError(null);
  }, []);

  const handleDelete = useCallback(() => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const evaluateCustomExpr = useCallback(
    (exprToRun: string, targetAngle: 'DEG' | 'RAD') => {
      if (!exprToRun.trim()) return;
      const outcome = evaluateScientificExpression(exprToRun, targetAngle);
      if (outcome.error) {
        setError(outcome.error);
        return;
      }
      if (outcome.result !== undefined) {
        const formatted = formatNum(outcome.result, 8);
        setDisplayResult(formatted);
        setError(null);
        setLocalTape((prev) => [{ expression: exprToRun, result: formatted }, ...prev.slice(0, 14)]);
        onLogHistory(
          mode === 'scientific' ? 'scientific-calc' : 'normal-calc',
          mode === 'scientific' ? `Scientific Calculator (${targetAngle})` : 'Normal Calculator',
          exprToRun,
          formatted
        );
      }
    },
    [mode, onLogHistory]
  );

  const handleEvaluate = useCallback(() => {
    if (!expression.trim()) return;
    const outcome = evaluateScientificExpression(expression, angleMode);
    if (outcome.error) {
      setError(outcome.error);
      return;
    }
    if (outcome.result !== undefined) {
      const formatted = formatNum(outcome.result, 8);
      setDisplayResult(formatted);
      setError(null);
      setLocalTape((prev) => [{ expression, result: formatted }, ...prev.slice(0, 14)]);
      onLogHistory(
        mode === 'scientific' ? 'scientific-calc' : 'normal-calc',
        mode === 'scientific' ? `Scientific Calculator (${angleMode})` : 'Normal Calculator',
        expression,
        formatted
      );
      setExpression(String(outcome.result));
    }
  }, [expression, angleMode, mode, onLogHistory]);

  // Keyboard support on desktop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        appendToken(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        appendToken('.');
      } else if (e.key === '+') {
        e.preventDefault();
        appendToken('+');
      } else if (e.key === '-') {
        e.preventDefault();
        appendToken('−');
      } else if (e.key === '*') {
        e.preventDefault();
        appendToken('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendToken('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        appendToken('%');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        appendToken(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        appendToken('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendToken, handleEvaluate, handleDelete, handleClear]);

  const scientificButtons = [
    { label: 'sin', token: 'sin(' },
    { label: 'cos', token: 'cos(' },
    { label: 'tan', token: 'tan(' },
    { label: 'sin⁻¹', token: 'sin⁻¹(' },
    { label: 'cos⁻¹', token: 'cos⁻¹(' },
    { label: 'tan⁻¹', token: 'tan⁻¹(' },
    { label: 'log', token: 'log(' },
    { label: 'ln', token: 'ln(' },
    { label: '√', token: '√(' },
    { label: 'x²', token: '^2' },
    { label: 'xʸ', token: '^' },
    { label: 'n!', token: '!' },
    { label: 'π', token: 'π' },
    { label: 'e', token: 'e' },
    { label: '(', token: '(' },
    { label: ')', token: ')' },
  ];

  return (
    <div className="space-y-5">
      {/* Multi-Example Quick Test Buttons */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Click an Example Expression to Test & Verify:
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === 'normal'
            ? NORMAL_CALC_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    setExpression(ex.expr);
                    evaluateCustomExpr(ex.expr, 'DEG');
                  }}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium cursor-pointer"
                >
                  {ex.label}
                </button>
              ))
            : SCIENTIFIC_CALC_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    const nextMode = ex.deg ? 'DEG' : 'RAD';
                    setAngleMode(nextMode);
                    setExpression(ex.expr);
                    evaluateCustomExpr(ex.expr, nextMode);
                  }}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          {/* Top Mode & Keyboard Notice */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Keyboard active: 0–9, +, −, *, /, Enter (=), Backspace, Esc (AC)
            </span>
            {mode === 'scientific' && (
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setAngleMode('DEG')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                    angleMode === 'DEG'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  DEG
                </button>
                <button
                  type="button"
                  onClick={() => setAngleMode('RAD')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                    angleMode === 'RAD'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  RAD
                </button>
              </div>
            )}
          </div>

          {/* Calculator Display Screen */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-right space-y-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => {
                setError(null);
                setExpression(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEvaluate();
                }
              }}
              placeholder="0"
              aria-label="Calculator Expression Input"
              className="w-full bg-transparent text-right font-mono text-base sm:text-lg text-slate-300 focus:outline-none placeholder:text-slate-600"
            />
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-white truncate">
              {error ? (
                <span className="text-sm font-sans font-medium text-rose-400">{error}</span>
              ) : (
                displayResult
              )}
            </div>
          </div>

          {/* Scientific Keypad Row (when mode === 'scientific') */}
          {mode === 'scientific' && (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {scientificButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => appendToken(btn.token)}
                  className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm font-semibold transition-colors cursor-pointer active:scale-[0.98]"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Standard Numeric & Operator Pad */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[52px] rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 font-bold text-base transition-colors cursor-pointer"
            >
              AC
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete last character"
              className="min-h-[52px] rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base flex items-center justify-center transition-colors cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => appendToken('%')}
              className="min-h-[52px] rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-lg transition-colors cursor-pointer"
            >
              %
            </button>
            <button
              type="button"
              onClick={() => appendToken('÷')}
              className="min-h-[52px] rounded-xl bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 dark:hover:bg-sky-900/70 text-sky-700 dark:text-sky-300 font-mono font-bold text-xl transition-colors cursor-pointer"
            >
              ÷
            </button>

            {['7', '8', '9'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => appendToken(n)}
                className="min-h-[52px] rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono font-bold text-lg transition-colors cursor-pointer active:scale-[0.98]"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => appendToken('×')}
              className="min-h-[52px] rounded-xl bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 dark:hover:bg-sky-900/70 text-sky-700 dark:text-sky-300 font-mono font-bold text-xl transition-colors cursor-pointer"
            >
              ×
            </button>

            {['4', '5', '6'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => appendToken(n)}
                className="min-h-[52px] rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono font-bold text-lg transition-colors cursor-pointer active:scale-[0.98]"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => appendToken('−')}
              className="min-h-[52px] rounded-xl bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 dark:hover:bg-sky-900/70 text-sky-700 dark:text-sky-300 font-mono font-bold text-xl transition-colors cursor-pointer"
            >
              −
            </button>

            {['1', '2', '3'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => appendToken(n)}
                className="min-h-[52px] rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono font-bold text-lg transition-colors cursor-pointer active:scale-[0.98]"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => appendToken('+')}
              className="min-h-[52px] rounded-xl bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 dark:hover:bg-sky-900/70 text-sky-700 dark:text-sky-300 font-mono font-bold text-xl transition-colors cursor-pointer"
            >
              +
            </button>

            <button
              type="button"
              onClick={() => appendToken('0')}
              className="col-span-2 min-h-[52px] rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono font-bold text-lg transition-colors cursor-pointer active:scale-[0.98]"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => appendToken('.')}
              className="min-h-[52px] rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white font-mono font-bold text-xl transition-colors cursor-pointer"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleEvaluate}
              className="min-h-[52px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xl transition-colors cursor-pointer active:scale-[0.98]"
            >
              =
            </button>
          </div>

          <CalculatorActionBar
            onCalculate={handleEvaluate}
            resultText={displayResult !== '0' ? `${expression} = ${displayResult}` : ''}
            onReset={handleClear}
          />
        </div>

        {/* Live Calculation Tape / Session History */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Calculation Tape
              </h3>
            </div>
            {localTape.length > 0 && (
              <button
                type="button"
                onClick={() => setLocalTape([])}
                className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Tape</span>
              </button>
            )}
          </div>

          {localTape.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              Your recent calculations in this session will appear here. Click any past result to reuse it.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
              {localTape.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setExpression(item.result.replace(/,/g, ''));
                    setDisplayResult(item.result);
                  }}
                  className="w-full py-3 px-2 text-right hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer block"
                >
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {item.expression} =
                  </div>
                  <div className="text-base font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {item.result}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
