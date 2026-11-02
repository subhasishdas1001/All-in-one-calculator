// Pure, mathematically validated calculation engine for SmartCalc

export interface NegativeMarkingInput {
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  marksPerCorrect: number;
  negativeMarksPerWrong: number;
}

export interface NegativeMarkingResult {
  correctMarks: number;
  negativeMarks: number;
  finalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  accuracyPercentage: number;
  attemptRatePercentage: number;
  wrongAnswerPercentage: number;
  unattemptedQuestions: number;
  effectiveNetQuestions: number;
}

export function roundNum(value: number, decimals = 4): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNum(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = roundNum(value, maxDecimals);
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

export function validateAndCalculateNegativeMarking(
  input: NegativeMarkingInput
): { error?: string; result?: NegativeMarkingResult } {
  const {
    totalQuestions,
    attemptedQuestions,
    correctAnswers,
    wrongAnswers,
    unattemptedQuestions,
    marksPerCorrect,
    negativeMarksPerWrong,
  } = input;

  if (
    !Number.isFinite(totalQuestions) ||
    !Number.isFinite(attemptedQuestions) ||
    !Number.isFinite(correctAnswers) ||
    !Number.isFinite(wrongAnswers) ||
    !Number.isFinite(unattemptedQuestions) ||
    !Number.isFinite(marksPerCorrect) ||
    !Number.isFinite(negativeMarksPerWrong)
  ) {
    return { error: 'Please enter valid numeric values for all fields.' };
  }

  if (totalQuestions <= 0) {
    return { error: 'Total Questions must be greater than 0.' };
  }

  if (
    totalQuestions < 0 ||
    attemptedQuestions < 0 ||
    correctAnswers < 0 ||
    wrongAnswers < 0 ||
    unattemptedQuestions < 0
  ) {
    return { error: 'Question counts cannot be negative.' };
  }

  if (
    !Number.isInteger(totalQuestions) ||
    !Number.isInteger(attemptedQuestions) ||
    !Number.isInteger(correctAnswers) ||
    !Number.isInteger(wrongAnswers) ||
    !Number.isInteger(unattemptedQuestions)
  ) {
    return { error: 'Question counts must be whole numbers (integers).' };
  }

  if (marksPerCorrect <= 0) {
    return { error: 'Marks per Correct Answer must be greater than 0.' };
  }

  if (negativeMarksPerWrong < 0) {
    return { error: 'Negative Marks per Wrong Answer cannot be negative (enter as a positive deduction value, e.g., 0.25).' };
  }

  if (correctAnswers + wrongAnswers !== attemptedQuestions) {
    return {
      error: `Attempted Questions (${attemptedQuestions}) must equal Correct Answers (${correctAnswers}) + Wrong Answers (${wrongAnswers}) = ${correctAnswers + wrongAnswers}.`,
    };
  }

  if (attemptedQuestions > totalQuestions) {
    return {
      error: `Attempted Questions (${attemptedQuestions}) cannot exceed Total Questions (${totalQuestions}).`,
    };
  }

  if (correctAnswers + wrongAnswers + unattemptedQuestions !== totalQuestions) {
    return {
      error: `Correct (${correctAnswers}) + Wrong (${wrongAnswers}) + Unattempted (${unattemptedQuestions}) = ${
        correctAnswers + wrongAnswers + unattemptedQuestions
      }, which must equal Total Questions (${totalQuestions}).`,
    };
  }

  const correctMarks = roundNum(correctAnswers * marksPerCorrect, 4);
  const negativeMarks = roundNum(wrongAnswers * negativeMarksPerWrong, 4);
  const finalScore = roundNum(correctMarks - negativeMarks, 4);
  const maxPossibleScore = roundNum(totalQuestions * marksPerCorrect, 4);

  const scorePercentage =
    maxPossibleScore > 0 ? roundNum((finalScore / maxPossibleScore) * 100, 2) : 0;
  const accuracyPercentage =
    attemptedQuestions > 0 ? roundNum((correctAnswers / attemptedQuestions) * 100, 2) : 0;
  const attemptRatePercentage =
    totalQuestions > 0 ? roundNum((attemptedQuestions / totalQuestions) * 100, 2) : 0;
  const wrongAnswerPercentage =
    attemptedQuestions > 0 ? roundNum((wrongAnswers / attemptedQuestions) * 100, 2) : 0;

  return {
    result: {
      correctMarks,
      negativeMarks,
      finalScore,
      maxPossibleScore,
      scorePercentage,
      accuracyPercentage,
      attemptRatePercentage,
      wrongAnswerPercentage,
      unattemptedQuestions,
      effectiveNetQuestions: roundNum(finalScore / marksPerCorrect, 2),
    },
  };
}

// Greatest Common Divisor for Fraction Calculator
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Safe Scientific Expression Evaluator
export function evaluateScientificExpression(
  expr: string,
  angleMode: 'DEG' | 'RAD' = 'DEG'
): { result?: number; error?: string } {
  const cleaned = expr.trim();
  if (!cleaned) return { error: 'Enter an expression to calculate.' };

  try {
    // Handle factorials e.g. 5! or (3+2)!
    const factorialHelper = (n: number): number => {
      if (n < 0 || !Number.isInteger(n)) {
        throw new Error('Factorial requires a non-negative integer.');
      }
      if (n > 170) {
        throw new Error('Value too large (overflow).');
      }
      let res = 1;
      for (let i = 2; i <= n; i++) res *= i;
      return res;
    };

    const toRad = (x: number) => (angleMode === 'DEG' ? (x * Math.PI) / 180 : x);
    const fromRad = (x: number) => (angleMode === 'DEG' ? (x * 180) / Math.PI : x);

    const scope: Record<string, unknown> = {
      SIN: (x: number) => Math.sin(toRad(x)),
      COS: (x: number) => {
        if (angleMode === 'DEG' && Math.abs(x % 180) === 90) return 0;
        return Math.cos(toRad(x));
      },
      TAN: (x: number) => {
        if (angleMode === 'DEG' && Math.abs(x % 180) === 90) {
          throw new Error('tan(90°) is undefined.');
        }
        return Math.tan(toRad(x));
      },
      ASIN: (x: number) => {
        if (x < -1 || x > 1) throw new Error('sin⁻¹ input must be between -1 and 1.');
        return fromRad(Math.asin(x));
      },
      ACOS: (x: number) => {
        if (x < -1 || x > 1) throw new Error('cos⁻¹ input must be between -1 and 1.');
        return fromRad(Math.acos(x));
      },
      ATAN: (x: number) => fromRad(Math.atan(x)),
      LOG: (x: number) => {
        if (x <= 0) throw new Error('log(x) requires x > 0.');
        return Math.log10(x);
      },
      LN: (x: number) => {
        if (x <= 0) throw new Error('ln(x) requires x > 0.');
        return Math.log(x);
      },
      SQRT: (x: number) => {
        if (x < 0) throw new Error('Cannot take square root of a negative number.');
        return Math.sqrt(x);
      },
      FACT: factorialHelper,
      PI: Math.PI,
      E: Math.E,
    };

    let transformed = cleaned
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, '(PI)')
      .replace(/sin⁻¹\(/g, 'ASIN(')
      .replace(/cos⁻¹\(/g, 'ACOS(')
      .replace(/tan⁻¹\(/g, 'ATAN(')
      .replace(/asin\(/gi, 'ASIN(')
      .replace(/acos\(/gi, 'ACOS(')
      .replace(/atan\(/gi, 'ATAN(')
      .replace(/sin\(/gi, 'SIN(')
      .replace(/cos\(/gi, 'COS(')
      .replace(/tan\(/gi, 'TAN(')
      .replace(/log\(/gi, 'LOG(')
      .replace(/ln\(/gi, 'LN(')
      .replace(/√\(/g, 'SQRT(')
      .replace(/sqrt\(/gi, 'SQRT(')
      .replace(/\^/g, '**');

    // Replace e constant when standalone
    transformed = transformed.replace(/(?<![A-Za-z0-9_])e(?![A-Za-z0-9_])/g, '(E)');

    // Replace percentage: e.g. 50% -> (50/100)
    transformed = transformed.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

    // Replace factorials: number! or (expr)!
    while (/(\d+|\([^()]+\))!/.test(transformed)) {
      transformed = transformed.replace(/(\d+|\([^()]+\))!/g, 'FACT($1)');
    }

    // Balance any unclosed opening parentheses
    const openCount = (transformed.match(/\(/g) || []).length;
    const closeCount = (transformed.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      transformed += ')'.repeat(openCount - closeCount);
    }

    // Security check: only allow known tokens
    const stripped = transformed.replace(
      /\b(SIN|COS|TAN|ASIN|ACOS|ATAN|LOG|LN|SQRT|FACT|PI|E)\b/g,
      ''
    );
    if (/[^0-9+\-*/().\s,]/.test(stripped)) {
      return { error: 'Invalid characters in expression.' };
    }

    const keys = Object.keys(scope);
    const values = keys.map((k) => scope[k]);
    const fn = new Function(...keys, `"use strict"; return (${transformed});`);
    const rawResult = fn(...values);

    if (typeof rawResult !== 'number' || Number.isNaN(rawResult)) {
      return { error: 'Result is undefined (NaN).' };
    }
    if (!Number.isFinite(rawResult)) {
      return { error: 'Cannot divide by zero or value exceeds numeric limit.' };
    }

    return { result: roundNum(rawResult, 10) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid mathematical expression.';
    return { error: message };
  }
}
