import React from 'react';
import { ArrowUpRight, BookOpen, HelpCircle, ShieldAlert } from 'lucide-react';
import { CALCULATOR_TOOLS } from '../data/toolsCatalog';
import { CalculatorMeta, ToolId } from '../types/calculator';

interface CalculatorSeoContentProps {
  meta: CalculatorMeta;
  onOpenTool: (toolId: ToolId) => void;
}

export const CalculatorSeoContent: React.FC<CalculatorSeoContentProps> = ({
  meta,
  onOpenTool,
}) => {
  const relatedTools = meta.relatedToolIds
    .map((id) => CALCULATOR_TOOLS.find((t) => t.id === id))
    .filter((t): t is CalculatorMeta => Boolean(t));

  return (
    <div className="mt-12 space-y-10 border-t border-slate-200 dark:border-slate-800 pt-10">
      {/* 1. Short Explanation, How to Use, Formula & Worked Example */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            About the {meta.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {meta.longExplanation}
          </p>

          <div className="pt-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              How to Use the {meta.name}
            </h3>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
              {meta.howToSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Formula & Worked Example Box */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 self-start">
          <div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
              Mathematical Formula
            </div>
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              {meta.formulaSummary}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Example Calculation — {meta.example.scenario}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <strong className="font-semibold">Inputs:</strong> {meta.example.inputs}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-sky-700 dark:text-sky-400">
              <strong className="font-sans font-semibold">Output:</strong> {meta.example.output}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Comprehensive Deep-Dive Educational Guide for Negative Marking SEO Page */}
      {meta.id === 'negative-marking' && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <BookOpen className="w-4 h-4" />
              <span>Complete Competitive Exam Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              What is Negative Marking & How Does It Work in Competitive Exams?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Negative marking is an assessment rule used in objective multiple-choice examinations where a specific fraction of marks is deducted for every incorrect answer. Its primary purpose is to reward conceptual accuracy and discourage blind guessing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1/4 Negative Marking (0.25 Penalty)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deducts <strong>25%</strong> of the question’s reward for each wrong answer. On a 1-mark question, you lose 0.25 marks per error. On a 4-mark question (like JEE Main or NEET), you lose 1 mark per error. Four wrong answers cancel out one correct answer.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1/3 Negative Marking (0.33 Penalty)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deducts <strong>33.33%</strong> of the marks allotted to a question. Common in UPSC Civil Services Prelims, GATE, and NDA exams. Three wrong answers completely erase the marks gained from one right answer.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1/2 Negative Marking (0.50 Penalty)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deducts <strong>50%</strong> of the question’s marks for every wrong response. Because just two incorrect guesses cancel out one correct answer, random guessing in a 1/2 negative marking test sharply lowers your net score.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Comparison of Negative Marking Schemes (Example: 100 Questions, 60 Correct, 20 Wrong)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 pr-4 font-semibold">Marking Scheme</th>
                    <th className="py-2.5 px-3 font-semibold">Marks / Correct</th>
                    <th className="py-2.5 px-3 font-semibold">Penalty / Wrong</th>
                    <th className="py-2.5 px-3 font-semibold">Positive Marks</th>
                    <th className="py-2.5 px-3 font-semibold">Negative Penalty</th>
                    <th className="py-2.5 pl-3 text-right font-semibold">Final Net Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium text-slate-900 dark:text-white">
                      1/4 Negative Marking
                    </td>
                    <td className="py-2.5 px-3">+1.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−0.25</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">+60.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−5.00</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-slate-900 dark:text-white">
                      55.00 / 100
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium text-slate-900 dark:text-white">
                      1/3 Negative Marking
                    </td>
                    <td className="py-2.5 px-3">+1.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−0.3333</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">+60.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−6.67</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-slate-900 dark:text-white">
                      53.33 / 100
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium text-slate-900 dark:text-white">
                      1/2 Negative Marking
                    </td>
                    <td className="py-2.5 pr-3">+1.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−0.50</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">+60.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−10.00</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-slate-900 dark:text-white">
                      50.00 / 100
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium text-slate-900 dark:text-white">
                      +4 / −1 Scheme (JEE/NEET)
                    </td>
                    <td className="py-2.5 px-3">+4.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−1.00</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">+240.00</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">−20.00</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-slate-900 dark:text-white">
                      220.00 / 400
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Exam Score & Accuracy Calculation Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How to Calculate Final Exam Score & Score Percentage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                First, multiply your <strong>Correct Answers</strong> by the marks awarded per question. Second, multiply your <strong>Wrong Answers</strong> by the negative penalty per question. Subtract the negative marks from your positive marks to get your <strong>Final Net Score</strong>. To find your overall <strong>Score Percentage</strong>, divide your Final Net Score by the Maximum Possible Score and multiply by 100.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How to Calculate Exam Accuracy & Attempt Rate
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Accuracy Percentage</strong> measures how many of your attempted questions were right: <span className="font-mono">(Correct Answers ÷ Attempted Questions) × 100</span>. Meanwhile, <strong>Attempt Rate</strong> measures how much of the total exam paper you answered: <span className="font-mono">(Attempted Questions ÷ Total Questions) × 100</span>.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. Frequently Asked Questions (FAQ Section) */}
      {meta.faqs && meta.faqs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions — {meta.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meta.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Internal Linking: Related Calculators */}
      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Related Online Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rel) => (
              <a
                key={rel.id}
                href={rel.slug}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenTool(rel.id);
                }}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-colors flex flex-col justify-between gap-3 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{rel.categoryLabel}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 mt-1">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {rel.description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  Open Calculator →
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 5. Official E-E-A-T Calculator Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Disclaimer:</strong> Results are provided for informational and calculation purposes. Always verify important calculations with official sources or examination guidelines.
        </p>
      </div>
    </div>
  );
};
