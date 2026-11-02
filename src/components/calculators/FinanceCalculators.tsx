import React, { useState } from 'react';
import { AlertTriangle, ArrowLeftRight } from 'lucide-react';
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
// 7. LOAN / EMI CALCULATOR
// ============================================================================

export const LoanEmiCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [tenure, setTenure] = useState<string>('5');
  const [tenureUnit, setTenureUnit] = useState<'yearly' | 'monthly'>('yearly');

  const evaluateEmi = () => {
    const P = Number(loanAmount);
    const annualR = Number(interestRate);
    const rawTenure = Number(tenure);

    if (!Number.isFinite(P) || P <= 0) {
      return { error: 'Loan Amount must be greater than 0.' };
    }
    if (!Number.isFinite(annualR) || annualR < 0 || annualR > 100) {
      return { error: 'Interest Rate must be between 0% and 100%.' };
    }
    if (!Number.isFinite(rawTenure) || rawTenure <= 0) {
      return { error: 'Loan Tenure must be greater than 0.' };
    }

    const months = tenureUnit === 'yearly' ? Math.round(rawTenure * 12) : Math.round(rawTenure);
    if (months <= 0) {
      return { error: 'Loan Tenure in months must be at least 1.' };
    }

    let emi = 0;
    const monthlyRate = annualR / 12 / 100;
    if (annualR === 0) {
      emi = P / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      emi = (P * monthlyRate * factor) / (factor - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;
    const principalPct = totalPayment > 0 ? roundNum((P / totalPayment) * 100, 1) : 100;
    const interestPct = roundNum(100 - principalPct, 1);

    return {
      months,
      monthlyRate: roundNum(monthlyRate * 100, 4),
      emi: roundNum(emi, 2),
      totalInterest: roundNum(totalInterest, 2),
      totalPayment: roundNum(totalPayment, 2),
      principal: P,
      principalPct,
      interestPct,
      summary: `Monthly EMI: ${formatNum(emi, 2)} · Total Interest: ${formatNum(
        totalInterest,
        2
      )} · Total Payment: ${formatNum(totalPayment, 2)} (${months} months)`,
    };
  };

  const current = evaluateEmi();

  const handleCalculate = () => {
    const out = evaluateEmi();
    if (!out.error && out.summary) {
      onLogHistory(
        'emi-calc',
        'Loan / EMI Calculator',
        `Loan: ${formatNum(Number(loanAmount))}, Rate: ${interestRate}%, Tenure: ${tenure} ${tenureUnit}`,
        out.summary
      );
    }
  };

  const handleReset = () => {
    setLoanAmount('500000');
    setInterestRate('8.5');
    setTenure('5');
    setTenureUnit('yearly');
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCalculate();
        }
      }}
    >
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Loan Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              <LabelWithTooltip
                label="Loan Principal Amount"
                explanation="The total amount borrowed from the bank or financial institution."
              />
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="any"
              placeholder="e.g. 500000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                <LabelWithTooltip
                  label="Annual Interest Rate (% p.a.)"
                  explanation="Yearly nominal interest rate charged on the loan."
                />
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g. 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Loan Tenure ({tenureUnit === 'yearly' ? 'Years' : 'Months'})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="any"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTenureUnit('yearly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      tenureUnit === 'yearly'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Yrs
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenureUnit('monthly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      tenureUnit === 'monthly'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Mos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {current.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{current.error}</span>
          </div>
        )}

        <CalculatorActionBar
          calculateLabel="Calculate EMI"
          onCalculate={handleCalculate}
          onReset={handleReset}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          EMI & Repayment Breakdown
        </h2>

        {!current.error && current.emi !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400">
                Your Monthly EMI ({current.months} Months)
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.emi, 2)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Principal</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.principal, 0)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60">
                <div className="text-xs text-amber-700 dark:text-amber-400">Total Interest</div>
                <div className="text-base font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                  {formatNum(current.totalInterest, 2)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Payment</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.totalPayment, 2)}
                </div>
              </div>
            </div>

            {/* Principal vs Interest Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Principal ({current.principalPct}%)</span>
                <span>Interest ({current.interestPct}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-sky-600 h-full"
                  style={{ width: `${current.principalPct}%` }}
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${current.interestPct}%` }}
                />
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Loan Tenure in Months (N)',
                  expression: `${current.months} months`,
                },
                {
                  label: 'Monthly Interest Rate (R)',
                  expression: `${interestRate}% ÷ 12 = ${current.monthlyRate}% / month`,
                },
                {
                  label: 'Monthly EMI',
                  expression: `${formatNum(current.emi, 2)}`,
                  highlight: true,
                },
                {
                  label: 'Total Interest Payable',
                  expression: `(${formatNum(current.emi, 2)} × ${current.months}) − ${formatNum(
                    current.principal,
                    0
                  )} = ${formatNum(current.totalInterest, 2)}`,
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
// 8. GST CALCULATOR
// ============================================================================

export const GstCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [amount, setAmount] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<string>('18');
  const [gstMode, setGstMode] = useState<'add' | 'remove'>('add');

  const standardRates = ['5', '12', '18', '28'];

  const evaluateGst = () => {
    const amt = Number(amount);
    const rate = Number(gstRate);

    if (!Number.isFinite(amt) || amt < 0) {
      return { error: 'Amount cannot be negative.' };
    }
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      return { error: 'GST Rate must be between 0% and 100%.' };
    }

    let netAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (gstMode === 'add') {
      netAmount = amt;
      gstAmount = (amt * rate) / 100;
      totalAmount = amt + gstAmount;
    } else {
      netAmount = amt / (1 + rate / 100);
      gstAmount = amt - netAmount;
      totalAmount = amt;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      netAmount: roundNum(netAmount, 2),
      gstAmount: roundNum(gstAmount, 2),
      totalAmount: roundNum(totalAmount, 2),
      cgst: roundNum(cgst, 2),
      sgst: roundNum(sgst, 2),
      rate,
      summary: `Amount Excl. GST: ${formatNum(netAmount, 2)} · GST (${rate}%): ${formatNum(
        gstAmount,
        2
      )} · Total Incl. GST: ${formatNum(totalAmount, 2)}`,
    };
  };

  const current = evaluateGst();

  const handleCalculate = () => {
    const out = evaluateGst();
    if (!out.error && out.summary) {
      onLogHistory(
        'gst-calc',
        'GST Calculator',
        `${gstMode === 'add' ? 'Add' : 'Remove'} ${gstRate}% GST on ${formatNum(Number(amount))}`,
        out.summary
      );
    }
  };

  const handleReset = () => {
    setAmount('1000');
    setGstRate('18');
    setGstMode('add');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Enter Amount & GST Rate
          </h2>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setGstMode('add')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                gstMode === 'add'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Add GST
            </button>
            <button
              type="button"
              onClick={() => setGstMode('remove')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                gstMode === 'remove'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Remove GST
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              {gstMode === 'add' ? 'Amount (Excluding GST)' : 'Amount (Including GST)'}
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              GST Rate (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="any"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Common GST Slabs:
          </span>
          <div className="flex flex-wrap gap-2">
            {standardRates.map((slab) => (
              <button
                key={slab}
                type="button"
                onClick={() => setGstRate(slab)}
                className={`min-h-[42px] px-4 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer active:scale-[0.98] ${
                  gstRate === slab
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {slab}%
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
          calculateLabel="Calculate GST"
          onCalculate={handleCalculate}
          onReset={handleReset}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          GST Tax Result
        </h2>

        {!current.error && current.totalAmount !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400">Total Amount Including GST</div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.totalAmount, 2)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Net Amount</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.netAmount, 2)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60">
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  GST ({current.rate}%)
                </div>
                <div className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                  +{formatNum(current.gstAmount, 2)}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">CGST + SGST</div>
                <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {formatNum(current.cgst, 2)} + {formatNum(current.sgst, 2)}
                </div>
              </div>
            </div>

            <HowWasThisCalculated
              steps={
                gstMode === 'add'
                  ? [
                      {
                        label: 'GST Amount',
                        expression: `(${formatNum(current.netAmount, 2)} × ${current.rate}) ÷ 100 = ${formatNum(
                          current.gstAmount,
                          2
                        )}`,
                      },
                      {
                        label: 'Total Inclusive Amount',
                        expression: `${formatNum(current.netAmount, 2)} + ${formatNum(
                          current.gstAmount,
                          2
                        )} = ${formatNum(current.totalAmount, 2)}`,
                        highlight: true,
                      },
                    ]
                  : [
                      {
                        label: 'Net Pre-Tax Amount',
                        expression: `${formatNum(current.totalAmount, 2)} ÷ (1 + ${
                          current.rate
                        }/100) = ${formatNum(current.netAmount, 2)}`,
                      },
                      {
                        label: 'Extracted GST Tax',
                        expression: `${formatNum(current.totalAmount, 2)} − ${formatNum(
                          current.netAmount,
                          2
                        )} = ${formatNum(current.gstAmount, 2)}`,
                        highlight: true,
                      },
                    ]
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ============================================================================
// 9. DISCOUNT CALCULATOR
// ============================================================================

export const DiscountCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [originalPrice, setOriginalPrice] = useState<string>('1500');
  const [discountPct, setDiscountPct] = useState<string>('20');
  const [extraDiscountPct, setExtraDiscountPct] = useState<string>('0');

  const evaluateDiscount = () => {
    const price = Number(originalPrice);
    const d1 = Number(discountPct);
    const d2 = Number(extraDiscountPct || '0');

    if (!Number.isFinite(price) || price < 0) {
      return { error: 'Original Price cannot be negative.' };
    }
    if (!Number.isFinite(d1) || d1 < 0 || d1 > 100) {
      return { error: 'Discount % must be between 0% and 100%.' };
    }
    if (!Number.isFinite(d2) || d2 < 0 || d2 > 100) {
      return { error: 'Extra Discount % must be between 0% and 100%.' };
    }

    const firstSaved = (price * d1) / 100;
    const afterFirst = price - firstSaved;
    const secondSaved = (afterFirst * d2) / 100;
    const finalPrice = afterFirst - secondSaved;
    const totalSaved = firstSaved + secondSaved;
    const effectiveDiscountPct = price > 0 ? roundNum((totalSaved / price) * 100, 2) : 0;

    return {
      price: roundNum(price, 2),
      firstSaved: roundNum(firstSaved, 2),
      secondSaved: roundNum(secondSaved, 2),
      finalPrice: roundNum(finalPrice, 2),
      totalSaved: roundNum(totalSaved, 2),
      effectiveDiscountPct,
      summary: `Original: ${formatNum(price, 2)} · Saved: ${formatNum(
        totalSaved,
        2
      )} (${effectiveDiscountPct}%) · Final Price: ${formatNum(finalPrice, 2)}`,
    };
  };

  const current = evaluateDiscount();

  const handleCalculate = () => {
    const out = evaluateDiscount();
    if (!out.error && out.summary) {
      onLogHistory(
        'discount-calc',
        'Discount Calculator',
        `Price: ${originalPrice}, Discount: ${discountPct}%`,
        out.summary
      );
    }
  };

  const handleReset = () => {
    setOriginalPrice('1000');
    setDiscountPct('10');
    setExtraDiscountPct('0');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Price & Discount
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Original Price
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Discount (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="any"
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Extra Coupon %
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="any"
              value={extraDiscountPct}
              onChange={(e) => setExtraDiscountPct(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['5', '10', '15', '20', '25', '30', '50'].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setDiscountPct(pct)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer active:scale-[0.98] ${
                discountPct === pct
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {pct}% Off
            </button>
          ))}
        </div>

        {current.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{current.error}</span>
          </div>
        )}

        <CalculatorActionBar
          calculateLabel="Calculate Discount"
          onCalculate={handleCalculate}
          onReset={handleReset}
          resultText={current.summary || ''}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Final Price & Savings
        </h2>

        {!current.error && current.finalPrice !== undefined ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400">Final Payable Price</div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
                {formatNum(current.finalPrice, 2)}
              </div>
              <div className="mt-3 text-xs sm:text-sm text-emerald-400 font-mono">
                You Save: {formatNum(current.totalSaved, 2)} ({current.effectiveDiscountPct}% Off)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Original Price</div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatNum(current.price, 2)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60">
                <div className="text-xs text-emerald-700 dark:text-emerald-400">Amount Saved</div>
                <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                  −{formatNum(current.totalSaved, 2)}
                </div>
              </div>
            </div>

            <HowWasThisCalculated
              steps={[
                {
                  label: 'Discount Saved',
                  expression: `${formatNum(current.price, 2)} × ${discountPct}% = ${formatNum(
                    current.firstSaved,
                    2
                  )}`,
                },
                ...(Number(extraDiscountPct) > 0
                  ? [
                      {
                        label: 'Extra Coupon Saved',
                        expression: `${formatNum(current.secondSaved, 2)} (${extraDiscountPct}%)`,
                      },
                    ]
                  : []),
                {
                  label: 'Final Price',
                  expression: `${formatNum(current.price, 2)} − ${formatNum(
                    current.totalSaved,
                    2
                  )} = ${formatNum(current.finalPrice, 2)}`,
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
// 10. CURRENCY CALCULATOR
// ============================================================================

interface CurrencyDef {
  code: string;
  name: string;
  symbol: string;
  perUsd: number;
}

const CURRENCIES: CurrencyDef[] = [
  { code: 'USD', name: 'US Dollar (USD)', symbol: '$', perUsd: 1.0 },
  { code: 'INR', name: 'Indian Rupee (INR)', symbol: '₹', perUsd: 84.0 },
  { code: 'EUR', name: 'Euro (EUR)', symbol: '€', perUsd: 0.92 },
  { code: 'GBP', name: 'British Pound (GBP)', symbol: '£', perUsd: 0.78 },
  { code: 'JPY', name: 'Japanese Yen (JPY)', symbol: '¥', perUsd: 152.0 },
  { code: 'AUD', name: 'Australian Dollar (AUD)', symbol: 'A$', perUsd: 1.51 },
  { code: 'CAD', name: 'Canadian Dollar (CAD)', symbol: 'C$', perUsd: 1.38 },
  { code: 'SGD', name: 'Singapore Dollar (SGD)', symbol: 'S$', perUsd: 1.33 },
  { code: 'AED', name: 'UAE Dirham (AED)', symbol: 'AED ', perUsd: 3.6725 },
  { code: 'CHF', name: 'Swiss Franc (CHF)', symbol: 'CHF ', perUsd: 0.87 },
];

export const CurrencyCalculator: React.FC<CalcLoggerProps> = ({ onLogHistory }) => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('INR');
  const [customRate, setCustomRate] = useState<string>('');

  const fromCurr = CURRENCIES.find((c) => c.code === fromCode) || CURRENCIES[0];
  const toCurr = CURRENCIES.find((c) => c.code === toCode) || CURRENCIES[1];

  const defaultExchangeRate = roundNum(toCurr.perUsd / fromCurr.perUsd, 6);
  const activeRate =
    customRate.trim() !== '' && Number.isFinite(Number(customRate)) && Number(customRate) > 0
      ? Number(customRate)
      : defaultExchangeRate;

  const numAmount = Number(amount);
  const isValid = Number.isFinite(numAmount) && numAmount >= 0 && amount.trim() !== '';
  const converted = isValid ? roundNum(numAmount * activeRate, 2) : 0;

  const handleSwap = () => {
    setFromCode(toCurr.code);
    setToCode(fromCurr.code);
    setCustomRate('');
  };

  const summary = isValid
    ? `${formatNum(numAmount, 2)} ${fromCurr.code} = ${formatNum(converted, 2)} ${toCurr.code} (Rate: 1 ${fromCurr.code} = ${formatNum(activeRate, 4)} ${toCurr.code})`
    : '';

  const handleCalculate = () => {
    if (!isValid) return;
    onLogHistory(
      'currency-calc',
      'Currency Calculator',
      `${amount} ${fromCurr.code} to ${toCurr.code}`,
      summary
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Enter Currency & Amount
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Amount to Convert
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Custom Exchange Rate (Optional)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.0001"
              step="any"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              placeholder={`Default: ${defaultExchangeRate}`}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              From Currency
            </label>
            <select
              value={fromCurr.code}
              onChange={(e) => {
                setFromCode(e.target.value);
                setCustomRate('');
              }}
              className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-base font-medium"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              To Currency
            </label>
            <select
              value={toCurr.code}
              onChange={(e) => {
                setToCode(e.target.value);
                setCustomRate('');
              }}
              className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-base font-medium"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CalculatorActionBar
          calculateLabel="Convert Currency"
          onCalculate={handleCalculate}
          onReset={() => {
            setAmount('100');
            setFromCode('USD');
            setToCode('INR');
            setCustomRate('');
          }}
          resultText={summary}
        />
      </div>

      <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Converted Currency Result
        </h2>

        <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
          <div className="text-xs sm:text-sm text-slate-400">
            {isValid ? `${formatNum(numAmount, 2)} ${fromCurr.name}` : 'Enter a valid amount'}
          </div>
          <div className="text-4xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
            {isValid ? `${toCurr.symbol}${formatNum(converted, 2)} ${toCurr.code}` : '—'}
          </div>
          <div className="mt-3 text-xs text-slate-400 font-mono">
            1 {fromCurr.code} = {formatNum(activeRate, 4)} {toCurr.code}
          </div>
        </div>

        {isValid && (
          <HowWasThisCalculated
            steps={[
              {
                label: 'Exchange Rate Used',
                expression: `1 ${fromCurr.code} = ${formatNum(activeRate, 4)} ${toCurr.code}`,
              },
              {
                label: 'Converted Amount',
                expression: `${formatNum(numAmount, 2)} × ${formatNum(activeRate, 4)} = ${
                  toCurr.symbol
                }${formatNum(converted, 2)}`,
                highlight: true,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};
