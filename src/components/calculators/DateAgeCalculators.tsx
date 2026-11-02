import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatNum } from '../../utils/mathEngine';
import {
  CalculatorActionBar,
  HowWasThisCalculated,
} from '../CalculatorActionToolbar';
import { ToolId } from '../../types/calculator';

interface CalcLoggerProps {
  onLogHistory: (toolId: ToolId, toolName: string, inputs: string, result: string) => void;
}

// ============================================================================
// 11. AGE CALCULATOR
// ============================================================================

export const AgeCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [dob, setDob] = useState<string>('2004-05-15');
  const [targetDate, setTargetDate] = useState<string>('2026-10-31');

  const evaluateAge = () => {
    if (!dob || !targetDate) {
      return { error: 'Please select both Date of Birth and Target Date.' };
    }
    const birth = new Date(`${dob}T00:00:00`);
    const target = new Date(`${targetDate}T00:00:00`);

    if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime())) {
      return { error: 'Invalid calendar date entered.' };
    }
    if (birth > target) {
      return { error: 'Date of Birth cannot be later than the Target Date.' };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingWeekDays = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBirthday = Math.round(
      (nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingWeekDays,
      totalMonths,
      totalHours,
      daysToNextBirthday,
      summary: `${years} Years, ${months} Months, ${days} Days (${formatNum(totalDays, 0)} Total Days)`,
    };
  };

  const current = evaluateAge();

  const handleCalculate = () => {
    const out = evaluateAge();
    if (!out.error && out.summary) {
      onLogHistory(
        'age-calc',
        'Age Calculator',
        `DOB: ${dob} → Target: ${targetDate}`,
        out.summary
      );
    }
  };

  const handleReset = () => {
    setDob('2005-01-01');
    setTargetDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Date of Birth & Cutoff Date
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Target / Exam Cutoff Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
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
          calculateLabel="Calculate Age"
          onCalculate={handleCalculate}
          onReset={handleReset}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Your Exact Age Result
        </h2>

        {!current.error && current.years !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400">Exact Age on {targetDate}</div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {current.years}y {current.months}m {current.days}d
              </div>
              <div className="mt-2 text-xs sm:text-sm text-slate-300">
                {current.years} Years · {current.months} Months · {current.days} Days
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Days</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.totalDays, 0)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Months</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.totalMonths, 0)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Weeks</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.totalWeeks, 0)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60">
                <div className="text-xs text-emerald-700 dark:text-emerald-400">Next Birthday</div>
                <div className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {current.daysToNextBirthday === 0 ? 'Today!' : `${current.daysToNextBirthday}d`}
                </div>
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Date of Birth to Target Date',
                  expression: `${dob} → ${targetDate}`,
                },
                {
                  label: 'Calendar Age Breakdown',
                  expression: `${current.years} Years, ${current.months} Months, ${current.days} Days`,
                  highlight: true,
                },
                {
                  label: 'Total Elapsed Days (incl. Leap Years)',
                  expression: `${formatNum(current.totalDays, 0)} days (${formatNum(
                    current.totalHours,
                    0
                  )} hours)`,
                },
              ]}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ============================================================================
// 12. DATE CALCULATOR
// ============================================================================

export const DateCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [tab, setTab] = useState<'diff' | 'offset'>('diff');
  const [startDate, setStartDate] = useState<string>('2026-10-31');
  const [endDate, setEndDate] = useState<string>('2027-02-15');

  const [baseDate, setBaseDate] = useState<string>('2026-10-31');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [daysOffset, setDaysOffset] = useState<string>('45');
  const [weeksOffset, setWeeksOffset] = useState<string>('0');
  const [monthsOffset, setMonthsOffset] = useState<string>('0');

  const evaluateDiff = () => {
    const d1 = new Date(`${startDate}T00:00:00`);
    const d2 = new Date(`${endDate}T00:00:00`);
    if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
      return { error: 'Please select valid Start and End dates.' };
    }
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    return {
      totalDays,
      weeks,
      remDays,
      summary: `Days between ${startDate} and ${endDate}: ${totalDays} Days (${weeks} weeks, ${remDays} days)`,
    };
  };

  const evaluateOffset = () => {
    const base = new Date(`${baseDate}T00:00:00`);
    const d = parseInt(daysOffset || '0', 10);
    const w = parseInt(weeksOffset || '0', 10);
    const m = parseInt(monthsOffset || '0', 10);

    if (Number.isNaN(base.getTime()) || Number.isNaN(d) || Number.isNaN(w) || Number.isNaN(m)) {
      return { error: 'Please enter valid date and offset numbers.' };
    }
    if (d < 0 || w < 0 || m < 0) {
      return { error: 'Offset counts cannot be negative (use Add or Subtract toggle).' };
    }

    const sign = operation === 'add' ? 1 : -1;
    const resultDate = new Date(base);
    resultDate.setMonth(resultDate.getMonth() + sign * m);
    resultDate.setDate(resultDate.getDate() + sign * (d + w * 7));

    const iso = resultDate.toISOString().slice(0, 10);
    const formatted = resultDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      iso,
      formatted,
      summary: `${operation === 'add' ? 'Adding' : 'Subtracting'} ${m}m ${w}w ${d}d from ${baseDate} → ${formatted} (${iso})`,
    };
  };

  const diffOut = evaluateDiff();
  const offsetOut = evaluateOffset();

  const handleCalculate = () => {
    if (tab === 'diff' && !diffOut.error && diffOut.summary) {
      onLogHistory('date-calc', 'Date Calculator (Duration)', `${startDate} to ${endDate}`, diffOut.summary);
    } else if (tab === 'offset' && !offsetOut.error && offsetOut.summary) {
      onLogHistory('date-calc', 'Date Calculator (Add/Subtract)', baseDate, offsetOut.summary);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('diff')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer active:scale-[0.98] ${
            tab === 'diff'
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          Days Between Two Dates
        </button>
        <button
          type="button"
          onClick={() => setTab('offset')}
          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer active:scale-[0.98] ${
            tab === 'offset'
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          Add / Subtract Days from Date
        </button>
      </div>

      {tab === 'diff' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Select Start & End Dates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
            </div>
            <CalculatorActionBar
              calculateLabel="Calculate Date Difference"
              onCalculate={handleCalculate}
              onReset={() => {
                setStartDate('2026-10-31');
                setEndDate('2026-12-31');
              }}
              resultText={diffOut.summary || ''}
            />
          </div>

          <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Duration Result
            </h2>
            {!diffOut.error && diffOut.totalDays !== undefined ? (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
                  <div className="text-xs sm:text-sm text-slate-400">Total Calendar Days</div>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                    {formatNum(diffOut.totalDays, 0)} Days
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-slate-300 font-mono">
                    Equivalent to {diffOut.weeks} weeks and {diffOut.remDays} days
                  </div>
                </div>

                <HowWasThisCalculated
                  steps={[
                    { label: 'Date Range', expression: `${startDate} → ${endDate}` },
                    {
                      label: 'Total Days Difference',
                      expression: `${formatNum(diffOut.totalDays, 0)} days`,
                      highlight: true,
                    },
                  ]}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Add or Subtract Days
              </h2>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setOperation('add')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    operation === 'add' ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Add (+)
                </button>
                <button
                  type="button"
                  onClick={() => setOperation('subtract')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    operation === 'subtract'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Subtract (−)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Days
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={daysOffset}
                  onChange={(e) => setDaysOffset(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Weeks
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={weeksOffset}
                  onChange={(e) => setWeeksOffset(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Months
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={monthsOffset}
                  onChange={(e) => setMonthsOffset(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
            </div>

            <CalculatorActionBar
              calculateLabel="Calculate Target Date"
              onCalculate={handleCalculate}
              onReset={() => {
                setDaysOffset('30');
                setWeeksOffset('0');
                setMonthsOffset('0');
              }}
              resultText={offsetOut.summary || ''}
            />
          </div>

          <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Target Date Result
            </h2>
            {!offsetOut.error && offsetOut.formatted ? (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
                  <div className="text-xs sm:text-sm text-slate-400">Resulting Calendar Date</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-2">
                    {offsetOut.formatted}
                  </div>
                  <div className="mt-2 text-xs text-slate-300 font-mono">ISO Date: {offsetOut.iso}</div>
                </div>
                <HowWasThisCalculated
                  steps={[
                    { label: 'Starting Date', expression: baseDate },
                    {
                      label: `${operation === 'add' ? 'Added' : 'Subtracted'} Offset`,
                      expression: `${monthsOffset} months, ${weeksOffset} weeks, ${daysOffset} days`,
                    },
                    {
                      label: 'Final Calendar Date',
                      expression: offsetOut.iso,
                      highlight: true,
                    },
                  ]}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
