import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Info,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  formatNum,
  roundNum,
  validateAndCalculateNegativeMarking,
  NegativeMarkingResult,
} from '../../utils/mathEngine';
import {
  CalculatorActionBar,
  HowWasThisCalculated,
  LabelWithTooltip,
} from '../CalculatorActionToolbar';
import { ToolId } from '../../types/calculator';

interface CalcLoggerProps {
  onLogHistory: (toolId: ToolId, toolName: string, inputs: string, result: string) => void;
}

type PenaltyPreset = '0.25' | '0.3333' | '0.5' | '0' | 'custom';

interface ExamExamplePreset {
  id: string;
  label: string;
  total: string;
  attempted: string;
  correct: string;
  wrong: string;
  unattempted: string;
  marks: string;
  negative: string;
  presetType: PenaltyPreset;
}

const NEGATIVE_MARKING_EXAMPLES: ExamExamplePreset[] = [
  {
    id: 'ex-1',
    label: '100 Qs · 1/4 Negative (60C, 20W)',
    total: '100',
    attempted: '80',
    correct: '60',
    wrong: '20',
    unattempted: '20',
    marks: '1',
    negative: '0.25',
    presetType: '0.25',
  },
  {
    id: 'ex-2',
    label: 'Civil Services · 1/3 Negative (+2 / −0.67)',
    total: '100',
    attempted: '85',
    correct: '58',
    wrong: '27',
    unattempted: '15',
    marks: '2',
    negative: '0.6667',
    presetType: '0.3333',
  },
  {
    id: 'ex-3',
    label: 'JEE / NEET · +4 / −1 (1/4 Ratio)',
    total: '90',
    attempted: '75',
    correct: '62',
    wrong: '13',
    unattempted: '15',
    marks: '4',
    negative: '1',
    presetType: '0.25',
  },
  {
    id: 'ex-4',
    label: 'High Penalty · 1/2 Negative (+2 / −1)',
    total: '50',
    attempted: '42',
    correct: '30',
    wrong: '12',
    unattempted: '8',
    marks: '2',
    negative: '1',
    presetType: '0.5',
  },
];

export const NegativeMarkingCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [totalQuestions, setTotalQuestions] = useState<string>('100');
  const [attemptedQuestions, setAttemptedQuestions] = useState<string>('80');
  const [correctAnswers, setCorrectAnswers] = useState<string>('60');
  const [wrongAnswers, setWrongAnswers] = useState<string>('20');
  const [unattemptedQuestions, setUnattemptedQuestions] = useState<string>('20');
  const [marksPerCorrect, setMarksPerCorrect] = useState<string>('1');
  const [negativePerWrong, setNegativePerWrong] = useState<string>('0.25');
  const [penaltyPreset, setPenaltyPreset] = useState<PenaltyPreset>('0.25');
  const [showAdvancedCounts, setShowAdvancedCounts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialCalc = validateAndCalculateNegativeMarking({
    totalQuestions: 100,
    attemptedQuestions: 80,
    correctAnswers: 60,
    wrongAnswers: 20,
    unattemptedQuestions: 20,
    marksPerCorrect: 1,
    negativeMarksPerWrong: 0.25,
  });

  const [result, setResult] = useState<NegativeMarkingResult | null>(
    initialCalc.result || null
  );

  // Sync helper when user edits Total, Correct, Wrong, or Attempted
  const handleTotalChange = (val: string) => {
    setTotalQuestions(val);
    const t = parseInt(val, 10);
    const c = parseInt(correctAnswers, 10) || 0;
    const w = parseInt(wrongAnswers, 10) || 0;
    if (!Number.isNaN(t) && t >= c + w) {
      setAttemptedQuestions(String(c + w));
      setUnattemptedQuestions(String(t - (c + w)));
    }
  };

  const handleCorrectChange = (val: string) => {
    setCorrectAnswers(val);
    const t = parseInt(totalQuestions, 10) || 0;
    const c = parseInt(val, 10) || 0;
    const w = parseInt(wrongAnswers, 10) || 0;
    const att = c + w;
    setAttemptedQuestions(String(att));
    if (t >= att) {
      setUnattemptedQuestions(String(t - att));
    }
  };

  const handleWrongChange = (val: string) => {
    setWrongAnswers(val);
    const t = parseInt(totalQuestions, 10) || 0;
    const c = parseInt(correctAnswers, 10) || 0;
    const w = parseInt(val, 10) || 0;
    const att = c + w;
    setAttemptedQuestions(String(att));
    if (t >= att) {
      setUnattemptedQuestions(String(t - att));
    }
  };

  const handleAttemptedChange = (val: string) => {
    setAttemptedQuestions(val);
    const t = parseInt(totalQuestions, 10) || 0;
    const att = parseInt(val, 10) || 0;
    const c = parseInt(correctAnswers, 10) || 0;
    if (t >= att) {
      setUnattemptedQuestions(String(t - att));
    }
    if (att >= c) {
      setWrongAnswers(String(att - c));
    }
  };

  const handlePresetSelect = (preset: PenaltyPreset) => {
    setPenaltyPreset(preset);
    const marks = parseFloat(marksPerCorrect) || 1;
    if (preset === '0.25') {
      setNegativePerWrong(String(roundNum(marks * 0.25, 4)));
    } else if (preset === '0.3333') {
      setNegativePerWrong(String(roundNum(marks / 3, 4)));
    } else if (preset === '0.5') {
      setNegativePerWrong(String(roundNum(marks * 0.5, 4)));
    } else if (preset === '0') {
      setNegativePerWrong('0');
    }
  };

  const handleMarksPerCorrectChange = (val: string) => {
    setMarksPerCorrect(val);
    const marks = parseFloat(val);
    if (!Number.isNaN(marks) && marks > 0 && penaltyPreset !== 'custom') {
      if (penaltyPreset === '0.25') setNegativePerWrong(String(roundNum(marks * 0.25, 4)));
      if (penaltyPreset === '0.3333') setNegativePerWrong(String(roundNum(marks / 3, 4)));
      if (penaltyPreset === '0.5') setNegativePerWrong(String(roundNum(marks * 0.5, 4)));
      if (penaltyPreset === '0') setNegativePerWrong('0');
    }
  };

  const runCalculation = (logToHistory = true) => {
    const t = Number(totalQuestions);
    const c = Number(correctAnswers);
    const w = Number(wrongAnswers);
    const computedAttempted = showAdvancedCounts ? Number(attemptedQuestions) : c + w;
    const computedUnattempted = showAdvancedCounts
      ? Number(unattemptedQuestions)
      : Math.max(0, t - computedAttempted);

    const parsed = {
      totalQuestions: t,
      attemptedQuestions: computedAttempted,
      correctAnswers: c,
      wrongAnswers: w,
      unattemptedQuestions: computedUnattempted,
      marksPerCorrect: Number(marksPerCorrect),
      negativeMarksPerWrong: Number(negativePerWrong),
    };

    const outcome = validateAndCalculateNegativeMarking(parsed);
    if (outcome.error) {
      setError(outcome.error);
      setResult(null);
      return;
    }

    setError(null);
    if (outcome.result) {
      setResult(outcome.result);
      if (logToHistory) {
        onLogHistory(
          'negative-marking',
          'Negative Marking Calculator',
          `Total: ${parsed.totalQuestions}, Attempted: ${parsed.attemptedQuestions} (${parsed.correctAnswers}C / ${parsed.wrongAnswers}W), +${parsed.marksPerCorrect}/-${parsed.negativeMarksPerWrong}`,
          `Final Score: ${formatNum(outcome.result.finalScore)} / ${formatNum(outcome.result.maxPossibleScore)} (${outcome.result.scorePercentage}%) · Accuracy: ${outcome.result.accuracyPercentage}%`
        );
      }
    }
  };

  const handleReset = () => {
    setTotalQuestions('100');
    setAttemptedQuestions('0');
    setCorrectAnswers('0');
    setWrongAnswers('0');
    setUnattemptedQuestions('100');
    setMarksPerCorrect('1');
    setNegativePerWrong('0.25');
    setPenaltyPreset('0.25');
    setError(null);
    setResult(null);
  };

  const handleLoadExample = (ex: ExamExamplePreset) => {
    setTotalQuestions(ex.total);
    setAttemptedQuestions(ex.attempted);
    setCorrectAnswers(ex.correct);
    setWrongAnswers(ex.wrong);
    setUnattemptedQuestions(ex.unattempted);
    setMarksPerCorrect(ex.marks);
    setNegativePerWrong(ex.negative);
    setPenaltyPreset(ex.presetType);
    setError(null);
    const evaluated = validateAndCalculateNegativeMarking({
      totalQuestions: Number(ex.total),
      attemptedQuestions: Number(ex.attempted),
      correctAnswers: Number(ex.correct),
      wrongAnswers: Number(ex.wrong),
      unattemptedQuestions: Number(ex.unattempted),
      marksPerCorrect: Number(ex.marks),
      negativeMarksPerWrong: Number(ex.negative),
    });
    if (evaluated.result) setResult(evaluated.result);
  };

  const handleExportReport = () => {
    if (!result) return;
    const reportContent = [
      'SMARTCALC — EXAM NEGATIVE MARKING SCORE REPORT',
      '================================================',
      `Date: ${new Date().toLocaleString()}`,
      '',
      'INPUT PARAMETERS:',
      `- Total Questions: ${totalQuestions}`,
      `- Attempted Questions: ${Number(correctAnswers) + Number(wrongAnswers)}`,
      `- Correct Answers: ${correctAnswers}`,
      `- Wrong Answers: ${wrongAnswers}`,
      `- Unattempted Questions: ${result.unattemptedQuestions}`,
      `- Marks per Correct Answer: +${marksPerCorrect}`,
      `- Negative Penalty per Wrong Answer: -${negativePerWrong}`,
      '',
      'CALCULATED RESULTS:',
      `- Correct Marks: +${formatNum(result.correctMarks, 2)}`,
      `- Negative Penalty Deducted: -${formatNum(result.negativeMarks, 2)}`,
      `- Final Net Score: ${formatNum(result.finalScore, 2)} / ${formatNum(result.maxPossibleScore, 2)}`,
      `- Score Percentage: ${formatNum(result.scorePercentage, 2)}%`,
      `- Accuracy Rate: ${formatNum(result.accuracyPercentage, 2)}%`,
      `- Attempt Rate: ${formatNum(result.attemptRatePercentage, 2)}%`,
      `- Wrong Answer Rate: ${formatNum(result.wrongAnswerPercentage, 2)}%`,
      '',
      'Note: Negative marking rules vary by examination. Always verify against official exam instructions.',
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartcalc-exam-score-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareSummary = result
    ? `SmartCalc Negative Marking Result:\nFinal Score: ${formatNum(result.finalScore)} / ${formatNum(result.maxPossibleScore)} (${result.scorePercentage}%)\nAccuracy: ${result.accuracyPercentage}% | Correct: ${correctAnswers} (+${formatNum(result.correctMarks)}) | Wrong: ${wrongAnswers} (−${formatNum(result.negativeMarks)})`
    : '';

  return (
    <div
      className="space-y-6"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          runCalculation(true);
        }
      }}
    >
      {/* Quick Exam Scenario Presets */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
          Quick Exam Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          {NEGATIVE_MARKING_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleLoadExample(ex)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ====================================================================
            LEFT COLUMN: SIMPLE, TOUCH-FRIENDLY INPUT SECTION
           ==================================================================== */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Enter Your Exam Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attempted & unattempted counts update automatically
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvancedCounts((v) => !v)}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer whitespace-nowrap"
            >
              {showAdvancedCounts ? 'Simple View' : 'Manual Attempted'}
            </button>
          </div>

          {/* Core 5 Inputs (Large 48px height, 16px text-base font for mobile comfort) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="nm-total"
                className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                <LabelWithTooltip
                  label="Total Questions"
                  explanation="Total number of questions in your exam paper."
                />
              </label>
              <input
                id="nm-total"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="e.g. 100"
                value={totalQuestions}
                onChange={(e) => handleTotalChange(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="nm-correct"
                className="block text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1.5"
              >
                Correct Answers
              </label>
              <input
                id="nm-correct"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="e.g. 60"
                value={correctAnswers}
                onChange={(e) => handleCorrectChange(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/25 text-slate-900 dark:text-white font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="nm-wrong"
                className="block text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400 mb-1.5"
              >
                Wrong Answers
              </label>
              <input
                id="nm-wrong"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="e.g. 20"
                value={wrongAnswers}
                onChange={(e) => handleWrongChange(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/25 text-slate-900 dark:text-white font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow"
              />
            </div>
          </div>

          {/* Optional Manual Attempted & Unattempted Fields */}
          {showAdvancedCounts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Attempted Questions
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={attemptedQuestions}
                  onChange={(e) => handleAttemptedChange(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Unattempted Questions
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={unattemptedQuestions}
                  onChange={(e) => setUnattemptedQuestions(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-base"
                />
              </div>
            </div>
          )}

          {/* Marks per Question & Negative Marking Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nm-marks-per-q"
                  className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                >
                  <LabelWithTooltip
                    label="Marks per Question"
                    explanation="Positive marks awarded for each correct answer (e.g., 1, 2, or 4)."
                  />
                </label>
                <input
                  id="nm-marks-per-q"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="any"
                  placeholder="e.g. 1"
                  value={marksPerCorrect}
                  onChange={(e) => handleMarksPerCorrectChange(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                />
              </div>

              <div>
                <label
                  htmlFor="nm-neg-input"
                  className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                >
                  <LabelWithTooltip
                    label="Negative Marking"
                    explanation="Marks deducted for each wrong answer (e.g., 0.25 for 1/4 negative marking on 1 mark)."
                  />
                </label>
                <input
                  id="nm-neg-input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="e.g. 0.25"
                  value={negativePerWrong}
                  onChange={(e) => {
                    setNegativePerWrong(e.target.value);
                    setPenaltyPreset('custom');
                  }}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                />
              </div>
            </div>

            {/* Smart Defaults: Common Negative Marking Buttons [ 1/4 ] [ 1/3 ] [ 1/2 ] [ Custom ] */}
            <div>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Common Negative Marking
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    { id: '0.25', label: '1/4 (0.25)' },
                    { id: '0.3333', label: '1/3 (0.33)' },
                    { id: '0.5', label: '1/2 (0.50)' },
                    { id: '0', label: 'None (0)' },
                    { id: 'custom', label: 'Custom' },
                  ] as { id: PenaltyPreset; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePresetSelect(item.id)}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border active:scale-[0.98] ${
                      penaltyPreset === item.id
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inline Validation Error Message */}
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Calculate Score Button + Quick Actions */}
          <CalculatorActionBar
            calculateLabel="Calculate Score"
            onCalculate={() => runCalculation(true)}
            onReset={handleReset}
            resultText={shareSummary}
          />
        </div>

        {/* ====================================================================
            RIGHT COLUMN: RESULT CARD, METRIC GRID & HOW IT WAS CALCULATED
           ==================================================================== */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Score Result & Breakdown
            </h2>
            {result && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportReport}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            )}
          </div>

          {result ? (
            <div className="space-y-5">
              {/* 1. Primary Result Card: "Your Final Score" */}
              <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-medium">
                  <span>Your Final Score</span>
                  <span className="font-mono text-sky-400 font-bold">
                    Score Percentage: {formatNum(result.scorePercentage, 2)}%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight text-white">
                    {formatNum(result.finalScore, 2)}
                    <span className="text-xl sm:text-2xl font-normal text-slate-400">
                      {' '}
                      / {formatNum(result.maxPossibleScore, 2)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 font-mono">
                  <span className="text-emerald-400">
                    Correct Marks: +{formatNum(result.correctMarks, 2)}
                  </span>
                  <span>·</span>
                  <span className="text-rose-400">
                    Negative Marks: −{formatNum(result.negativeMarks, 2)}
                  </span>
                </div>
              </div>

              {/* 2. Four Key Metric Cards: Accuracy | Correct | Wrong | Negative Marks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Accuracy
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-0.5">
                    {formatNum(result.accuracyPercentage, 1)}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60">
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    Correct
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {correctAnswers}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60">
                  <div className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                    Wrong
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold font-mono tabular-nums text-rose-700 dark:text-rose-400 mt-0.5">
                    {wrongAnswers}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Negative Marks
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
                    −{formatNum(result.negativeMarks, 2)}
                  </div>
                </div>
              </div>

              {/* 3. Additional Exam Metrics Summary */}
              <div className="grid grid-cols-3 gap-2.5 text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Attempt Rate</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNum(result.attemptRatePercentage, 1)}%
                  </div>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">Wrong Answer %</div>
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {formatNum(result.wrongAnswerPercentage, 1)}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Unattempted</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {result.unattemptedQuestions} Qs
                  </div>
                </div>
              </div>

              {/* 4. Collapsible Calculation Breakdown: "How was this calculated?" */}
              <HowWasThisCalculated
                steps={[
                  {
                    label: 'Correct Marks',
                    expression: `${correctAnswers} × ${marksPerCorrect} = ${formatNum(
                      result.correctMarks,
                      2
                    )}`,
                  },
                  {
                    label: 'Negative Marks',
                    expression: `${wrongAnswers} × ${negativePerWrong} = ${formatNum(
                      result.negativeMarks,
                      2
                    )}`,
                  },
                  {
                    label: 'Final Score',
                    expression: `${formatNum(result.correctMarks, 2)} − ${formatNum(
                      result.negativeMarks,
                      2
                    )} = ${formatNum(result.finalScore, 2)}`,
                    highlight: true,
                  },
                  {
                    label: 'Accuracy %',
                    expression: `(${correctAnswers} ÷ ${
                      Number(correctAnswers) + Number(wrongAnswers)
                    }) × 100 = ${formatNum(result.accuracyPercentage, 2)}%`,
                  },
                ]}
              />
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Enter your exam details and tap <strong>Calculate Score</strong> to see your final score and step-by-step calculation breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Important Negative Marking Notice */}
      <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong className="font-semibold">Important Notice:</strong> Negative marking rules vary by examination. Always check the official exam instructions before calculating your expected score.
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAM SCORE CALCULATOR (Multi-Section Support: Section A, B, C...)
// ============================================================================

interface ExamSection {
  id: string;
  name: string;
  totalQuestions: string;
  correctAnswers: string;
  wrongAnswers: string;
  marksPerQuestion: string;
  negativeMarks: string;
}

export const ExamScoreCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [sections, setSections] = useState<ExamSection[]>([
    {
      id: 'sec-a',
      name: 'Section A (Quantitative Aptitude)',
      totalQuestions: '35',
      correctAnswers: '26',
      wrongAnswers: '4',
      marksPerQuestion: '2',
      negativeMarks: '0.5',
    },
    {
      id: 'sec-b',
      name: 'Section B (Logical Reasoning)',
      totalQuestions: '35',
      correctAnswers: '28',
      wrongAnswers: '3',
      marksPerQuestion: '2',
      negativeMarks: '0.5',
    },
    {
      id: 'sec-c',
      name: 'Section C (General Awareness & English)',
      totalQuestions: '30',
      correctAnswers: '21',
      wrongAnswers: '5',
      marksPerQuestion: '2',
      negativeMarks: '0.5',
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  const loadSectionExample = (preset: 'ssc' | 'pcm' | 'dual') => {
    setError(null);
    if (preset === 'ssc') {
      setSections([
        {
          id: 'sec-a',
          name: 'Section A (Quantitative Aptitude)',
          totalQuestions: '35',
          correctAnswers: '26',
          wrongAnswers: '4',
          marksPerQuestion: '2',
          negativeMarks: '0.5',
        },
        {
          id: 'sec-b',
          name: 'Section B (Logical Reasoning)',
          totalQuestions: '35',
          correctAnswers: '28',
          wrongAnswers: '3',
          marksPerQuestion: '2',
          negativeMarks: '0.5',
        },
        {
          id: 'sec-c',
          name: 'Section C (English & General Awareness)',
          totalQuestions: '30',
          correctAnswers: '21',
          wrongAnswers: '5',
          marksPerQuestion: '2',
          negativeMarks: '0.5',
        },
      ]);
    } else if (preset === 'pcm') {
      setSections([
        {
          id: 'sec-p',
          name: 'Section A: Physics',
          totalQuestions: '25',
          correctAnswers: '19',
          wrongAnswers: '3',
          marksPerQuestion: '4',
          negativeMarks: '1',
        },
        {
          id: 'sec-c',
          name: 'Section B: Chemistry',
          totalQuestions: '25',
          correctAnswers: '21',
          wrongAnswers: '2',
          marksPerQuestion: '4',
          negativeMarks: '1',
        },
        {
          id: 'sec-m',
          name: 'Section C: Mathematics',
          totalQuestions: '25',
          correctAnswers: '17',
          wrongAnswers: '4',
          marksPerQuestion: '4',
          negativeMarks: '1',
        },
      ]);
    } else {
      setSections([
        {
          id: 'sec-1',
          name: 'Paper 1: Core Domain',
          totalQuestions: '60',
          correctAnswers: '45',
          wrongAnswers: '9',
          marksPerQuestion: '2',
          negativeMarks: '0.6667',
        },
        {
          id: 'sec-2',
          name: 'Paper 2: General Aptitude',
          totalQuestions: '40',
          correctAnswers: '32',
          wrongAnswers: '4',
          marksPerQuestion: '1',
          negativeMarks: '0.3333',
        },
      ]);
    }
  };

  const updateSection = (id: string, field: keyof ExamSection, value: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addSection = () => {
    const nextLetter = String.fromCharCode(65 + sections.length);
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        name: `Section ${nextLetter}`,
        totalQuestions: '25',
        correctAnswers: '18',
        wrongAnswers: '2',
        marksPerQuestion: '1',
        negativeMarks: '0.25',
      },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const computeBreakdown = () => {
    const computedSections = [];
    for (const s of sections) {
      const total = Number(s.totalQuestions);
      const correct = Number(s.correctAnswers);
      const wrong = Number(s.wrongAnswers);
      const marks = Number(s.marksPerQuestion);
      const neg = Number(s.negativeMarks);

      if (
        !Number.isFinite(total) ||
        total <= 0 ||
        correct < 0 ||
        wrong < 0 ||
        marks <= 0 ||
        neg < 0
      ) {
        return { error: `Invalid numeric inputs in "${s.name}".` };
      }
      if (!Number.isInteger(total) || !Number.isInteger(correct) || !Number.isInteger(wrong)) {
        return { error: `Question counts in "${s.name}" must be whole numbers.` };
      }
      if (correct + wrong > total) {
        return {
          error: `In "${s.name}", Correct (${correct}) + Wrong (${wrong}) = ${
            correct + wrong
          } exceeds Total Questions (${total}).`,
        };
      }

      const unattempted = total - (correct + wrong);
      const posMarks = roundNum(correct * marks, 4);
      const negMarks = roundNum(wrong * neg, 4);
      const netScore = roundNum(posMarks - negMarks, 4);
      const maxMarks = roundNum(total * marks, 4);
      const pct = maxMarks > 0 ? roundNum((netScore / maxMarks) * 100, 2) : 0;
      const accuracy = correct + wrong > 0 ? roundNum((correct / (correct + wrong)) * 100, 2) : 0;

      computedSections.push({
        ...s,
        total,
        correct,
        wrong,
        unattempted,
        posMarks,
        negMarks,
        netScore,
        maxMarks,
        pct,
        accuracy,
      });
    }

    const grandTotalQs = computedSections.reduce((a, b) => a + b.total, 0);
    const grandCorrect = computedSections.reduce((a, b) => a + b.correct, 0);
    const grandWrong = computedSections.reduce((a, b) => a + b.wrong, 0);
    const grandUnattempted = computedSections.reduce((a, b) => a + b.unattempted, 0);
    const grandPosMarks = roundNum(computedSections.reduce((a, b) => a + b.posMarks, 0), 4);
    const grandNegMarks = roundNum(computedSections.reduce((a, b) => a + b.negMarks, 0), 4);
    const grandNetScore = roundNum(computedSections.reduce((a, b) => a + b.netScore, 0), 4);
    const grandMaxMarks = roundNum(computedSections.reduce((a, b) => a + b.maxMarks, 0), 4);
    const grandPct = grandMaxMarks > 0 ? roundNum((grandNetScore / grandMaxMarks) * 100, 2) : 0;
    const grandAccuracy =
      grandCorrect + grandWrong > 0
        ? roundNum((grandCorrect / (grandCorrect + grandWrong)) * 100, 2)
        : 0;

    return {
      data: {
        sections: computedSections,
        grandTotalQs,
        grandCorrect,
        grandWrong,
        grandUnattempted,
        grandPosMarks,
        grandNegMarks,
        grandNetScore,
        grandMaxMarks,
        grandPct,
        grandAccuracy,
      },
    };
  };

  const currentEval = computeBreakdown();

  const handleCalculateClick = () => {
    const check = computeBreakdown();
    if (check.error) {
      setError(check.error);
      return;
    }
    setError(null);
    if (check.data) {
      onLogHistory(
        'exam-score',
        'Exam Score Calculator',
        `${check.data.sections.length} Sections · ${check.data.grandTotalQs} Total Qs (${check.data.grandCorrect}C / ${check.data.grandWrong}W)`,
        `Total Score: ${formatNum(check.data.grandNetScore)} / ${formatNum(check.data.grandMaxMarks)} (${check.data.grandPct}%)`
      );
    }
  };

  const handleReset = () => {
    setSections([
      {
        id: 'sec-a',
        name: 'Section A',
        totalQuestions: '50',
        correctAnswers: '0',
        wrongAnswers: '0',
        marksPerQuestion: '1',
        negativeMarks: '0.25',
      },
    ]);
    setError(null);
  };

  const shareText = currentEval.data
    ? `SmartCalc Multi-Section Exam Score:\n${currentEval.data.sections
        .map((s) => `${s.name}: ${formatNum(s.netScore)}/${formatNum(s.maxMarks)} (${s.pct}%)`)
        .join('\n')}\nOverall Score: ${formatNum(currentEval.data.grandNetScore)} / ${formatNum(
        currentEval.data.grandMaxMarks
      )} (${currentEval.data.grandPct}%)`
    : '';

  return (
    <div className="space-y-6">
      {/* Multi-Example Presets Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Load Multi-Section Exam Templates:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadSectionExample('ssc')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
            >
              3-Section Aptitude (100 Qs, +2/−0.5)
            </button>
            <button
              type="button"
              onClick={() => loadSectionExample('pcm')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
            >
              Physics, Chemistry, Math (75 Qs, +4/−1)
            </button>
            <button
              type="button"
              onClick={() => loadSectionExample('dual')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
            >
              2-Section Mixed Weights (1/3 Penalty)
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={addSection}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam Section</span>
        </button>
      </div>

      {/* Sections Input List */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const t = parseInt(sec.totalQuestions, 10) || 0;
          const c = parseInt(sec.correctAnswers, 10) || 0;
          const w = parseInt(sec.wrongAnswers, 10) || 0;
          const unatt = Math.max(0, t - (c + w));

          return (
            <div
              key={sec.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <input
                  type="text"
                  value={sec.name}
                  onChange={(e) => updateSection(sec.id, 'name', e.target.value)}
                  aria-label="Section Name"
                  className="font-bold text-base text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none px-1 py-0.5 w-full max-w-md"
                />
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Unattempted: {unatt}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sec.id)}
                      aria-label={`Remove ${sec.name}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={sec.totalQuestions}
                    onChange={(e) => updateSection(sec.id, 'totalQuestions', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    Correct Answers
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={sec.correctAnswers}
                    onChange={(e) => updateSection(sec.id, 'correctAnswers', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 font-mono text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">
                    Wrong Answers
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={sec.wrongAnswers}
                    onChange={(e) => updateSection(sec.id, 'wrongAnswers', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20 font-mono text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Marks / Question
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0.1"
                    step="any"
                    value={sec.marksPerQuestion}
                    onChange={(e) => updateSection(sec.id, 'marksPerQuestion', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Negative Marking
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={sec.negativeMarks}
                    onChange={(e) => updateSection(sec.id, 'negativeMarks', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(error || currentEval.error) && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error || currentEval.error}</span>
        </div>
      )}

      <CalculatorActionBar
        calculateLabel="Calculate Exam Score"
        onCalculate={handleCalculateClick}
        onReset={handleReset}
        resultText={shareText}
      />

      {/* Section-Wise & Overall Score Result Card */}
      {currentEval.data && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          {/* Primary Result Card */}
          <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
              <span>Your Final Exam Score</span>
              <span className="font-mono font-bold text-sky-400">
                Overall Percentage: {formatNum(currentEval.data.grandPct, 2)}%
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-white mt-2">
              {formatNum(currentEval.data.grandNetScore, 2)}{' '}
              <span className="text-xl sm:text-2xl font-normal text-slate-400">
                / {formatNum(currentEval.data.grandMaxMarks, 2)}
              </span>
            </div>
          </div>

          {/* 4 Smaller Result Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500">Accuracy</div>
              <div className="text-lg font-extrabold font-mono text-sky-600 dark:text-sky-400 mt-0.5">
                {formatNum(currentEval.data.grandAccuracy, 1)}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60">
              <div className="text-xs text-emerald-700 dark:text-emerald-400">Correct</div>
              <div className="text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                {currentEval.data.grandCorrect}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60">
              <div className="text-xs text-rose-700 dark:text-rose-400">Wrong</div>
              <div className="text-lg font-extrabold font-mono text-rose-700 dark:text-rose-400 mt-0.5">
                {currentEval.data.grandWrong}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500">Negative Marks</div>
              <div className="text-lg font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                −{formatNum(currentEval.data.grandNegMarks, 2)}
              </div>
            </div>
          </div>

          {/* Section Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 pr-4 font-semibold">Section</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Total Qs</th>
                  <th className="py-2.5 px-3 text-right font-semibold">C / W / U</th>
                  <th className="py-2.5 px-3 text-right font-semibold">+Marks</th>
                  <th className="py-2.5 px-3 text-right font-semibold">−Penalty</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Net Score</th>
                  <th className="py-2.5 pl-3 text-right font-semibold">Section %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 font-mono tabular-nums">
                {currentEval.data.sections.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 pr-4 font-sans font-medium text-slate-900 dark:text-slate-100">
                      {s.name}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                      {s.total}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-emerald-600 dark:text-emerald-400">{s.correct}</span>
                      {' / '}
                      <span className="text-rose-600 dark:text-rose-400">{s.wrong}</span>
                      {' / '}
                      <span className="text-slate-500">{s.unattempted}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-700 dark:text-emerald-400">
                      +{formatNum(s.posMarks, 2)}
                    </td>
                    <td className="py-3 px-3 text-right text-rose-700 dark:text-rose-400">
                      −{formatNum(s.negMarks, 2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatNum(s.netScore, 2)} / {formatNum(s.maxMarks, 2)}
                    </td>
                    <td className="py-3 pl-3 text-right font-semibold text-sky-600 dark:text-sky-400">
                      {formatNum(s.pct, 2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <HowWasThisCalculated
            steps={[
              ...currentEval.data.sections.map((s) => ({
                label: s.name,
                expression: `(${s.correct} × ${s.marksPerQuestion}) − (${s.wrong} × ${
                  s.negativeMarks
                }) = ${formatNum(s.netScore, 2)}`,
              })),
              {
                label: 'Aggregate Final Score',
                expression: `${formatNum(currentEval.data.grandPosMarks, 2)} − ${formatNum(
                  currentEval.data.grandNegMarks,
                  2
                )} = ${formatNum(currentEval.data.grandNetScore, 2)} / ${formatNum(
                  currentEval.data.grandMaxMarks,
                  2
                )}`,
                highlight: true,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
