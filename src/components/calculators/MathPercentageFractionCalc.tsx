import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatNum, gcd, roundNum } from '../../utils/mathEngine';
import {
  CalculatorActionBar,
  HowWasThisCalculated,
} from '../CalculatorActionToolbar';
import { ToolId } from '../../types/calculator';

interface CalcLoggerProps {
  onLogHistory: (toolId: ToolId, toolName: string, inputs: string, result: string) => void;
}

type PctMode =
  | 'x-pct-of-y'
  | 'x-is-what-pct-of-y'
  | 'pct-increase'
  | 'pct-decrease'
  | 'pct-difference';

const PCT_EXAMPLES: { label: string; mode: PctMode; a: string; b: string }[] = [
  { label: '25% of 400 (= 100)', mode: 'x-pct-of-y', a: '25', b: '400' },
  { label: '432 is what % of 500 (= 86.4%)', mode: 'x-is-what-pct-of-y', a: '432', b: '500' },
  { label: 'Increase 200 → 250 (+25%)', mode: 'pct-increase', a: '200', b: '250' },
  { label: 'Decrease 500 → 400 (20%)', mode: 'pct-decrease', a: '500', b: '400' },
  { label: 'Difference 80 vs 100 (22.22%)', mode: 'pct-difference', a: '80', b: '100' },
];

export const PercentageCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [mode, setMode] = useState<PctMode>('x-pct-of-y');
  const [valA, setValA] = useState<string>('25');
  const [valB, setValB] = useState<string>('400');
  const [error, setError] = useState<string | null>(null);

  const modes: { id: PctMode; label: string; labelA: string; labelB: string }[] = [
    {
      id: 'x-pct-of-y',
      label: 'What is X% of Y?',
      labelA: 'Percentage (X%)',
      labelB: 'Total Value (Y)',
    },
    {
      id: 'x-is-what-pct-of-y',
      label: 'X is what % of Y?',
      labelA: 'Part Value (X)',
      labelB: 'Whole Value (Y)',
    },
    {
      id: 'pct-increase',
      label: 'Percentage Increase',
      labelA: 'Initial Value',
      labelB: 'Final Value',
    },
    {
      id: 'pct-decrease',
      label: 'Percentage Decrease',
      labelA: 'Initial Value',
      labelB: 'Final Value',
    },
    {
      id: 'pct-difference',
      label: 'Percentage Difference',
      labelA: 'Value 1',
      labelB: 'Value 2',
    },
  ];

  const activeConfig = modes.find((m) => m.id === mode) || modes[0];

  const compute = () => {
    const a = Number(valA);
    const b = Number(valB);
    if (!Number.isFinite(a) || !Number.isFinite(b) || valA.trim() === '' || valB.trim() === '') {
      return { error: 'Please enter valid numbers for both inputs.' };
    }

    if (mode === 'x-pct-of-y') {
      const res = roundNum((a / 100) * b, 4);
      return {
        primary: formatNum(res, 4),
        unit: '',
        formula: `(${a} ÷ 100) × ${b} = ${formatNum(res, 4)}`,
        summary: `${a}% of ${b} = ${formatNum(res, 4)}`,
        steps: [
          { label: 'Convert Percentage to Decimal', expression: `${a} ÷ 100 = ${roundNum(a / 100, 6)}` },
          { label: 'Multiply by Total Value', expression: `${roundNum(a / 100, 6)} × ${b} = ${formatNum(res, 4)}`, highlight: true },
        ],
      };
    }

    if (mode === 'x-is-what-pct-of-y') {
      if (b === 0) return { error: 'Whole Value (Y) cannot be zero (division by zero).' };
      const res = roundNum((a / b) * 100, 4);
      return {
        primary: `${formatNum(res, 4)}%`,
        unit: '%',
        formula: `(${a} ÷ ${b}) × 100 = ${formatNum(res, 4)}%`,
        summary: `${a} is ${formatNum(res, 4)}% of ${b}`,
        steps: [
          { label: 'Divide Part by Whole', expression: `${a} ÷ ${b} = ${roundNum(a / b, 6)}` },
          { label: 'Multiply by 100', expression: `${roundNum(a / b, 6)} × 100 = ${formatNum(res, 4)}%`, highlight: true },
        ],
      };
    }

    if (mode === 'pct-increase') {
      if (a === 0) return { error: 'Initial value cannot be zero when calculating percentage increase.' };
      const diff = roundNum(b - a, 4);
      const pct = roundNum((diff / Math.abs(a)) * 100, 4);
      return {
        primary: `${pct >= 0 ? '+' : ''}${formatNum(pct, 4)}%`,
        unit: '%',
        formula: `((${b} − ${a}) ÷ |${a}|) × 100 = ${formatNum(pct, 4)}%`,
        summary: `From ${a} to ${b} is a ${formatNum(pct, 2)}% change`,
        steps: [
          { label: 'Net Increase', expression: `${b} − ${a} = ${formatNum(diff, 4)}` },
          { label: 'Percentage Increase', expression: `(${formatNum(diff, 4)} ÷ ${Math.abs(a)}) × 100 = ${formatNum(pct, 4)}%`, highlight: true },
        ],
      };
    }

    if (mode === 'pct-decrease') {
      if (a === 0) return { error: 'Initial value cannot be zero when calculating percentage decrease.' };
      const drop = roundNum(a - b, 4);
      const pct = roundNum((drop / Math.abs(a)) * 100, 4);
      return {
        primary: `${formatNum(pct, 4)}%`,
        unit: '%',
        formula: `((${a} − ${b}) ÷ |${a}|) × 100 = ${formatNum(pct, 4)}% decrease`,
        summary: `From ${a} down to ${b} is a ${formatNum(pct, 2)}% decrease`,
        steps: [
          { label: 'Net Reduction', expression: `${a} − ${b} = ${formatNum(drop, 4)}` },
          { label: 'Percentage Decrease', expression: `(${formatNum(drop, 4)} ÷ ${Math.abs(a)}) × 100 = ${formatNum(pct, 4)}%`, highlight: true },
        ],
      };
    }

    // pct-difference
    const avg = (Math.abs(a) + Math.abs(b)) / 2;
    if (avg === 0) return { error: 'Both values cannot be zero for percentage difference.' };
    const diff = Math.abs(a - b);
    const pct = roundNum((diff / avg) * 100, 4);
    return {
      primary: `${formatNum(pct, 4)}%`,
      unit: '%',
      formula: `(|${a} − ${b}| ÷ ${formatNum(avg, 4)}) × 100 = ${formatNum(pct, 4)}%`,
      summary: `Percentage difference between ${a} and ${b} = ${formatNum(pct, 2)}%`,
      steps: [
        { label: 'Absolute Difference', expression: `|${a} − ${b}| = ${formatNum(diff, 4)}` },
        { label: 'Average of Values', expression: `(${Math.abs(a)} + ${Math.abs(b)}) ÷ 2 = ${formatNum(avg, 4)}` },
        { label: 'Percentage Difference', expression: `(${formatNum(diff, 4)} ÷ ${formatNum(avg, 4)}) × 100 = ${formatNum(pct, 4)}%`, highlight: true },
      ],
    };
  };

  const current = compute();

  const handleCalculate = () => {
    const out = compute();
    if (out.error) {
      setError(out.error);
      return;
    }
    setError(null);
    if (out.summary) {
      onLogHistory('percentage-calc', 'Percentage Calculator', activeConfig.label, out.summary);
    }
  };

  const handleReset = () => {
    setValA('0');
    setValB('100');
    setError(null);
  };

  return (
    <div
      className="space-y-6"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCalculate();
        }
      }}
    >
      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setError(null);
            }}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border active:scale-[0.98] ${
              mode === m.id
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Multi-Example Quick Presets */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Quick Examples:
        </span>
        <div className="flex flex-wrap gap-2">
          {PCT_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setMode(ex.mode);
                setValA(ex.a);
                setValB(ex.b);
                setError(null);
              }}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Section */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {activeConfig.label}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                {activeConfig.labelA}
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                {activeConfig.labelB}
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {(error || current.error) && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error || current.error}</span>
            </div>
          )}

          <CalculatorActionBar
            calculateLabel="Calculate Percentage"
            onCalculate={handleCalculate}
            onReset={handleReset}
            resultText={current.summary || ''}
          />
        </div>

        {/* Result Card & Breakdown */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Percentage Result
          </div>
          {!current.error ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
                <div className="text-xs sm:text-sm text-slate-400">{activeConfig.label}</div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                  {current.primary}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                  {current.summary}
                </div>
              </div>

              <HowWasThisCalculated steps={current.steps || []} />
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Resolve the input error to view the calculated percentage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FRACTION CALCULATOR
// ============================================================================

export const FractionCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [num1, setNum1] = useState<string>('3');
  const [den1, setDen1] = useState<string>('4');
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [num2, setNum2] = useState<string>('5');
  const [den2, setDen2] = useState<string>('6');

  const evaluateFraction = () => {
    const n1 = parseInt(num1, 10);
    const d1 = parseInt(den1, 10);
    const n2 = parseInt(num2, 10);
    const d2 = parseInt(den2, 10);

    if (
      Number.isNaN(n1) ||
      Number.isNaN(d1) ||
      Number.isNaN(n2) ||
      Number.isNaN(d2)
    ) {
      return { error: 'Enter valid integers for all numerators and denominators.' };
    }
    if (d1 === 0 || d2 === 0) {
      return { error: 'Denominator cannot be zero (division by zero is undefined).' };
    }
    if (op === '/' && n2 === 0) {
      return { error: 'Cannot divide by a zero fraction (0 numerator in second fraction).' };
    }

    let rawNum = 0;
    let rawDen = 1;

    if (op === '+') {
      rawNum = n1 * d2 + n2 * d1;
      rawDen = d1 * d2;
    } else if (op === '-') {
      rawNum = n1 * d2 - n2 * d1;
      rawDen = d1 * d2;
    } else if (op === '*') {
      rawNum = n1 * n2;
      rawDen = d1 * d2;
    } else if (op === '/') {
      rawNum = n1 * d2;
      rawDen = d1 * n2;
    }

    if (rawDen < 0) {
      rawNum = -rawNum;
      rawDen = -rawDen;
    }

    const divisor = gcd(rawNum, rawDen);
    const simpNum = rawNum / divisor;
    const simpDen = rawDen / divisor;
    const decimalVal = roundNum(simpNum / simpDen, 6);

    const absNum = Math.abs(simpNum);
    const whole = Math.floor(absNum / simpDen);
    const rem = absNum % simpDen;
    const sign = simpNum < 0 ? '-' : '';
    const mixed =
      whole > 0 && rem > 0
        ? `${sign}${whole} ${rem}/${simpDen}`
        : rem === 0
        ? `${simpNum / simpDen}`
        : `${simpNum}/${simpDen}`;

    return {
      rawNum,
      rawDen,
      divisor,
      simpNum,
      simpDen,
      decimalVal,
      mixed,
      summary: `${n1}/${d1} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${n2}/${d2} = ${simpNum}/${simpDen} (${decimalVal})`,
    };
  };

  const current = evaluateFraction();

  const handleCalculate = () => {
    const res = evaluateFraction();
    if (!res.error && res.summary) {
      onLogHistory(
        'fraction-calc',
        'Fraction Calculator',
        `${num1}/${den1} ${op} ${num2}/${den2}`,
        `${res.simpNum}/${res.simpDen} (Mixed: ${res.mixed}, Decimal: ${res.decimalVal})`
      );
    }
  };

  const handleReset = () => {
    setNum1('1');
    setDen1('2');
    setNum2('1');
    setDen2('3');
    setOp('+');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Two Fractions
        </h2>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          {/* Fraction 1 */}
          <div className="w-32 space-y-2">
            <label className="block text-[11px] font-semibold text-center text-slate-500">
              Fraction 1
            </label>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              aria-label="First Fraction Numerator"
              className="w-full h-12 px-3 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="h-0.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
            <input
              type="number"
              inputMode="numeric"
              step="1"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              aria-label="First Fraction Denominator"
              className="w-full h-12 px-3 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Operator Selector */}
          <div className="flex flex-col gap-1.5 pt-4">
            {(['+', '-', '*', '/'] as const).map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => setOp(symbol)}
                className={`w-12 h-10 rounded-xl font-mono font-bold text-base transition-colors cursor-pointer ${
                  op === symbol
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {symbol === '*' ? '×' : symbol === '/' ? '÷' : symbol}
              </button>
            ))}
          </div>

          {/* Fraction 2 */}
          <div className="w-32 space-y-2">
            <label className="block text-[11px] font-semibold text-center text-slate-500">
              Fraction 2
            </label>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              aria-label="Second Fraction Numerator"
              className="w-full h-12 px-3 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="h-0.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
            <input
              type="number"
              inputMode="numeric"
              step="1"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              aria-label="Second Fraction Denominator"
              className="w-full h-12 px-3 text-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {current.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{current.error}</span>
          </div>
        )}

        <CalculatorActionBar
          calculateLabel="Calculate Fraction"
          onCalculate={handleCalculate}
          onReset={handleReset}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Simplified Fraction Result
        </h2>

        {!current.error ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm text-slate-400">Simplified Fraction</div>
                <div className="text-4xl font-extrabold font-mono tabular-nums text-sky-400 mt-1">
                  {current.simpDen === 1
                    ? current.simpNum
                    : `${current.simpNum} / ${current.simpDen}`}
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs text-slate-400 font-sans">Decimal</div>
                <div className="text-2xl font-bold text-white">{current.decimalVal}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Mixed Number</div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {current.mixed}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">GCD Divisor</div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  ÷ {current.divisor}
                </div>
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Unreduced Fraction',
                  expression: `${current.rawNum} / ${current.rawDen}`,
                },
                {
                  label: 'Divide by GCD',
                  expression: `(${current.rawNum} ÷ ${current.divisor}) / (${current.rawDen} ÷ ${current.divisor})`,
                },
                {
                  label: 'Final Simplified Result',
                  expression: `${current.simpNum}/${current.simpDen} = ${current.decimalVal}`,
                  highlight: true,
                },
              ]}
            />
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            Enter valid non-zero denominators to see the simplified fraction.
          </div>
        )}
      </div>
    </div>
  );
};
