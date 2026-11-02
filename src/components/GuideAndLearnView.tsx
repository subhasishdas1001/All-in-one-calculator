import React, { useState } from 'react';
import { BookOpen, ArrowUpRight, Compass } from 'lucide-react';
import { CALCULATOR_TOOLS, EDUCATIONAL_TOPICS } from '../data/toolsCatalog';
import { ToolId } from '../types/calculator';

interface GuideAndLearnProps {
  onOpenTool: (toolId: ToolId) => void;
}

export const GuideAndLearnView: React.FC<GuideAndLearnProps> = ({ onOpenTool }) => {
  const [section, setSection] = useState<'learn' | 'howto'>('learn');

  return (
    <div className="space-y-8">
      {/* Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Educational Guide & How to Use
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Clear, student-friendly explanations of negative marking, accuracy, percentages, EMI, GST, GPA/CGPA, and step-by-step instructions for every calculator.
          </p>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 self-start">
          <button
            type="button"
            onClick={() => setSection('learn')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              section === 'learn'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn Concepts</span>
          </button>
          <button
            type="button"
            onClick={() => setSection('howto')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              section === 'howto'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>How to Use Calculators</span>
          </button>
        </div>
      </div>

      {section === 'learn' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EDUCATIONAL_TOPICS.map((topic) => (
            <article
              key={topic.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>{topic.category}</span>
                  <span aria-hidden="true"> · </span>
                  <span>Concept Guide</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {topic.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {topic.summary}
                </p>

                {topic.formula && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-sky-700 dark:text-sky-400">
                    {topic.formula}
                  </div>
                )}

                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {topic.details.map((detail, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  <strong>Exam Tip:</strong> {topic.studentTip}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenTool(topic.relatedToolId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline shrink-0 cursor-pointer"
                >
                  <span>Open Calculator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CALCULATOR_TOOLS.map((tool, index) => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {String(index + 1).padStart(2, '0')}. How to use {tool.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => onOpenTool(tool.id)}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <ol className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
                  {tool.howToSteps.map((step, i) => (
                    <li key={i} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
                <div className="text-slate-500 dark:text-slate-400 font-medium">
                  Example: {tool.example.scenario}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-mono">
                  In: {tool.example.inputs}
                </div>
                <div className="text-sky-700 dark:text-sky-400 font-mono font-semibold">
                  Out: {tool.example.output}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
