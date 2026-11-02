/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator,
  Compass,
  FileCheck2,
  GraduationCap,
  Percent,
  Divide,
  Landmark,
  Receipt,
  Tag,
  ArrowLeftRight,
  Clock,
  Calendar,
  Ruler,
  Scale,
  Thermometer,
  UserCheck,
  Award,
  BookOpen,
  Timer,
  Sun,
  Moon,
  ArrowLeft,
  ArrowUpRight,
  Home,
  LayoutGrid,
  History as HistoryIcon,
  Coins,
  Gauge,
  HardDrive,
} from 'lucide-react';
import { CALCULATOR_TOOLS } from './data/toolsCatalog';
import {
  CalculationHistoryItem,
  CalculatorMeta,
  NavTab,
  PriorityTier,
  ToolId,
} from './types/calculator';
import {
  NegativeMarkingCalculator,
  ExamScoreCalculator,
} from './components/calculators/NegativeMarkingCalc';
import { StandardScientificCalculator } from './components/calculators/StandardScientificCalc';
import {
  PercentageCalculator,
  FractionCalculator,
} from './components/calculators/MathPercentageFractionCalc';
import {
  LoanEmiCalculator,
  GstCalculator,
  DiscountCalculator,
  CurrencyCalculator,
} from './components/calculators/FinanceCalculators';
import { UnitConverterSuite } from './components/calculators/UnitConverters';
import {
  AgeCalculator,
  DateCalculator,
} from './components/calculators/DateAgeCalculators';
import {
  AttendanceCalculator,
  CgpaCalculator,
  GpaCalculator,
  StudyTimeCalculator,
} from './components/calculators/StudentCalculators';
import { GuideAndLearnView } from './components/GuideAndLearnView';
import { HistoryView } from './components/HistoryView';
import { LandingPageView } from './components/LandingPageView';
import { SeoHeadManager } from './components/SeoHeadManager';
import { CalculatorSeoContent } from './components/CalculatorSeoContent';
import { LegalTrustViews } from './components/LegalTrustViews';

const HISTORY_STORAGE_KEY = 'smartcalc_history_v1';
const THEME_STORAGE_KEY = 'smartcalc_theme_v1';

const TAB_PATH_MAP: Record<NavTab, string> = {
  home: '/',
  calculators: '/calculators',
  students: '/student-tools',
  finance: '/finance-calculators',
  converters: '/converters',
  learn: '/how-it-works',
  history: '/history',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  disclaimer: '/disclaimer',
};

const TOOL_ICONS: Record<ToolId, React.ComponentType<{ className?: string }>> = {
  'negative-marking': FileCheck2,
  'exam-score': GraduationCap,
  'normal-calc': Calculator,
  'scientific-calc': Compass,
  'percentage-calc': Percent,
  'fraction-calc': Divide,
  'emi-calc': Landmark,
  'gst-calc': Receipt,
  'discount-calc': Tag,
  'currency-calc': Coins,
  'unit-converter': ArrowLeftRight,
  'age-calc': Clock,
  'date-calc': Calendar,
  'length-converter': Ruler,
  'weight-converter': Scale,
  'temperature-converter': Thermometer,
  'speed-converter': Gauge,
  'data-converter': HardDrive,
  'attendance-calc': UserCheck,
  'cgpa-calc': Award,
  'gpa-calc': BookOpen,
  'study-time-calc': Timer,
};

function resolvePathToRoute(pathname: string): {
  tab: NavTab;
  toolId: ToolId | null;
} {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  // Check if path matches any calculator SEO slug
  const matchedTool = CALCULATOR_TOOLS.find((t) => t.slug === cleanPath);
  if (matchedTool) {
    return { tab: 'calculators', toolId: matchedTool.id };
  }

  // Check if path matches any NavTab route
  const matchedTabEntry = (Object.entries(TAB_PATH_MAP) as [NavTab, string][]).find(
    ([, slug]) => slug === cleanPath
  );
  if (matchedTabEntry) {
    return { tab: matchedTabEntry[0], toolId: null };
  }

  return { tab: 'home', toolId: null };
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore
    }
    return false;
  });

  const initialRoute =
    typeof window !== 'undefined'
      ? resolvePathToRoute(window.location.pathname)
      : { tab: 'home' as NavTab, toolId: null };

  const [activeTab, setActiveTab] = useState<NavTab>(initialRoute.tab);
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(initialRoute.toolId);

  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'seed-1',
        toolId: 'negative-marking',
        toolName: 'Negative Marking Calculator',
        inputsSummary: 'Total: 100, Attempted: 80 (60C / 20W), +1/-0.25',
        resultSummary: 'Final Score: 55 / 100 (55%) · Accuracy: 75%',
        timestamp: 'Verified Sample',
        isPinned: true,
      },
    ];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Listen to browser Back/Forward navigation for clean SEO URLs
  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolvePathToRoute(window.location.pathname);
      setActiveTab(resolved.tab);
      setActiveToolId(resolved.toolId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogHistory = useCallback(
    (toolId: ToolId, toolName: string, inputsSummary: string, resultSummary: string) => {
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const newItem: CalculationHistoryItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        toolId,
        toolName,
        inputsSummary,
        resultSummary,
        timestamp: formattedTime,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 99)]);
    },
    []
  );

  const handleTogglePinHistory = useCallback((id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  }, []);

  const handleOpenTool = useCallback((toolId: ToolId) => {
    const toolMeta = CALCULATOR_TOOLS.find((t) => t.id === toolId);
    setActiveToolId(toolId);
    if (toolMeta && typeof window !== 'undefined') {
      try {
        window.history.pushState({ toolId }, '', toolMeta.slug);
      } catch {
        // ignore in restricted iframe environments
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateTab = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    setActiveToolId(null);
    const targetSlug = TAB_PATH_MAP[tab] || '/';
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ tab }, '', targetSlug);
      } catch {
        // ignore in restricted iframe environments
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeToolMeta: CalculatorMeta | undefined = activeToolId
    ? CALCULATOR_TOOLS.find((t) => t.id === activeToolId)
    : undefined;

  const studentTools = CALCULATOR_TOOLS.filter((t) => t.isStudentTool);
  const financeTools = CALCULATOR_TOOLS.filter((t) => t.category === 'finance');
  const converterTools = CALCULATOR_TOOLS.filter(
    (t) => t.category === 'converters' || t.category === 'datetime'
  );

  const renderCalculatorTool = (toolId: ToolId) => {
    switch (toolId) {
      case 'negative-marking':
        return <NegativeMarkingCalculator onLogHistory={handleLogHistory} />;
      case 'exam-score':
        return <ExamScoreCalculator onLogHistory={handleLogHistory} />;
      case 'normal-calc':
        return <StandardScientificCalculator mode="normal" onLogHistory={handleLogHistory} />;
      case 'scientific-calc':
        return <StandardScientificCalculator mode="scientific" onLogHistory={handleLogHistory} />;
      case 'percentage-calc':
        return <PercentageCalculator onLogHistory={handleLogHistory} />;
      case 'fraction-calc':
        return <FractionCalculator onLogHistory={handleLogHistory} />;
      case 'emi-calc':
        return <LoanEmiCalculator onLogHistory={handleLogHistory} />;
      case 'gst-calc':
        return <GstCalculator onLogHistory={handleLogHistory} />;
      case 'discount-calc':
        return <DiscountCalculator onLogHistory={handleLogHistory} />;
      case 'currency-calc':
        return <CurrencyCalculator onLogHistory={handleLogHistory} />;
      case 'unit-converter':
        return (
          <UnitConverterSuite
            initialCategory="length"
            lockedCategory={false}
            toolId="unit-converter"
            onLogHistory={handleLogHistory}
          />
        );
      case 'length-converter':
        return (
          <UnitConverterSuite
            initialCategory="length"
            lockedCategory={true}
            toolId="length-converter"
            onLogHistory={handleLogHistory}
          />
        );
      case 'weight-converter':
        return (
          <UnitConverterSuite
            initialCategory="weight"
            lockedCategory={true}
            toolId="weight-converter"
            onLogHistory={handleLogHistory}
          />
        );
      case 'temperature-converter':
        return (
          <UnitConverterSuite
            initialCategory="temperature"
            lockedCategory={true}
            toolId="temperature-converter"
            onLogHistory={handleLogHistory}
          />
        );
      case 'speed-converter':
        return (
          <UnitConverterSuite
            initialCategory="speed"
            lockedCategory={true}
            toolId="speed-converter"
            onLogHistory={handleLogHistory}
          />
        );
      case 'data-converter':
        return (
          <UnitConverterSuite
            initialCategory="data"
            lockedCategory={true}
            toolId="data-converter"
            onLogHistory={handleLogHistory}
          />
        );
      case 'age-calc':
        return <AgeCalculator onLogHistory={handleLogHistory} />;
      case 'date-calc':
        return <DateCalculator onLogHistory={handleLogHistory} />;
      case 'attendance-calc':
        return <AttendanceCalculator onLogHistory={handleLogHistory} />;
      case 'cgpa-calc':
        return <CgpaCalculator onLogHistory={handleLogHistory} />;
      case 'gpa-calc':
        return <GpaCalculator onLogHistory={handleLogHistory} />;
      case 'study-time-calc':
        return <StudyTimeCalculator onLogHistory={handleLogHistory} />;
      default:
        return <NegativeMarkingCalculator onLogHistory={handleLogHistory} />;
    }
  };

  const renderToolCard = (tool: CalculatorMeta) => {
    const IconComponent = TOOL_ICONS[tool.id] || Calculator;
    return (
      <a
        key={tool.id}
        href={tool.slug}
        onClick={(e) => {
          e.preventDefault();
          handleOpenTool(tool.id);
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
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Dynamic SEO Metadata, Canonical Tag & Schema.org JSON-LD Manager */}
      <SeoHeadManager activeTool={activeToolMeta} activeTab={activeTab} />

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 h-14 px-4 sm:px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (single text element, one line) */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigateTab('home');
          }}
          className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 font-display"
        >
          SmartCalc
        </a>

        {/* Zone 2: 5 Single-Line Search-Friendly Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {(
            [
              { id: 'home', label: 'Home', href: '/' },
              { id: 'calculators', label: 'Calculators', href: '/calculators' },
              { id: 'students', label: 'Student Tools', href: '/student-tools' },
              { id: 'finance', label: 'Finance', href: '/finance-calculators' },
              { id: 'converters', label: 'Converters', href: '/converters' },
            ] as { id: NavTab; label: string; href: string }[]
          ).map((nav) => {
            const isCurrent = activeTab === nav.id && !activeToolId;
            return (
              <a
                key={nav.id}
                href={nav.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateTab(nav.id);
                }}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isCurrent
                    ? 'border-sky-600 text-slate-900 dark:text-white font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {nav.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Light / Dark Mode Switch) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 md:pb-14">
        {activeToolMeta ? (
          /* Dedicated Individual Calculator Landing Page (SEO-First 9-Part Architecture) */
          <article className="space-y-6">
            {/* Semantic Breadcrumb & Quick Switcher Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5">
                <nav
                  aria-label="Breadcrumb"
                  className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                >
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigateTab('home');
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </a>
                  <span aria-hidden="true">/</span>
                  <a
                    href="/calculators"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigateTab('calculators');
                    }}
                    className="hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer"
                  >
                    {activeToolMeta.categoryLabel}
                  </a>
                  <span aria-hidden="true">/</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {activeToolMeta.name}
                  </span>
                </nav>

                {/* 1. Primary H1 Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {activeToolMeta.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  {activeToolMeta.description}
                </p>
              </div>

              {/* Quick Jump Dropdown to Switch Between Any of the 22 Calculators */}
              <div className="shrink-0">
                <label
                  htmlFor="calculator-tool-switcher"
                  className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                >
                  Switch Calculator Tool
                </label>
                <select
                  id="calculator-tool-switcher"
                  value={activeToolMeta.id}
                  onChange={(e) => handleOpenTool(e.target.value as ToolId)}
                  aria-label="Switch Calculator Tool"
                  className="h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {CALCULATOR_TOOLS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Working Calculator Near the Top of the Page */}
            <div>{renderCalculatorTool(activeToolMeta.id)}</div>

            {/* 3–9. Comprehensive SEO Content, How to Use, Formula, Examples, Deep-Dive Guides, FAQs, Related Calculators & Disclaimer */}
            <CalculatorSeoContent meta={activeToolMeta} onOpenTool={handleOpenTool} />
          </article>
        ) : activeTab === 'home' ? (
          /* Premium Student Calculator Platform Landing Page */
          <LandingPageView
            onOpenTool={handleOpenTool}
            onNavigateTab={handleNavigateTab}
            toolIcons={TOOL_ICONS}
          />
        ) : activeTab === 'calculators' ? (
          /* Priority-Structured Directory of All Calculators */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  All Online Calculators (22 Verified Tools)
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Browse our complete directory of exam, negative marking, scientific, student, financial, and unit conversion calculators.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigateTab('learn')}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                >
                  How It Works & Formulas
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateTab('history')}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                >
                  Saved History ({history.length})
                </button>
              </div>
            </div>

            {(
              [
                {
                  key: 'student',
                  title: '01. Student & Exam Calculators',
                  tools: CALCULATOR_TOOLS.filter(
                    (t) => t.category === 'exams' || t.category === 'datetime'
                  ),
                },
                {
                  key: 'math',
                  title: '02. Math & Scientific Calculators',
                  tools: CALCULATOR_TOOLS.filter((t) => t.category === 'math'),
                },
                {
                  key: 'finance',
                  title: '03. Finance, Loan EMI, GST & Discount Calculators',
                  tools: CALCULATOR_TOOLS.filter((t) => t.category === 'finance'),
                },
                {
                  key: 'converters',
                  title: '04. Unit Converters (Length, Weight, Temperature, Speed & Data)',
                  tools: CALCULATOR_TOOLS.filter((t) => t.category === 'converters'),
                },
              ]
            ).map((group) => (
              <section key={group.key} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {group.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.tools.map(renderToolCard)}
                </div>
              </section>
            ))}
          </div>
        ) : activeTab === 'students' ? (
          /* Dedicated Student Tools Hub */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Student & Competitive Exam Calculators
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                  Purpose-built online calculators for competitive exam negative marking, section-wise exam scores, college attendance tracking, semester GPA/CGPA computation, and STEM equations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNavigateTab('learn')}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold cursor-pointer self-start shrink-0"
              >
                Read Exam Concepts & Formulas →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentTools.map(renderToolCard)}
            </div>
          </div>
        ) : activeTab === 'finance' ? (
          /* Dedicated Finance Calculators Hub */
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Finance, Loan EMI, GST & Tax Calculators
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Calculate monthly education or home loan EMIs, add or remove GST with CGST/SGST splits, compute retail discounts, and convert international currencies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {financeTools.map(renderToolCard)}
            </div>
          </div>
        ) : activeTab === 'converters' ? (
          /* Dedicated Unit Converters & Date Calculators Hub */
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Unit Converters, Age & Date Calculators
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Convert length, weight, temperature, speed, and digital data storage units with exact conversion factors, or calculate exact chronological age and date intervals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {converterTools.map(renderToolCard)}
            </div>
          </div>
        ) : activeTab === 'history' ? (
          /* Calculation History Section */
          <HistoryView
            history={history}
            onDeleteOne={(id) => setHistory((prev) => prev.filter((item) => item.id !== id))}
            onTogglePin={handleTogglePinHistory}
            onClearAll={() => setHistory([])}
            onOpenTool={handleOpenTool}
          />
        ) : activeTab === 'learn' ? (
          /* How to Use & Educational Learn Section */
          <GuideAndLearnView onOpenTool={handleOpenTool} />
        ) : (
          /* E-E-A-T Trust & Legal Pages: About, Contact, Privacy Policy, Terms & Conditions, Disclaimer */
          <LegalTrustViews
            page={
              activeTab as 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer'
            }
            onNavigateTab={handleNavigateTab}
            onOpenTool={handleOpenTool}
          />
        )}
      </main>

      {/* Comprehensive SEO & E-E-A-T Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-4 sm:px-8 pb-24 md:pb-10 text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                SmartCalc – All-in-One Calculator
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Free online calculators for students, competitive exam aspirants, educators, and everyday calculations. Fast, accurate, mobile-friendly, and 100% private in your browser.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="/how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigateTab('learn');
                  }}
                  className="font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  How It Works & Formula Guides
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="/history"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigateTab('history');
                  }}
                  className="font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Calculation History
                </a>
              </div>
            </div>

            {/* Column 2: Exam & Student Calculators */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 dark:text-white">
                Exam & Student Tools
              </div>
              <ul className="space-y-1.5">
                {(
                  [
                    'negative-marking',
                    'exam-score',
                    'scientific-calc',
                    'percentage-calc',
                    'cgpa-calc',
                    'gpa-calc',
                    'attendance-calc',
                  ] as ToolId[]
                ).map((id) => {
                  const t = CALCULATOR_TOOLS.find((item) => item.id === id);
                  if (!t) return null;
                  return (
                    <li key={t.id}>
                      <a
                        href={t.slug}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenTool(t.id);
                        }}
                        className="hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer"
                      >
                        {t.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Finance, Date & Unit Converters */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 dark:text-white">
                Finance & Converters
              </div>
              <ul className="space-y-1.5">
                {(
                  [
                    'emi-calc',
                    'gst-calc',
                    'discount-calc',
                    'age-calc',
                    'date-calc',
                    'unit-converter',
                    'length-converter',
                  ] as ToolId[]
                ).map((id) => {
                  const t = CALCULATOR_TOOLS.find((item) => item.id === id);
                  if (!t) return null;
                  return (
                    <li key={t.id}>
                      <a
                        href={t.slug}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenTool(t.id);
                        }}
                        className="hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer"
                      >
                        {t.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 4: E-E-A-T Trust, Legal & Support */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 dark:text-white">
                Trust & Legal Pages
              </div>
              <ul className="space-y-1.5">
                {(
                  [
                    { id: 'about', label: 'About SmartCalc', href: '/about' },
                    { id: 'contact', label: 'Contact Us', href: '/contact' },
                    { id: 'privacy', label: 'Privacy Policy', href: '/privacy-policy' },
                    { id: 'terms', label: 'Terms & Conditions', href: '/terms-and-conditions' },
                    { id: 'disclaimer', label: 'Calculator Disclaimer', href: '/disclaimer' },
                  ] as { id: NavTab; label: string; href: string }[]
                ).map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigateTab(item.id);
                      }}
                      className="hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 dark:hover:text-white hover:underline"
                  >
                    XML Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mandatory E-E-A-T Disclaimer Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <p className="max-w-3xl leading-relaxed">
              <strong>Disclaimer:</strong> Results are provided for informational and calculation purposes. Always verify important calculations with official sources or examination guidelines.
            </p>
            <div className="shrink-0">
              © {new Date().getFullYear()} SmartCalc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation: Home | Calculators | Students | History */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center"
      >
        {(
          [
            { id: 'home', label: 'Home', icon: Home },
            { id: 'calculators', label: 'Calculators', icon: LayoutGrid },
            { id: 'students', label: 'Students', icon: GraduationCap },
            { id: 'history', label: 'History', icon: HistoryIcon },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !activeToolId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigateTab(item.id)}
              className={`h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
