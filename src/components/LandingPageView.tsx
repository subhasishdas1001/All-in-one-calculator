import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  FileCheck2,
  Compass,
  GraduationCap,
  Percent,
  Award,
  Landmark,
  ArrowRight,
  Check,
  Search,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Calculator,
  ArrowUpRight,
} from 'lucide-react';
import { CALCULATOR_TOOLS } from '../data/toolsCatalog';
import { CalculatorMeta, NavTab, PriorityTier, ToolId } from '../types/calculator';

interface LandingPageProps {
  onOpenTool: (toolId: ToolId) => void;
  onNavigateTab: (tab: NavTab) => void;
  toolIcons: Record<ToolId, React.ComponentType<{ className?: string }>>;
}

const POPULAR_TOOL_IDS: ToolId[] = [
  'negative-marking',
  'scientific-calc',
  'exam-score',
  'percentage-calc',
  'cgpa-calc',
  'emi-calc',
];

const HERO_MOCKUP_PRESETS = [
  {
    id: 'p1',
    exam: 'Standard Competitive (1/4 Neg)',
    total: 100,
    attempted: 80,
    correct: 64,
    wrong: 16,
    marksPerQ: 1,
    negPerW: 0.25,
    positiveMarks: 64,
    penaltyMarks: 4,
    finalScore: 60,
    maxScore: 100,
    accuracy: '80.0%',
  },
  {
    id: 'p2',
    exam: 'Civil Services Prelims (1/3 Neg)',
    total: 100,
    attempted: 84,
    correct: 60,
    wrong: 24,
    marksPerQ: 2,
    negPerW: 0.67,
    positiveMarks: 120,
    penaltyMarks: 16,
    finalScore: 104,
    maxScore: 200,
    accuracy: '71.4%',
  },
  {
    id: 'p3',
    exam: 'Engineering / Medical (+4 / −1)',
    total: 90,
    attempted: 76,
    correct: 65,
    wrong: 11,
    marksPerQ: 4,
    negPerW: 1,
    positiveMarks: 260,
    penaltyMarks: 11,
    finalScore: 249,
    maxScore: 360,
    accuracy: '85.5%',
  },
];

export const LandingPageView: React.FC<LandingPageProps> = ({
  onOpenTool,
  onNavigateTab,
  toolIcons,
}) => {
  const [mockupIdx, setMockupIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'student' | 'math' | 'finance' | 'converters'
  >('all');
  const directoryRef = useRef<HTMLElement | null>(null);

  const activeMockup = HERO_MOCKUP_PRESETS[mockupIdx];

  const popularTools = POPULAR_TOOL_IDS.map((id) =>
    CALCULATOR_TOOLS.find((t) => t.id === id)
  ).filter((t): t is CalculatorMeta => Boolean(t));

  const filteredTools = CALCULATOR_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'student' && (tool.category === 'exams' || tool.category === 'datetime')) ||
      (categoryFilter === 'math' && tool.category === 'math') ||
      (categoryFilter === 'finance' && tool.category === 'finance') ||
      (categoryFilter === 'converters' && tool.category === 'converters');
    return matchesSearch && matchesCategory;
  });

  const scrollToDirectory = () => {
    if (directoryRef.current) {
      directoryRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateTab('calculators');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ====================================================================
          1. HERO SECTION — "Calculate Smarter. Score Better."
         ==================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 dark:from-slate-900 dark:via-slate-950 dark:to-sky-950 text-white border border-slate-800 px-5 py-8 sm:px-10 sm:py-14 lg:p-14 shadow-xl">
        {/* Subtle Educational Mathematical Grid & Floating Symbols SVG */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-25"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="edu-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.16)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="hero-glow" cx="75%" cy="40%" r="50%">
                <stop offset="0%" stopColor="rgba(14, 165, 233, 0.35)" />
                <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>
            <rect width="1200" height="600" fill="url(#edu-grid)" />
            <circle cx="900" cy="240" r="340" fill="url(#hero-glow)" />
            {/* Smooth Mathematical Sine & Normal Distribution Curve */}
            <path
              d="M 0 460 Q 260 440, 440 280 T 860 180 T 1200 260"
              stroke="rgba(56, 189, 248, 0.35)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              fill="none"
            />
            <path
              d="M 120 520 C 360 500, 520 160, 760 220 C 960 270, 1080 120, 1200 100"
              stroke="rgba(16, 185, 129, 0.28)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Subtle Floating Mathematical Symbols */}
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block absolute top-10 left-[46%] font-mono text-2xl text-sky-400/40 select-none"
          >
            ∑(xᵢ)
          </motion.span>
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block absolute bottom-12 left-[42%] font-mono text-xl text-emerald-400/40 select-none"
          >
            √(a² + b²)
          </motion.span>
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:block absolute top-12 right-12 font-mono text-xl text-sky-300/35 select-none"
          >
            π ≈ 3.14159
          </motion.span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Copy & Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="text-xs sm:text-sm font-medium text-sky-300">
              <span>Student Calculator Platform</span>
              <span aria-hidden="true"> · </span>
              <span>22 Verified Tools</span>
              <span aria-hidden="true"> · </span>
              <span>Zero Sign-Up Required</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Calculate Smarter. Score Better.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Instantly calculate competitive exam scores, negative marking penalties (1/4, 1/3, 1/2, or custom), multi-section tests, CGPA, percentages, loan EMIs, GST, and scientific equations in one fast, distraction-free workspace.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onOpenTool('negative-marking')}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-lg shadow-sky-500/20"
              >
                <span>Try Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={scrollToDirectory}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] backdrop-blur-md border border-white/15 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Explore All Tools
              </button>
            </div>

            {/* Quiet Unboxed Metadata Highlights */}
            <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
              <span>1/4, 1/3 & Custom Negative Marking</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>DEG / RAD Scientific Engine</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>100% Private In-Browser Math</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Glassmorphism Calculator Device Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl space-y-4">
              {/* Mockup Top Bar */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[11px] font-medium text-sky-400">
                    Interactive Exam Score Preview
                  </div>
                  <div className="text-sm font-bold text-white">
                    {activeMockup.exam}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenTool('negative-marking')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Open Full Tool →
                </button>
              </div>

              {/* Interactive Scenario Selector Tabs inside Mockup */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
                {[
                  { idx: 0, label: '1/4 Penalty' },
                  { idx: 1, label: '1/3 Penalty' },
                  { idx: 2, label: 'JEE (+4/−1)' },
                ].map((tab) => (
                  <button
                    key={tab.idx}
                    type="button"
                    onClick={() => setMockupIdx(tab.idx)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      mockupIdx === tab.idx
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Live Display Screen */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Net Final Score</span>
                  <span className="text-xs font-mono text-emerald-400">
                    Accuracy: {activeMockup.accuracy}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <motion.div
                    key={activeMockup.finalScore}
                    initial={{ opacity: 0.4, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18 }}
                    className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-white"
                  >
                    {activeMockup.finalScore}
                    <span className="text-base font-normal text-slate-500">
                      {' '}
                      / {activeMockup.maxScore}
                    </span>
                  </motion.div>
                  <div className="text-right font-mono text-xs space-y-0.5">
                    <div className="text-emerald-400">
                      +{activeMockup.positiveMarks} Correct Marks
                    </div>
                    <div className="text-rose-400">
                      −{activeMockup.penaltyMarks} Penalty Marks
                    </div>
                  </div>
                </div>

                {/* Mini Question Distribution Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Correct: {activeMockup.correct}</span>
                    <span>Wrong: {activeMockup.wrong}</span>
                    <span>Skipped: {activeMockup.total - activeMockup.attempted}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-200"
                      style={{
                        width: `${(activeMockup.correct / activeMockup.total) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-200"
                      style={{
                        width: `${(activeMockup.wrong / activeMockup.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Calculator Switcher Row inside Mockup */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenTool('scientific-calc')}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] text-slate-400">STEM</div>
                  <div className="text-xs font-semibold text-white truncate">
                    Scientific
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTool('cgpa-calc')}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] text-slate-400">Academics</div>
                  <div className="text-xs font-semibold text-white truncate">
                    CGPA & GPA
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTool('emi-calc')}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] text-slate-400">Finance</div>
                  <div className="text-xs font-semibold text-white truncate">
                    Loan / EMI
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          2. POPULAR CALCULATORS SHOWCASE
         ==================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
              Most Used by Students
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Popular Calculators
            </h2>
          </div>
          <button
            type="button"
            onClick={scrollToDirectory}
            className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All 22 Calculators</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontally scrollable on compact mobile, 3-column grid on desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory">
          {popularTools.map((tool, index) => {
            const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
              'negative-marking': FileCheck2,
              'scientific-calc': Compass,
              'exam-score': GraduationCap,
              'percentage-calc': Percent,
              'cgpa-calc': Award,
              'emi-calc': Landmark,
            };
            const Icon = IconMap[tool.id] || Calculator;

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="min-w-[285px] sm:min-w-[320px] md:min-w-0 snap-start p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-all flex flex-col justify-between gap-5 shadow-xs hover:shadow-md"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/70 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      0{index + 1} · {tool.categoryLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {tool.formulaSummary}
                  </div>

                  <a
                    href={tool.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenTool(tool.id);
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-sky-600 dark:hover:bg-sky-600 active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Use Calculator</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          3. STUDENT SECTION — "Everything Students Need in One Place"
         ==================================================================== */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Custom High-Craft Student & Exam Analytics Illustration */}
          <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="text-xs font-medium text-sky-400">
                Exam Preparation & Academic Analytics
              </div>
              <h3 className="text-xl font-bold text-white">
                Visual Score Breakdown & Accuracy Tracking
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Compare section-wise performance, simulate negative marking penalties, and track target attendance in seconds.
              </p>
            </div>

            {/* Embedded Vector Illustration of Exam Score & Study Curve */}
            <div className="my-6 relative z-10">
              <svg
                className="w-full h-48 sm:h-56"
                viewBox="0 0 500 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Illustration of student exam performance curve and section score bars"
              >
                {/* Background Card Frame */}
                <rect
                  x="10"
                  y="10"
                  width="480"
                  height="200"
                  rx="16"
                  fill="rgba(15, 23, 42, 0.75)"
                  stroke="rgba(56, 189, 248, 0.25)"
                  strokeWidth="1.5"
                />
                {/* Horizontal Reference Lines */}
                <line x1="40" y1="55" x2="460" y2="55" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4 4" />
                <line x1="40" y1="105" x2="460" y2="105" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4 4" />
                <line x1="40" y1="155" x2="460" y2="155" stroke="rgba(148, 163, 184, 0.25)" />

                {/* Section Bars */}
                <rect x="65" y="75" width="38" height="80" rx="6" fill="rgba(14, 165, 233, 0.85)" />
                <rect x="145" y="50" width="38" height="105" rx="6" fill="rgba(16, 185, 129, 0.85)" />
                <rect x="225" y="65" width="38" height="90" rx="6" fill="rgba(56, 189, 248, 0.85)" />
                <rect x="305" y="40" width="38" height="115" rx="6" fill="rgba(16, 185, 129, 0.9)" />

                {/* Accuracy Trend Line */}
                <path
                  d="M 84 70 L 164 46 L 244 60 L 324 34 L 415 28"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="84" cy="70" r="4.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
                <circle cx="164" cy="46" r="4.5" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                <circle cx="244" cy="60" r="4.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
                <circle cx="324" cy="34" r="4.5" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                <circle cx="415" cy="28" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

                {/* Labels */}
                <text x="64" y="178" fill="#94A3B8" fontSize="11" fontFamily="monospace">Sec A</text>
                <text x="144" y="178" fill="#94A3B8" fontSize="11" fontFamily="monospace">Sec B</text>
                <text x="224" y="178" fill="#94A3B8" fontSize="11" fontFamily="monospace">Sec C</text>
                <text x="304" y="178" fill="#94A3B8" fontSize="11" fontFamily="monospace">Final</text>
                <text x="380" y="65" fill="#34D399" fontSize="12" fontWeight="bold" fontFamily="monospace">88.5% Acc</text>
                <text x="380" y="85" fill="#38BDF8" fontSize="11" fontFamily="monospace">CGPA 9.12</text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/90 text-xs font-mono relative z-10">
              <div>
                <div className="text-slate-400 font-sans">Mock Exams</div>
                <div className="text-sm font-bold text-white">1/4 & 1/3 Rules</div>
              </div>
              <div>
                <div className="text-slate-400 font-sans">University</div>
                <div className="text-sm font-bold text-emerald-400">10-Pt & 4.0 GPA</div>
              </div>
              <div>
                <div className="text-slate-400 font-sans">Attendance</div>
                <div className="text-sm font-bold text-sky-400">75%–85% Target</div>
              </div>
            </div>
          </div>

          {/* Right Column: Feature Points & Action */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                Built for Academic Excellence
              </div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                style={{ textWrap: 'balance' }}
              >
                Everything Students Need in One Place
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Instead of switching between ten different websites during exam preparation, SmartCalc unifies competitive test scoring, STEM equations, and college grading into one reliable platform.
              </p>
            </div>

            <ul className="space-y-3.5">
              {[
                {
                  title: 'Fast calculations',
                  desc: 'Instant keyboard-driven evaluation with zero page reloads or clutter.',
                },
                {
                  title: 'Exam score analysis',
                  desc: 'Multi-section breakdowns (Section A, B, C) with net score and attempt rate.',
                },
                {
                  title: 'Negative marking calculation',
                  desc: 'Built-in 1/4, 1/3, 1/2, and custom penalty presets with What-If sensitivity.',
                },
                {
                  title: 'Scientific calculations',
                  desc: 'Trigonometry in DEG/RAD, inverse functions, logarithms, factorials, and powers.',
                },
                {
                  title: 'Student-friendly tools',
                  desc: 'CGPA to percentage converter, course GPA, 75% attendance planner, and cutoff age calculator.',
                },
              ].map((feat) => (
                <li key={feat.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <strong className="font-bold text-slate-900 dark:text-white">
                      {feat.title}:
                    </strong>{' '}
                    <span className="text-slate-600 dark:text-slate-300">
                      {feat.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('students')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Explore Student Tools Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('learn')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Read Formula Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. HOW IT WORKS — 3-Step Visual Section
         ==================================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
            Simple 3-Step Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Go from raw question counts or financial figures to verified results in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: '1. Choose a Calculator',
              desc: 'Pick from 22 specialized calculators across Competitive Exams, STEM, Student Grading, Finance, and Unit Conversion.',
              icon: Sparkles,
            },
            {
              step: '02',
              title: '2. Enter Your Details',
              desc: 'Input your values or load a verified exam preset. Smart validation automatically checks for inconsistencies or division by zero.',
              icon: SlidersHorizontal,
            },
            {
              step: '03',
              title: '3. Get Your Result',
              desc: 'View your complete breakdown immediately. Copy, share, bookmark to local history, or export a text score report.',
              icon: CheckCircle2,
            },
          ].map((item, idx) => {
            const StepIcon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.25, delay: idx * 0.06 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-slate-200 dark:text-slate-800">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          5. TRUST / ACCURACY SECTION — "Fast • Simple • Accurate • Student-Friendly"
         ==================================================================== */}
      <section className="rounded-3xl bg-slate-900 dark:bg-slate-900 text-white border border-slate-800 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs sm:text-sm font-semibold text-sky-400 tracking-wide">
              Fast • Simple • Accurate • Student-Friendly
            </div>

            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Engineered for Mathematical Precision & Exam-Day Confidence
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Every calculator in SmartCalc uses strict input validation, exact fractional ratios (such as 1/3 and 1/4 negative marking), and IEEE-754 floating-point rounding protection so your score and financial estimates are always dependable.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-white">
                    Strict Input Validation
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Prevents invalid question totals, negative counts, and division by zero with clear explanations.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-start gap-3">
                <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-white">
                    100% Local & Private
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    All calculations and saved history stay in your browser—no personal data is ever transmitted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Geometry & Calculator Precision Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <svg
                className="w-full h-40"
                viewBox="0 0 360 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Geometric mathematical accuracy diagram"
              >
                <circle cx="100" cy="80" r="56" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="100" cy="80" r="36" stroke="rgba(16, 185, 129, 0.45)" strokeWidth="1.5" />
                <polygon
                  points="100,28 148,108 52,108"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  fill="rgba(56, 189, 248, 0.08)"
                />
                <line x1="185" y1="35" x2="335" y2="35" stroke="rgba(148, 163, 184, 0.25)" />
                <text x="185" y="62" fill="#38BDF8" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  Score = C×M − W×N
                </text>
                <text x="185" y="88" fill="#34D399" fontSize="12" fontFamily="monospace">
                  Acc = (C ÷ Att) × 100
                </text>
                <text x="185" y="114" fill="#E2E8F0" fontSize="12" fontFamily="monospace">
                  CGPA = ∑(Cr×GP) ÷ ∑Cr
                </text>
                <line x1="185" y1="130" x2="335" y2="130" stroke="rgba(148, 163, 184, 0.25)" />
              </svg>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span>Verified Formula Engine</span>
                <span className="font-mono text-emerald-400">±0.0001 Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. COMPLETE INTERACTIVE CALCULATOR DIRECTORY (22 Tools)
         ==================================================================== */}
      <section ref={directoryRef} id="all-calculators-directory" className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              All Calculator Tools ({filteredTools.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Filter by build priority or search any calculator by name or topic
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 22 calculators..."
                aria-label="Search calculators"
                className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All (22)' },
                  { id: 'student', label: 'Student & Exams (8)' },
                  { id: 'math', label: 'Math (4)' },
                  { id: 'finance', label: 'Finance (4)' },
                  { id: 'converters', label: 'Converters (6)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    categoryFilter === tab.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No calculators match "{searchQuery}"
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Reset search and category filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const IconComponent = toolIcons[tool.id] || Calculator;
              return (
                <a
                  key={tool.id}
                  href={tool.slug}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenTool(tool.id);
                  }}
                  className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-all flex flex-col justify-between gap-4 cursor-pointer shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-sky-600 group-hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {tool.categoryLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                    <span>Use Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
