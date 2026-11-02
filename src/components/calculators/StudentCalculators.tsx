import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { formatNum, roundNum } from '../../utils/mathEngine';
import {
  CalculatorActionBar,
  HowWasThisCalculated,
  LabelWithTooltip,
} from '../CalculatorActionToolbar';
import { ToolId } from '../../types/calculator';

interface CalcLoggerProps {
  onLogHistory: (toolId: ToolId, toolName: string, inputs: string, result: string) => void;
}

// ============================================================================
// 13. ATTENDANCE CALCULATOR
// ============================================================================

export const AttendanceCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [totalClasses, setTotalClasses] = useState<string>('60');
  const [attendedClasses, setAttendedClasses] = useState<string>('42');
  const [targetPct, setTargetPct] = useState<string>('75');

  const evaluateAttendance = () => {
    const total = Number(totalClasses);
    const attended = Number(attendedClasses);
    const req = Number(targetPct);

    if (!Number.isFinite(total) || total <= 0 || !Number.isInteger(total)) {
      return { error: 'Total Classes must be a positive whole number.' };
    }
    if (!Number.isFinite(attended) || attended < 0 || !Number.isInteger(attended)) {
      return { error: 'Classes Attended must be a non-negative whole number.' };
    }
    if (attended > total) {
      return { error: `Classes Attended (${attended}) cannot exceed Total Classes (${total}).` };
    }
    if (!Number.isFinite(req) || req <= 0 || req >= 100) {
      return { error: 'Required Attendance % must be between 1% and 99.9%.' };
    }

    const currentPct = roundNum((attended / total) * 100, 2);
    const targetRatio = req / 100;

    let classesNeeded = 0;
    let classesCanMiss = 0;

    if (currentPct < req) {
      classesNeeded = Math.ceil((targetRatio * total - attended) / (1 - targetRatio));
    } else {
      classesCanMiss = Math.floor((attended - targetRatio * total) / targetRatio);
    }

    const statusText =
      currentPct >= req
        ? `Safe: You can miss up to ${classesCanMiss} upcoming classes and stay at or above ${req}%.`
        : `Action Required: Attend the next ${classesNeeded} consecutive classes to reach ${req}%.`;

    return {
      total,
      attended,
      missed: total - attended,
      req,
      currentPct,
      classesNeeded,
      classesCanMiss,
      isSafe: currentPct >= req,
      statusText,
      summary: `Current Attendance: ${currentPct}% (${attended}/${total}) · Target: ${req}% · ${
        currentPct >= req
          ? `Can miss ${classesCanMiss} classes`
          : `Need ${classesNeeded} more classes`
      }`,
    };
  };

  const current = evaluateAttendance();

  const handleCalculate = () => {
    const out = evaluateAttendance();
    if (!out.error && out.summary) {
      onLogHistory(
        'attendance-calc',
        'Attendance Calculator',
        `Attended ${attendedClasses}/${totalClasses} (Target ${targetPct}%)`,
        out.summary
      );
    }
  };

  const handleReset = () => {
    setTotalClasses('50');
    setAttendedClasses('40');
    setTargetPct('75');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Your Class Attendance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Total Classes
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={totalClasses}
              onChange={(e) => setTotalClasses(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
              Classes Attended
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={attendedClasses}
              onChange={(e) => setAttendedClasses(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/25 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Target %
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              max="99"
              step="any"
              value={targetPct}
              onChange={(e) => setTargetPct(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Common College Targets:
          </span>
          <div className="flex flex-wrap gap-2">
            {['70', '75', '80', '85', '90'].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setTargetPct(pct)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer active:scale-[0.98] ${
                  targetPct === pct
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {pct}% Target
              </button>
            ))}
          </div>
        </div>

        {current.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{current.error}</span>
          </div>
        )}

        <CalculatorActionBar
          calculateLabel="Calculate Attendance"
          onCalculate={handleCalculate}
          onReset={handleReset}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Attendance Result
        </h2>

        {!current.error && current.currentPct !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span>Your Current Attendance</span>
                <span className={current.isSafe ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {current.isSafe ? 'Above Target' : 'Below Target'}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.currentPct, 2)}%
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {current.statusText}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Attended</div>
                <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {current.attended} / {current.total}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Missed</div>
                <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                  {current.missed}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">
                  {current.isSafe ? 'Safe Bunks' : 'Must Attend'}
                </div>
                <div className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400 mt-0.5">
                  {current.isSafe ? current.classesCanMiss : current.classesNeeded}
                </div>
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Current Attendance %',
                  expression: `(${current.attended} ÷ ${current.total}) × 100 = ${formatNum(
                    current.currentPct,
                    2
                  )}%`,
                  highlight: true,
                },
                {
                  label: current.isSafe ? 'Classes You Can Miss' : 'Consecutive Classes Needed',
                  expression: current.isSafe
                    ? `${current.classesCanMiss} classes while staying ≥ ${current.req}%`
                    : `${current.classesNeeded} classes to reach ${current.req}%`,
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
// 14A. CGPA CALCULATOR
// ============================================================================

interface SemesterItem {
  id: string;
  name: string;
  credits: string;
  sgpa: string;
}

export const CgpaCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [semesters, setSemesters] = useState<SemesterItem[]>([
    { id: 's1', name: 'Semester 1', credits: '20', sgpa: '8.2' },
    { id: 's2', name: 'Semester 2', credits: '22', sgpa: '8.5' },
    { id: 's3', name: 'Semester 3', credits: '22', sgpa: '8.8' },
    { id: 's4', name: 'Semester 4', credits: '24', sgpa: '9.1' },
  ]);
  const [multiplier, setMultiplier] = useState<'9.5' | '10'>('9.5');

  const addSemester = () => {
    setSemesters((prev) => [
      ...prev,
      {
        id: `sem-${Date.now()}`,
        name: `Semester ${prev.length + 1}`,
        credits: '20',
        sgpa: '8.5',
      },
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSem = (id: string, field: keyof SemesterItem, val: string) => {
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const evaluateCgpa = () => {
    let totalCredits = 0;
    let weightedSum = 0;

    for (const s of semesters) {
      const cr = Number(s.credits);
      const gp = Number(s.sgpa);
      if (!Number.isFinite(cr) || cr <= 0) {
        return { error: `Credits in "${s.name}" must be greater than 0.` };
      }
      if (!Number.isFinite(gp) || gp < 0 || gp > 10) {
        return { error: `SGPA in "${s.name}" must be between 0 and 10.` };
      }
      totalCredits += cr;
      weightedSum += cr * gp;
    }

    const cgpa = roundNum(weightedSum / totalCredits, 2);
    const pct = roundNum(cgpa * Number(multiplier), 2);

    return {
      cgpa,
      weightedSum: roundNum(weightedSum, 2),
      totalCredits: roundNum(totalCredits, 1),
      pct,
      summary: `CGPA: ${formatNum(cgpa, 2)} (Equivalent Percentage: ${formatNum(pct, 2)}% across ${totalCredits} credits)`,
    };
  };

  const current = evaluateCgpa();

  const handleCalculate = () => {
    const out = evaluateCgpa();
    if (!out.error && out.summary) {
      onLogHistory(
        'cgpa-calc',
        'CGPA Calculator',
        `${semesters.length} Semesters (${out.totalCredits} Credits)`,
        out.summary
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Enter Semester Credits & SGPA
          </h2>
          <button
            type="button"
            onClick={addSemester}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Semester</span>
          </button>
        </div>

        <div className="space-y-3">
          {semesters.map((s) => (
            <div key={s.id} className="grid grid-cols-12 gap-2.5 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateSem(s.id, 'name', e.target.value)}
                  aria-label="Semester Name"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="any"
                  value={s.credits}
                  onChange={(e) => updateSem(s.id, 'credits', e.target.value)}
                  placeholder="Credits"
                  aria-label="Credits"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="10"
                  step="0.01"
                  value={s.sgpa}
                  onChange={(e) => updateSem(s.id, 'sgpa', e.target.value)}
                  placeholder="SGPA"
                  aria-label="SGPA"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                {semesters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSemester(s.id)}
                    aria-label="Delete semester"
                    className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Percentage Multiplier:
          </span>
          <button
            type="button"
            onClick={() => setMultiplier('9.5')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
              multiplier === '9.5'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            CGPA × 9.5 (CBSE/UGC)
          </button>
          <button
            type="button"
            onClick={() => setMultiplier('10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
              multiplier === '10'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            CGPA × 10
          </button>
        </div>

        {current.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{current.error}</span>
          </div>
        )}

        <CalculatorActionBar
          calculateLabel="Calculate CGPA"
          onCalculate={handleCalculate}
          onReset={() =>
            setSemesters([{ id: 's1', name: 'Semester 1', credits: '20', sgpa: '8.0' }])
          }
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Your CGPA Result
        </h2>
        {!current.error && current.cgpa !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400">Your Cumulative GPA (CGPA)</div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.cgpa, 2)}{' '}
                <span className="text-xl font-normal text-slate-400">/ 10.0</span>
              </div>
              <div className="mt-3 text-xs sm:text-sm text-emerald-400 font-mono">
                Equivalent Percentage: {formatNum(current.pct, 2)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Credits</div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {current.totalCredits}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Percentage</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatNum(current.pct, 2)}%
                </div>
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Total Weighted Grade Points',
                  expression: `${current.weightedSum}`,
                },
                {
                  label: 'CGPA Formula',
                  expression: `${current.weightedSum} ÷ ${current.totalCredits} = ${formatNum(
                    current.cgpa,
                    2
                  )}`,
                  highlight: true,
                },
                {
                  label: 'Equivalent Percentage',
                  expression: `${formatNum(current.cgpa, 2)} × ${multiplier} = ${formatNum(
                    current.pct,
                    2
                  )}%`,
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
// 14B. GPA CALCULATOR
// ============================================================================

interface CourseItem {
  id: string;
  subject: string;
  credits: string;
  gradePoint: string;
}

export const GpaCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [scale, setScale] = useState<'10' | '4'>('10');
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: 'c1', subject: 'Data Structures & Algorithms', credits: '4', gradePoint: '9' },
    { id: 'c2', subject: 'Engineering Mathematics', credits: '4', gradePoint: '10' },
    { id: 'c3', subject: 'Operating Systems', credits: '3', gradePoint: '8' },
    { id: 'c4', subject: 'Database Management', credits: '3', gradePoint: '9' },
  ]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        subject: `Subject ${prev.length + 1}`,
        credits: '3',
        gradePoint: scale === '10' ? '9' : '4.0',
      },
    ]);
  };

  const updateCourse = (id: string, field: keyof CourseItem, val: string) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const evaluateGpa = () => {
    const maxScale = Number(scale);
    let totalCredits = 0;
    let totalPoints = 0;

    for (const c of courses) {
      const cr = Number(c.credits);
      const gp = Number(c.gradePoint);
      if (!Number.isFinite(cr) || cr <= 0) {
        return { error: `Credits for "${c.subject}" must be greater than 0.` };
      }
      if (!Number.isFinite(gp) || gp < 0 || gp > maxScale) {
        return { error: `Grade points for "${c.subject}" must be between 0 and ${maxScale}.` };
      }
      totalCredits += cr;
      totalPoints += cr * gp;
    }

    const gpa = roundNum(totalPoints / totalCredits, 2);
    const pct = scale === '10' ? roundNum(gpa * 9.5, 2) : roundNum((gpa / 4) * 100, 2);

    return {
      gpa,
      totalCredits,
      totalPoints: roundNum(totalPoints, 2),
      pct,
      summary: `Semester GPA: ${formatNum(gpa, 2)} / ${scale}.0 (${totalCredits} Credits · ~${pct}%)`,
    };
  };

  const current = evaluateGpa();

  const handleCalculate = () => {
    const out = evaluateGpa();
    if (!out.error && out.summary) {
      onLogHistory(
        'gpa-calc',
        'GPA Calculator',
        `${courses.length} Subjects (${out.totalCredits} Credits)`,
        out.summary
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Subject Credits & Grades
            </h2>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setScale('10')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  scale === '10' ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                10-Pt
              </button>
              <button
                type="button"
                onClick={() => setScale('4')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  scale === '4' ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                4.0
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={addCourse}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>

        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="grid grid-cols-12 gap-2.5 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  value={c.subject}
                  onChange={(e) => updateCourse(c.id, 'subject', e.target.value)}
                  placeholder="Subject Name"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="any"
                  value={c.credits}
                  onChange={(e) => updateCourse(c.id, 'credits', e.target.value)}
                  placeholder="Credits"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max={scale}
                  step="any"
                  value={c.gradePoint}
                  onChange={(e) => updateCourse(c.id, 'gradePoint', e.target.value)}
                  placeholder="Grade Pt"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                {courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(c.id)}
                    aria-label="Remove course"
                    className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {current.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{current.error}</span>
          </div>
        )}

        <CalculatorActionBar
          calculateLabel="Calculate GPA"
          onCalculate={handleCalculate}
          onReset={() =>
            setCourses([
              {
                id: 'c1',
                subject: 'Subject 1',
                credits: '4',
                gradePoint: scale === '10' ? '9' : '4',
              },
            ])
          }
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Your GPA Result
        </h2>
        {!current.error && current.gpa !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400">Your Semester GPA</div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.gpa, 2)}{' '}
                <span className="text-xl font-normal text-slate-400">/ {scale}.0</span>
              </div>
              <div className="mt-3 text-xs sm:text-sm text-slate-300 font-mono">
                Total Credit Points: {current.totalPoints} · Total Credits: {current.totalCredits}
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Total Credit Points',
                  expression: `${current.totalPoints}`,
                },
                {
                  label: 'Total Credits',
                  expression: `${current.totalCredits}`,
                },
                {
                  label: 'Semester GPA',
                  expression: `${current.totalPoints} ÷ ${current.totalCredits} = ${formatNum(
                    current.gpa,
                    2
                  )}`,
                  highlight: true,
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
// 13C. STUDY TIME CALCULATOR
// ============================================================================

export const StudyTimeCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [totalChapters, setTotalChapters] = useState<string>('24');
  const [hoursPerChapter, setHoursPerChapter] = useState<string>('3');
  const [daysLeft, setDaysLeft] = useState<string>('30');
  const [dailyStudyHours, setDailyStudyHours] = useState<string>('3.5');
  const [bufferDays, setBufferDays] = useState<string>('4');

  const evaluateStudyPlan = () => {
    const chapters = Number(totalChapters);
    const hrsPerCh = Number(hoursPerChapter);
    const days = Number(daysLeft);
    const dailyHrs = Number(dailyStudyHours);
    const buf = Number(bufferDays);

    if (chapters <= 0 || hrsPerCh <= 0 || days <= 0 || dailyHrs <= 0 || buf < 0) {
      return { error: 'Please enter positive values for chapters, hours, and days.' };
    }
    if (buf >= days) {
      return { error: 'Revision Buffer Days must be less than total Days Left.' };
    }

    const effectiveDays = days - buf;
    const totalHoursRequired = roundNum(chapters * hrsPerCh, 1);
    const totalAvailableHours = roundNum(effectiveDays * dailyHrs, 1);
    const requiredDailyPace = roundNum(totalHoursRequired / effectiveDays, 2);
    const chaptersPerDay = roundNum(chapters / effectiveDays, 2);
    const dailyPomodoros = Math.ceil((requiredDailyPace * 60) / 25);
    const surplusHours = roundNum(totalAvailableHours - totalHoursRequired, 1);

    return {
      effectiveDays,
      totalHoursRequired,
      totalAvailableHours,
      requiredDailyPace,
      chaptersPerDay,
      dailyPomodoros,
      surplusHours,
      isFeasible: surplusHours >= 0 && requiredDailyPace <= 14,
      summary: `Total Study Required: ${totalHoursRequired} hrs across ${effectiveDays} study days · Required Pace: ${requiredDailyPace} hrs/day (${dailyPomodoros} Pomodoros/day)`,
    };
  };

  const current = evaluateStudyPlan();

  const handleCalculate = () => {
    const out = evaluateStudyPlan();
    if (!out.error && out.summary) {
      onLogHistory(
        'study-time-calc',
        'Study Time Calculator',
        `${totalChapters} chapters, ${daysLeft} days left`,
        out.summary
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Study & Exam Countdown Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Total Chapters / Topics
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={totalChapters}
              onChange={(e) => setTotalChapters(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Hours per Chapter
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.5"
              step="0.5"
              value={hoursPerChapter}
              onChange={(e) => setHoursPerChapter(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Days Until Exam
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={daysLeft}
              onChange={(e) => setDaysLeft(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              <LabelWithTooltip
                label="Revision Buffer Days"
                explanation="Days reserved right before the exam strictly for mock tests and full revision."
              />
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={bufferDays}
              onChange={(e) => setBufferDays(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Planned Daily Study Hours
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.5"
              max="18"
              step="0.5"
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold"
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
          calculateLabel="Calculate Study Plan"
          onCalculate={handleCalculate}
          onReset={() => {
            setTotalChapters('20');
            setHoursPerChapter('3');
            setDaysLeft('30');
            setBufferDays('5');
            setDailyStudyHours('3');
          }}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Daily Study Schedule Result
        </h2>

        {!current.error && current.requiredDailyPace !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span>Required Daily Study Pace</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {current.isFeasible ? 'On Track' : 'Needs Extra Hours'}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.requiredDailyPace, 2)} hrs / day
              </div>
              <div className="mt-3 text-xs sm:text-sm text-slate-300 font-mono">
                ≈ {current.dailyPomodoros} Pomodoro sessions (25m) per day
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Total Study Hours Needed',
                  expression: `${totalChapters} × ${hoursPerChapter} = ${current.totalHoursRequired} hrs`,
                },
                {
                  label: 'Active Study Days',
                  expression: `${daysLeft} − ${bufferDays} buffer = ${current.effectiveDays} days`,
                },
                {
                  label: 'Daily Study Pace Required',
                  expression: `${current.totalHoursRequired} ÷ ${current.effectiveDays} = ${formatNum(
                    current.requiredDailyPace,
                    2
                  )} hrs/day`,
                  highlight: true,
                },
              ]}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
