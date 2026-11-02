import React, { useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { NavTab, ToolId } from '../types/calculator';

interface LegalTrustProps {
  page: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';
  onNavigateTab: (tab: NavTab) => void;
  onOpenTool: (toolId: ToolId) => void;
}

export const LegalTrustViews: React.FC<LegalTrustProps> = ({
  page,
  onNavigateTab,
  onOpenTool,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError('Please complete your name, email address, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setContactError('Please enter a valid email address.');
      return;
    }
    setContactError(null);
    setContactSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Sub-Navigation for Trust & Legal Pages */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {(
          [
            { id: 'about', label: 'About SmartCalc' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'disclaimer', label: 'Disclaimer' },
          ] as { id: NavTab; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigateTab(item.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              page === item.id
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {page === 'about' && (
        <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            About SmartCalc – All-in-One Student & General Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            SmartCalc was built to give students, competitive exam candidates, educators, and everyday users a fast, mathematically verified, and distraction-free calculation platform.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Whether you are evaluating mock test performance under 1/4 or 1/3 negative marking, computing multi-section exam scores, tracking college attendance percentages, converting semester SGPA to CGPA, or estimating education loan EMIs, every tool on SmartCalc is engineered for clarity and speed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                22 Tools
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Covering Competitive Exams, STEM, Grading, Finance & Unit Conversion
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                100% Local
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Calculations execute directly in your browser with zero server tracking
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                Verified Math
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Explicit input validation, formula transparency, and worked examples
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenTool('negative-marking')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Launch Negative Marking Calculator
            </button>
          </div>
        </article>
      )}

      {page === 'contact' && (
        <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Contact & Feedback
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Have a suggestion for a new calculator, an exam marking scheme preset, or a question about a formula? Send us a message below.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Thank you for your feedback!</span>
              </div>
              <p className="text-xs sm:text-sm">
                Your message has been recorded. We continually update SmartCalc’s exam presets and formula guides based on student feedback.
              </p>
              <button
                type="button"
                onClick={() => {
                  setContactSubmitted(false);
                  setContactName('');
                  setContactEmail('');
                  setContactMessage('');
                }}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline cursor-pointer pt-1"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Message or Calculator Request
                </label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe the exam rule, formula, or feature you would like us to add..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>

              {contactError && (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {contactError}
                </div>
              )}

              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </article>
      )}

      {page === 'privacy' && (
        <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy-First Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            SmartCalc is designed from the ground up to respect student and user privacy. All mathematical, exam, academic, and financial calculations are executed locally within your web browser on your device.
          </p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
            1. Local Calculation & Storage
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When you use any calculator or save items to your Calculation History, those records are stored strictly in your browser’s local storage (`localStorage`). You can delete individual history records or clear all history at any time with a single click.
          </p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
            2. No Unnecessary Personal Data Collection
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We do not require account registration, and we do not sell or transmit your exam scores, grades, dates of birth, or financial inputs to third-party servers.
          </p>
        </article>
      )}

      {page === 'terms' && (
        <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By accessing and using SmartCalc – All-in-One Calculator, you agree to the following terms of use:
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
            <li>
              SmartCalc provides online educational, mathematical, financial, and unit conversion calculators free of charge for personal and educational use.
            </li>
            <li>
              While every formula is rigorously tested for mathematical accuracy, users are responsible for verifying critical exam rules, university CGPA conversion multipliers, and loan/tax terms against official institutional documentation.
            </li>
            <li>
              You may freely copy, share, and export calculation results generated by the platform.
            </li>
          </ul>
        </article>
      )}

      {page === 'disclaimer' && (
        <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Calculator & Examination Disclaimer
          </h1>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-sm font-medium leading-relaxed">
            Results are provided for informational and calculation purposes. Always verify important calculations with official sources or examination guidelines.
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Examination Negative Marking Rules:</strong> Negative marking ratios (such as 1/4, 1/3, 1/2, or section-specific penalties) vary by examination body, paper, and question type. Always check the official examination notification and question paper instructions before estimating your expected score.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Financial & Tax Calculations:</strong> Loan EMI, GST, and currency outputs are mathematical estimates based on user-supplied rates and do not constitute formal banking, legal, or tax advice.
          </p>
        </article>
      )}
    </div>
  );
};
