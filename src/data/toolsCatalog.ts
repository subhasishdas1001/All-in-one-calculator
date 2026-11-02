import { CalculatorMeta, EducationalTopic } from '../types/calculator';

export const CALCULATOR_TOOLS: CalculatorMeta[] = [
  // ==========================================================================
  // PRIORITY 1 — CORE MVP (5 Mandatory Core Calculators)
  // ==========================================================================
  {
    id: 'negative-marking',
    slug: '/negative-marking-calculator',
    name: 'Negative Marking Calculator',
    shortName: 'Negative Marking',
    seoTitle: 'Negative Marking Calculator – Calculate Exam Score Online',
    seoDescription:
      'Free online negative marking calculator for competitive exams. Calculate net exam score, 1/4, 1/3, and 1/2 penalty marks, accuracy percentage, and attempt rate.',
    priority: 1,
    priorityLabel: 'Priority 1 · Core MVP',
    category: 'exam-student',
    categoryLabel: 'Competitive Exams',
    isStudentTool: true,
    isFeatured: true,
    description:
      'Calculate net exam score, penalty deductions, accuracy rate, and attempt percentage with 1/4, 1/3, 1/2, or custom negative marking.',
    longExplanation:
      'The Negative Marking Calculator helps students and competitive exam aspirants calculate their exact net score after deducting penalty marks for wrong answers. Whether your test uses 1/4 (0.25), 1/3 (0.33), 1/2 (0.50), or a custom "+4 / −1" marking scheme, this tool computes your positive marks, negative deductions, final score percentage, and attempt accuracy in real time.',
    formulaSummary: 'Final Score = (Correct × Marks per Q) − (Wrong × Negative Penalty)',
    howToSteps: [
      'Enter the total number of questions in the examination.',
      'Enter your correct answers and wrong answers (attempted & unattempted counts sync automatically, or can be verified manually).',
      'Set the marks awarded for each correct answer (e.g., 1, 2, or 4).',
      'Select a negative marking preset (1/4, 1/3, 1/2, None) or enter a custom penalty per wrong answer.',
      'Click Calculate (or press Enter) to view your Final Score, Accuracy %, Attempt Rate %, and penalty breakdown.',
    ],
    example: {
      scenario: 'Competitive exam with 100 questions and 1/4 (0.25) negative marking',
      inputs: 'Total: 100 · Attempted: 80 · Correct: 60 · Wrong: 20 · Marks/Q: 1 · Penalty: 0.25',
      output: 'Correct Marks = 60 · Negative Marks = 5 · Final Score = 55 / 100 (55%) · Accuracy = 75%',
    },
    faqs: [
      {
        question: 'How do you calculate marks with 1/4 negative marking?',
        answer:
          'In 1/4 negative marking, each wrong answer deducts 25% of the marks allotted to a correct answer. For a 1-mark question, multiply your correct answers by 1, multiply your wrong answers by 0.25, and subtract the negative marks from your correct marks.',
      },
      {
        question: 'What is 1/3 negative marking in exams?',
        answer:
          'In 1/3 negative marking, 3 incorrect responses cancel out the marks earned from 1 correct response. If each question carries 2 marks (such as UPSC Prelims GS Paper 1), each wrong answer deducts 2 ÷ 3 ≈ 0.6667 marks.',
      },
      {
        question: 'Do unattempted questions reduce my score in negative marking exams?',
        answer:
          'No. Unattempted (skipped) questions carry 0 positive marks and 0 negative penalty in standard competitive examinations.',
      },
      {
        question: 'How is exam accuracy percentage calculated?',
        answer:
          'Accuracy Percentage is calculated by dividing Correct Answers by Total Attempted Questions and multiplying by 100: Accuracy % = (Correct ÷ Attempted) × 100.',
      },
    ],
    relatedToolIds: ['exam-score', 'percentage-calc', 'cgpa-calc', 'attendance-calc'],
  },
  {
    id: 'normal-calc',
    slug: '/normal-calculator',
    name: 'Normal Calculator',
    shortName: 'Normal Calc',
    seoTitle: 'Online Calculator – Free Standard Arithmetic Calculator',
    seoDescription:
      'Fast and accurate free online calculator for everyday arithmetic. Perform addition, subtraction, multiplication, division, and percentages with calculation tape.',
    priority: 1,
    priorityLabel: 'Priority 1 · Core MVP',
    category: 'math-general',
    categoryLabel: 'Everyday Math',
    isStudentTool: false,
    isFeatured: true,
    description:
      'Fast standard arithmetic calculator with +, −, ×, ÷, percentage, decimal handling, keyboard support, and live calculation tape.',
    longExplanation:
      'The Normal Calculator provides a clean, responsive keypad with full desktop keyboard support and a live session calculation tape. Ideal for quick homework arithmetic, bill totals, and everyday calculations without distractions.',
    formulaSummary: 'Standard Order of Operations (BODMAS / PEMDAS)',
    howToSteps: [
      'Tap numbers (0–9) or type directly on your keyboard.',
      'Choose an arithmetic operator (+, −, ×, ÷, %).',
      'Press = or Enter to evaluate and log the calculation to your history tape.',
      'Use AC to clear all or DEL (Backspace) to remove the last digit.',
    ],
    example: {
      scenario: 'Everyday bill split and multi-step arithmetic',
      inputs: '(450 × 3) ÷ 5',
      output: '270',
    },
    faqs: [
      {
        question: 'Does the online calculator follow BODMAS / PEMDAS order of operations?',
        answer:
          'Yes. Multiplication and division are evaluated before addition and subtraction, and expressions inside parentheses are evaluated first.',
      },
      {
        question: 'Can I use my computer keyboard with the calculator?',
        answer:
          'Yes. You can type numbers 0–9, +, -, *, /, %, parentheses, Enter (=) to calculate, Backspace to delete, and Escape to clear.',
      },
    ],
    relatedToolIds: ['scientific-calc', 'percentage-calc', 'fraction-calc', 'discount-calc'],
  },
  {
    id: 'scientific-calc',
    slug: '/scientific-calculator',
    name: 'Scientific Calculator',
    shortName: 'Scientific Calc',
    seoTitle: 'Scientific Calculator Online – Free Advanced Calculator',
    seoDescription:
      'Free online scientific calculator with DEG/RAD modes, trigonometry (sin, cos, tan), inverse trig, logarithms (log, ln), exponents, square roots, and factorials.',
    priority: 1,
    priorityLabel: 'Priority 1 · Core MVP',
    category: 'math-general',
    categoryLabel: 'STEM & Engineering',
    isStudentTool: true,
    isFeatured: true,
    description:
      'Full trigonometry (sin, cos, tan & inverses), logarithms (log, ln), exponents, roots, factorials, constants (π, e), and DEG/RAD toggle.',
    longExplanation:
      'Designed for high school, engineering, and science students, the Scientific Calculator evaluates complex trigonometric, logarithmic, exponential, and factorial expressions in either Degrees (DEG) or Radians (RAD) mode.',
    formulaSummary: 'Trigonometric, Logarithmic, Exponential & Factorial Functions',
    howToSteps: [
      'Select DEG (Degrees) or RAD (Radians) angle mode before evaluating trigonometric functions.',
      'Build expressions using scientific buttons (sin, cos, tan, log, ln, √, x², xʸ, n!) and parentheses.',
      'Press = or Enter to compute the exact result and record it in history.',
    ],
    example: {
      scenario: 'Trigonometric & logarithmic identity evaluation in Degrees',
      inputs: 'sin(30) + log(100) + 5!',
      output: '0.5 + 2 + 120 = 122.5',
    },
    faqs: [
      {
        question: 'What is the difference between DEG and RAD mode on a scientific calculator?',
        answer:
          'DEG mode interprets angle inputs in Degrees (where a full circle is 360°), while RAD mode interprets angles in Radians (where a full circle is 2π radians). Always check whether your math or physics problem specifies degrees or radians.',
      },
      {
        question: 'What is the difference between log and ln?',
        answer:
          'log calculates the common logarithm with base 10 (log₁₀), whereas ln calculates the natural logarithm with base e (≈ 2.71828).',
      },
    ],
    relatedToolIds: ['normal-calc', 'percentage-calc', 'unit-converter', 'fraction-calc'],
  },
  {
    id: 'percentage-calc',
    slug: '/percentage-calculator',
    name: 'Percentage Calculator',
    shortName: 'Percentage',
    seoTitle: 'Percentage Calculator – Calculate Percentage Online',
    seoDescription:
      'Free online percentage calculator to find X% of Y, what percentage X is of Y, percentage increase, percentage decrease, and percentage difference.',
    priority: 1,
    priorityLabel: 'Priority 1 · Core MVP',
    category: 'math-general',
    categoryLabel: 'Everyday Math',
    isStudentTool: true,
    isFeatured: true,
    description:
      'Solve all 5 percentage problems: X% of Y, X is what % of Y, % increase, % decrease, and percentage difference.',
    longExplanation:
      'Whether you are calculating exam marks percentage, salary increments, price discounts, or data growth rates, the Percentage Calculator covers all five fundamental percentage formulas with step-by-step working.',
    formulaSummary: '(Part ÷ Whole) × 100 · ((New − Old) ÷ |Old|) × 100',
    howToSteps: [
      'Choose one of the 5 percentage modes at the top of the tool.',
      'Enter the two numbers (X and Y, or Initial and Final values).',
      'Click Calculate to see the exact result and the underlying step-by-step mathematical formula.',
    ],
    example: {
      scenario: 'Find exam marks percentage from raw score',
      inputs: '432 is what % of 500?',
      output: '86.4%',
    },
    faqs: [
      {
        question: 'How do I calculate percentage of marks in an exam?',
        answer:
          'Divide your marks obtained by the total maximum marks and multiply by 100. For example, if you scored 432 out of 500: (432 ÷ 500) × 100 = 86.4%.',
      },
      {
        question: 'How do you calculate percentage increase between two numbers?',
        answer:
          'Subtract the initial value from the final value, divide by the absolute initial value, and multiply by 100: ((Final − Initial) ÷ |Initial|) × 100.',
      },
    ],
    relatedToolIds: ['negative-marking', 'discount-calc', 'gst-calc', 'cgpa-calc'],
  },
  {
    id: 'exam-score',
    slug: '/exam-score-calculator',
    name: 'Exam Score Calculator',
    shortName: 'Exam Score',
    seoTitle: 'Exam Score Calculator – Multi-Section Marks & Percentage Calculator',
    seoDescription:
      'Calculate total exam marks, section-wise scores (Section A, B, C), negative marking deductions, and overall percentage online.',
    priority: 1,
    priorityLabel: 'Priority 1 · Core MVP',
    category: 'exam-student',
    categoryLabel: 'Competitive Exams',
    isStudentTool: true,
    isFeatured: true,
    description:
      'Multi-section exam score analyzer (Section A, B, C...) with section-wise breakdown, negative marking, and overall percentage.',
    longExplanation:
      'Many competitive exams (SSC, Banking, JEE, CAT, GATE) feature multiple sections with different question counts or marking weights. The Exam Score Calculator lets you configure each section independently and computes both sectional performance and aggregate percentage.',
    formulaSummary: 'Total Score = ∑ (Section Correct Marks − Section Negative Marks)',
    howToSteps: [
      'Use Single Exam mode or add multiple sections (e.g., Section A: Quant, Section B: Reasoning, Section C: English).',
      'For each section, enter Total Questions, Correct Answers, Wrong Answers, Marks per Question, and Negative Penalty.',
      'Ensure Correct + Wrong does not exceed Total Questions in any section.',
      'Click Calculate to view section-wise scores, net aggregate marks, and overall percentage.',
    ],
    example: {
      scenario: '3-Section Test (Section A: 35 Qs, Section B: 35 Qs, Section C: 30 Qs)',
      inputs: 'Sec A: 26C/4W · Sec B: 28C/3W · Sec C: 21C/5W (+2 marks, -0.5 penalty)',
      output: 'Sec A: 50 · Sec B: 54.5 · Sec C: 39.5 · Total: 144 / 200 (72%)',
    },
    faqs: [
      {
        question: 'Can I set different marks per question for different sections?',
        answer:
          'Yes. Each section row has its own Marks per Question and Negative Penalty field, allowing you to model exams where Section A carries +2 marks and Section B carries +4 marks.',
      },
      {
        question: 'How is overall exam percentage calculated across sections?',
        answer:
          'Overall Percentage is calculated by dividing your sum of net sectional scores by the sum of maximum possible marks across all sections, multiplied by 100.',
      },
    ],
    relatedToolIds: ['negative-marking', 'percentage-calc', 'cgpa-calc', 'study-time-calc'],
  },

  // ==========================================================================
  // PRIORITY 2 — STUDENT TOOLS
  // ==========================================================================
  {
    id: 'cgpa-calc',
    slug: '/cgpa-calculator',
    name: 'CGPA Calculator',
    shortName: 'CGPA Calc',
    seoTitle: 'CGPA Calculator Online – Convert SGPA to CGPA & Percentage',
    seoDescription:
      'Free online CGPA calculator for university and CBSE students. Calculate credit-weighted CGPA across semesters and convert CGPA to percentage (×9.5 or ×10).',
    priority: 2,
    priorityLabel: 'Priority 2 · Student Tools',
    category: 'exam-student',
    categoryLabel: 'Student Tools',
    isStudentTool: true,
    description:
      'Calculate cumulative grade point average across multiple semesters with credit weights and CBSE/University percentage conversion.',
    longExplanation:
      'The CGPA Calculator computes your credit-weighted Cumulative Grade Point Average across all completed semesters and converts your CGPA into an equivalent percentage using standard CBSE/UGC (×9.5) or ×10 scales.',
    formulaSummary: 'CGPA = ∑(Semester SGPA × Semester Credits) ÷ ∑(Credits)',
    howToSteps: [
      'Enter each semester’s SGPA and total credits for that semester (add or remove semesters as needed).',
      'Choose your university percentage multiplier (e.g. × 9.5 for CBSE/UGC standard, or × 10).',
      'Click Calculate to get your weighted CGPA, total credits completed, and equivalent Percentage.',
    ],
    example: {
      scenario: '4 Semesters with credits 20, 22, 22, 24 and SGPAs 8.2, 8.5, 8.8, 9.1',
      inputs: 'Weighted across 88 total credits (× 9.5 scale)',
      output: 'CGPA: 8.67 · Equivalent Percentage: 82.37%',
    },
    faqs: [
      {
        question: 'How do you convert CGPA to percentage?',
        answer:
          'Under the standard CBSE and UGC 10-point grading system, multiply your CGPA by 9.5 to obtain the equivalent percentage (e.g., 8.5 CGPA × 9.5 = 80.75%). Some universities use a direct ×10 multiplier.',
      },
      {
        question: 'Is CGPA a simple average of all semester SGPAs?',
        answer:
          'Only if every semester has the exact same number of credits. Otherwise, CGPA is a credit-weighted average where semesters with more credits carry higher weight.',
      },
    ],
    relatedToolIds: ['gpa-calc', 'percentage-calc', 'attendance-calc', 'exam-score'],
  },
  {
    id: 'gpa-calc',
    slug: '/gpa-calculator',
    name: 'GPA Calculator',
    shortName: 'GPA Calc',
    seoTitle: 'GPA Calculator Online – 10-Point & 4.0 Scale Semester GPA',
    seoDescription:
      'Calculate your semester GPA online using course credits and grade points. Supports both 10-point SGPA and 4.0 US/International GPA scales.',
    priority: 2,
    priorityLabel: 'Priority 2 · Student Tools',
    category: 'exam-student',
    categoryLabel: 'Student Tools',
    isStudentTool: true,
    description:
      'Compute single-semester GPA by entering subject names, credit hours, and grades (supports both 10-Point and 4.0-Point scales).',
    longExplanation:
      'Enter your semester courses, credit hours, and earned grade points to calculate your exact Semester Grade Point Average (SGPA / GPA) on either a 10-point or 4.0-point academic scale.',
    formulaSummary: 'GPA = ∑(Course Credits × Grade Points) ÷ ∑(Course Credits)',
    howToSteps: [
      'Select either the 10-Point Scale or 4.0-Point Scale.',
      'Add your subjects, enter the Credit Hours for each subject, and input the Grade Points.',
      'Click Calculate to get your semester GPA and total credit points.',
    ],
    example: {
      scenario: '4 courses with 4, 4, 3, 3 credits on a 10-point scale',
      inputs: 'Grades: 9, 10, 8, 9 across 14 credits',
      output: 'Semester GPA: 9.07 / 10.0',
    },
    faqs: [
      {
        question: 'How do course credits affect my semester GPA?',
        answer:
          'Each course grade is multiplied by its credit hours. A 4-credit core subject has twice the impact on your semester GPA compared to a 2-credit elective.',
      },
    ],
    relatedToolIds: ['cgpa-calc', 'percentage-calc', 'attendance-calc', 'study-time-calc'],
  },
  {
    id: 'attendance-calc',
    slug: '/attendance-calculator',
    name: 'Attendance Calculator',
    shortName: 'Attendance',
    seoTitle: 'Attendance Calculator – 75% Attendance Percentage Calculator',
    seoDescription:
      'Free college attendance percentage calculator. Find your current attendance %, how many classes you must attend for 75% or 85%, or how many you can miss.',
    priority: 2,
    priorityLabel: 'Priority 2 · Student Tools',
    category: 'exam-student',
    categoryLabel: 'Student Tools',
    isStudentTool: true,
    description:
      'Find your current attendance %, how many classes you must attend consecutively to hit 75%/85%, or how many classes you can safely miss.',
    longExplanation:
      'Most universities and colleges mandate a minimum 75% or 80% attendance criterion to appear in semester examinations. The Attendance Calculator tells you your exact current percentage and how many consecutive lectures you need to attend—or can safely skip.',
    formulaSummary: 'Current % = (Attended ÷ Total) × 100',
    howToSteps: [
      'Enter Total Classes conducted so far.',
      'Enter Classes Attended so far (cannot exceed Total Classes).',
      'Select or enter your college/school Required Attendance % (e.g. 75%, 80%, 85%).',
      'Click Calculate to see how many consecutive classes you need to attend or how many upcoming classes you can safely miss.',
    ],
    example: {
      scenario: 'Student with 42 attended out of 60 classes needing 75% attendance',
      inputs: 'Total: 60 · Attended: 42 (70%) · Required: 75%',
      output: 'Attend next 12 classes consecutively to reach 54/72 (75.0%)',
    },
    faqs: [
      {
        question: 'How is required consecutive classes for 75% attendance calculated?',
        answer:
          'If you have attended A out of T classes and need a target ratio R (e.g., 0.75), the number of consecutive classes X satisfies (A + X) ÷ (T + X) ≥ R, which simplifies to X = ceil((R×T − A) ÷ (1 − R)).',
      },
    ],
    relatedToolIds: ['cgpa-calc', 'gpa-calc', 'study-time-calc', 'percentage-calc'],
  },
  {
    id: 'age-calc',
    slug: '/age-calculator',
    name: 'Age Calculator',
    shortName: 'Age Calc',
    seoTitle: 'Age Calculator Online – Calculate Exact Age in Years, Months & Days',
    seoDescription:
      'Calculate your exact chronological age in years, months, days, weeks, and hours from your date of birth or check exam age eligibility as of any cutoff date.',
    priority: 2,
    priorityLabel: 'Priority 2 · Student Tools',
    category: 'converters-date',
    categoryLabel: 'Date & Time',
    isStudentTool: true,
    description:
      'Verify exact chronological age in Years, Months, and Days as of any exam eligibility cutoff date or today.',
    longExplanation:
      'Competitive examination notifications specify an exact cutoff date (such as August 1 or January 1) for minimum and maximum age eligibility. The Age Calculator determines your exact chronological age in years, months, and days on any target date.',
    formulaSummary: 'Calendar Delta (Years, Months, Days) + Total Elapsed Days',
    howToSteps: [
      'Select your Date of Birth.',
      'Select the Target / Cutoff Date (defaults to today; ideal for checking competitive exam age eligibility).',
      'Click Calculate to see your exact age in Years, Months, and Days, plus Total Days, Weeks, Hours, and days until your next birthday.',
    ],
    example: {
      scenario: 'Checking age on an exam cutoff date',
      inputs: 'DOB: 2004-05-15 · Target Date: 2026-08-01',
      output: '22 Years, 2 Months, 17 Days (8,113 Total Days)',
    },
    faqs: [
      {
        question: 'Does the age calculator account for leap years?',
        answer:
          'Yes. The calendar arithmetic accounts for exact month lengths (28, 29, 30, or 31 days) and leap years between your date of birth and the target date.',
      },
    ],
    relatedToolIds: ['date-calc', 'negative-marking', 'study-time-calc', 'exam-score'],
  },
  {
    id: 'date-calc',
    slug: '/date-calculator',
    name: 'Date Calculator',
    shortName: 'Date Calc',
    seoTitle: 'Date Calculator – Days Between Two Dates & Add/Subtract Days',
    seoDescription:
      'Free online date calculator to count exact days and weeks between two calendar dates or add and subtract days, weeks, and months from a date.',
    priority: 2,
    priorityLabel: 'Priority 2 · Student Tools',
    category: 'converters-date',
    categoryLabel: 'Date & Time',
    isStudentTool: true,
    description:
      'Find exact days, weeks, and working days between two dates, or add/subtract days, weeks, and months from a date.',
    longExplanation:
      'Count the exact number of preparation days remaining until your exam date, project submission deadline, or loan maturity, or add/subtract calendar days, weeks, and months from any starting date.',
    formulaSummary: 'Calendar Duration & Date Offset Arithmetic',
    howToSteps: [
      'Choose "Days Between Two Dates" or "Add / Subtract Days".',
      'For Days Between: pick Start Date and End Date to see total days and weeks + days.',
      'For Add/Subtract: pick a Start Date, choose Add or Subtract, and enter Days, Weeks, or Months.',
    ],
    example: {
      scenario: 'Counting study days left until exam day',
      inputs: 'From 2026-11-01 to 2027-02-14',
      output: '105 Days (15 Weeks, 0 Days)',
    },
    faqs: [
      {
        question: 'How can I find what date is 45 days from today?',
        answer:
          'Switch to the "Add / Subtract Days from Date" tab, select your starting date, choose Add (+), enter 45 in the Days field, and click Calculate.',
      },
    ],
    relatedToolIds: ['age-calc', 'study-time-calc', 'attendance-calc', 'emi-calc'],
  },
  {
    id: 'study-time-calc',
    slug: '/study-time-calculator',
    name: 'Study Time Calculator',
    shortName: 'Study Planner',
    seoTitle: 'Study Time Calculator – Exam Syllabus & Daily Pomodoro Planner',
    seoDescription:
      'Plan your exam preparation schedule by calculating required daily study hours, chapters per day, and Pomodoro sessions before your exam date.',
    priority: 2,
    priorityLabel: 'Priority 2 · Student Tools',
    category: 'exam-student',
    categoryLabel: 'Student Tools',
    isStudentTool: true,
    description:
      'Plan exam preparation by allocating syllabus chapters/topics across remaining days, daily study hours, and revision buffer.',
    longExplanation:
      'Break down a large exam syllabus into realistic daily study targets. Enter your total chapters, average hours per chapter, days left until the exam, and revision buffer days to see your required daily study pace and Pomodoro session count.',
    formulaSummary: 'Effective Study Hours = (Days − Buffer Days) × Daily Study Hours',
    howToSteps: [
      'Enter Total Chapters / Modules to cover and Average Hours needed per chapter.',
      'Enter Days Remaining until the exam and your Daily Study Hours.',
      'Set Revision Buffer Days and click Calculate to see required daily pace and Pomodoro sessions.',
    ],
    example: {
      scenario: '24 chapters (3 hrs each) with 30 days left and 3.5 hrs/day study time',
      inputs: '24 Chapters × 3h = 72h needed · 26 active study days',
      output: 'Required Pace: 2.77 hrs/day · 7 Pomodoros/day · On Track',
    },
    faqs: [
      {
        question: 'Why should I include revision buffer days in my study plan?',
        answer:
          'Reserving 4 to 7 buffer days before the exam ensures you have dedicated time for full-length mock tests and final formula revision even if you fall slightly behind on a busy day.',
      },
    ],
    relatedToolIds: ['date-calc', 'attendance-calc', 'negative-marking', 'exam-score'],
  },

  // ==========================================================================
  // PRIORITY 3 — FINANCE & UTILITY TOOLS
  // ==========================================================================
  {
    id: 'emi-calc',
    slug: '/emi-calculator',
    name: 'Loan / EMI Calculator',
    shortName: 'Loan / EMI',
    seoTitle: 'EMI Calculator Online – Education, Home & Personal Loan EMI',
    seoDescription:
      'Calculate monthly loan EMI, total interest payable, and total repayment amount online for education loans, home loans, and car loans.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'finance',
    categoryLabel: 'Finance & Banking',
    isStudentTool: false,
    description:
      'Calculate monthly EMI, total interest payable, and total repayment for education, home, or vehicle loans with monthly/yearly tenure.',
    longExplanation:
      'The Loan / EMI Calculator computes your Equated Monthly Installment (EMI), total interest cost, and principal-to-interest ratio for education loans, home mortgages, or personal loans using the standard reducing-balance amortization formula.',
    formulaSummary: 'EMI = [P × r × (1+r)ⁿ] ÷ [(1+r)ⁿ − 1]',
    howToSteps: [
      'Enter the Principal Loan Amount.',
      'Enter the Annual Interest Rate (% per annum).',
      'Enter the Loan Tenure and choose whether it is in Years or Months.',
      'Click Calculate to see your Monthly EMI, Total Interest, Total Payment, and principal-to-interest breakdown.',
    ],
    example: {
      scenario: 'Education loan of 500,000 at 8.5% interest for 5 years',
      inputs: 'Principal: 500,000 · Rate: 8.5% p.a. · Tenure: 5 Years (60 Months)',
      output: 'Monthly EMI: 10,258.27 · Total Interest: 115,495.97 · Total Payment: 615,495.97',
    },
    faqs: [
      {
        question: 'How is monthly loan EMI calculated?',
        answer:
          'EMI is calculated using the formula EMI = [P × r × (1+r)ⁿ] ÷ [(1+r)ⁿ − 1], where P is the principal loan amount, r is the monthly interest rate (Annual Rate ÷ 12 ÷ 100), and n is the loan tenure in months.',
      },
      {
        question: 'Does a longer loan tenure reduce my EMI?',
        answer:
          'A longer tenure reduces your monthly EMI payment, but it increases the total interest paid over the life of the loan.',
      },
    ],
    relatedToolIds: ['gst-calc', 'discount-calc', 'currency-calc', 'percentage-calc'],
  },
  {
    id: 'gst-calc',
    slug: '/gst-calculator',
    name: 'GST Calculator',
    shortName: 'GST Calc',
    seoTitle: 'GST Calculator Online – Add or Remove 5%, 12%, 18%, 28% GST',
    seoDescription:
      'Free online GST calculator to add or remove Goods and Services Tax (5%, 12%, 18%, 28%, or custom rates) with automatic CGST and SGST split.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'finance',
    categoryLabel: 'Finance & Tax',
    isStudentTool: false,
    description:
      'Add or remove GST quickly using 5%, 12%, 18%, 28%, or custom tax slabs with automatic CGST & SGST 50/50 split.',
    longExplanation:
      'Easily calculate GST-inclusive and GST-exclusive prices using standard tax slabs (5%, 12%, 18%, 28%) or any custom tax rate, complete with a 50/50 Central GST (CGST) and State GST (SGST) breakdown.',
    formulaSummary: 'Add GST: Base × (1 + Rate/100) · Remove GST: Inclusive ÷ (1 + Rate/100)',
    howToSteps: [
      'Enter the Amount.',
      'Select whether to Add GST (Exclusive to Inclusive) or Remove GST (Inclusive to Exclusive).',
      'Pick a standard slab (5%, 12%, 18%, 28%) or enter a custom GST percentage.',
      'Click Calculate to view Net Amount, GST Amount (with CGST + SGST split), and Gross Total.',
    ],
    example: {
      scenario: 'Adding 18% GST to a laptop priced at 45,000',
      inputs: 'Amount: 45,000 · Rate: 18% · Mode: Add GST',
      output: 'Net: 45,000 · GST: 8,100 (CGST 4,050 + SGST 4,050) · Total: 53,100',
    },
    faqs: [
      {
        question: 'How do I remove 18% GST from a GST-inclusive price?',
        answer:
          'Divide the GST-inclusive amount by 1.18 to get the pre-tax net price. For example, 1,180 ÷ 1.18 = 1,000 net amount and 180 GST.',
      },
    ],
    relatedToolIds: ['discount-calc', 'emi-calc', 'percentage-calc', 'normal-calc'],
  },
  {
    id: 'discount-calc',
    slug: '/discount-calculator',
    name: 'Discount Calculator',
    shortName: 'Discount',
    seoTitle: 'Discount Calculator Online – Calculate Sale Price & Savings',
    seoDescription:
      'Calculate final sale price, discount amount saved, and stacked coupon discounts online with our fast percentage off discount calculator.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'finance',
    categoryLabel: 'Finance & Shopping',
    isStudentTool: false,
    description:
      'Compute final sale price, exact amount saved, and optional extra promotional coupon discount.',
    longExplanation:
      'Find out exactly how much you save and what you pay after applying a store discount percentage and an optional additional promotional coupon.',
    formulaSummary: 'Final Price = Original Price − (Original Price × Discount % ÷ 100)',
    howToSteps: [
      'Enter the Original Price of the item.',
      'Enter the Discount Percentage (0% to 100%).',
      'Optionally enter an Additional Coupon Discount %.',
      'Click Calculate to see the Final Payable Price and Total Amount Saved.',
    ],
    example: {
      scenario: 'Textbook listed at 850 with a 20% student discount',
      inputs: 'Original Price: 850 · Discount: 20%',
      output: 'Amount Saved: 170 · Final Price: 680',
    },
    faqs: [
      {
        question: 'How do two stacked discounts (e.g., 20% + 10% off) work?',
        answer:
          'The first 20% discount is applied to the original price, and the additional 10% coupon is applied to the reduced price. On a 1,000 item, 20% off leaves 800, and 10% off 800 leaves 720 (an effective total discount of 28%).',
      },
    ],
    relatedToolIds: ['gst-calc', 'percentage-calc', 'emi-calc', 'currency-calc'],
  },
  {
    id: 'currency-calc',
    slug: '/currency-calculator',
    name: 'Currency Calculator',
    shortName: 'Currency',
    seoTitle: 'Currency Calculator – Convert USD, INR, EUR, GBP & Global Forex',
    seoDescription:
      'Convert between major global currencies including USD, INR, EUR, GBP, JPY, AUD, CAD, SGD, AED, and CHF with customizable exchange rates.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'finance',
    categoryLabel: 'Finance & Forex',
    isStudentTool: false,
    description:
      'Convert between major global currencies (USD, INR, EUR, GBP, JPY, AUD, CAD, SGD, AED, CHF) with customizable exchange rates.',
    longExplanation:
      'Planning international university tuition payments or travel budgets? Convert between 10 major global currencies using built-in reference rates or enter your bank’s exact custom exchange rate.',
    formulaSummary: 'Converted Amount = Source Amount × Exchange Rate',
    howToSteps: [
      'Enter the amount you wish to convert.',
      'Select the From Currency and To Currency.',
      'Use the reference exchange rate or enter your own custom bank/forex rate.',
      'Click Calculate to view the converted amount and multi-currency comparison table.',
    ],
    example: {
      scenario: 'Converting $1,000 USD tuition fee to INR',
      inputs: '1,000 USD to INR (at 1 USD = 84.00 INR)',
      output: '84,000.00 INR',
    },
    faqs: [
      {
        question: 'Can I enter my own custom bank exchange rate?',
        answer:
          'Yes. Use the "Custom Exchange Rate" field to override the default rate with the exact conversion rate quoted by your bank or card provider.',
      },
    ],
    relatedToolIds: ['emi-calc', 'gst-calc', 'discount-calc', 'unit-converter'],
  },
  {
    id: 'unit-converter',
    slug: '/unit-converter',
    name: 'Unit Converter (All-in-One)',
    shortName: 'Unit Converter',
    seoTitle: 'Unit Converter Online – Length, Weight, Temperature, Area & Speed',
    seoDescription:
      'Free all-in-one online unit converter for students and engineers. Convert length, weight, temperature, area, volume, time, speed, and digital data storage.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'converters-date',
    categoryLabel: 'Unit Converters',
    isStudentTool: false,
    description:
      'Instant conversion across 8 physical categories: Length, Weight, Temperature, Area, Volume, Time, Speed, and Data Storage.',
    longExplanation:
      'Convert between Metric (SI) and Imperial units across 8 scientific and everyday measurement categories with instant side-by-side reference tables.',
    formulaSummary: 'Exact SI & Imperial Conversion Factors',
    howToSteps: [
      'Select a measurement category (Length, Weight, Temperature, Area, Volume, Time, Speed, or Data Storage).',
      'Enter a numeric value and choose the From Unit and To Unit.',
      'View the converted value immediately along with a comparison table across all units in that category.',
    ],
    example: {
      scenario: 'Converting speed from km/h to m/s for a physics problem',
      inputs: '90 km/h to m/s',
      output: '25 m/s',
    },
    faqs: [
      {
        question: 'How do you convert km/h to m/s?',
        answer:
          'Divide the speed in kilometers per hour (km/h) by 3.6 (or multiply by 5/18) to get meters per second (m/s).',
      },
    ],
    relatedToolIds: ['length-converter', 'weight-converter', 'temperature-converter', 'scientific-calc'],
  },
  {
    id: 'length-converter',
    slug: '/length-converter',
    name: 'Length Converter',
    shortName: 'Length',
    seoTitle: 'Length Converter Online – Feet, Inches, CM, Meters & Miles',
    seoDescription:
      'Convert length and distance units online between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'converters-date',
    categoryLabel: 'Unit Converters',
    isStudentTool: false,
    description:
      'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.',
    longExplanation:
      'Quickly convert metric and imperial length measurements including millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.',
    formulaSummary: '1 inch = 2.54 cm · 1 mile = 1.609344 km · 1 foot = 0.3048 m',
    howToSteps: [
      'Enter the length value you want to convert.',
      'Select the source unit and target unit (e.g. Feet to Meters, Inches to Centimeters).',
      'Use the Swap button to reverse units or inspect the complete length conversion table below.',
    ],
    example: {
      scenario: 'Converting 70 inches to centimeters',
      inputs: '70 Inches to Centimeters',
      output: '177.8 cm (1.778 m)',
    },
    faqs: [
      {
        question: 'How many centimeters are in 1 inch and 1 foot?',
        answer: '1 inch equals exactly 2.54 centimeters, and 1 foot (12 inches) equals 30.48 centimeters.',
      },
    ],
    relatedToolIds: ['unit-converter', 'weight-converter', 'temperature-converter', 'speed-converter'],
  },
  {
    id: 'weight-converter',
    slug: '/weight-converter',
    name: 'Weight Converter',
    shortName: 'Weight',
    seoTitle: 'Weight Converter Online – Kilograms (kg), Pounds (lb), Grams & Ounces',
    seoDescription:
      'Convert weight and mass units online between milligrams, grams, kilograms (kg), metric tonnes, ounces (oz), pounds (lb), and stones.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'converters-date',
    categoryLabel: 'Unit Converters',
    isStudentTool: false,
    description:
      'Convert between milligrams, grams, kilograms, metric tonnes, ounces, pounds (lb), and stones.',
    longExplanation:
      'Convert mass and weight values accurately between kilograms, grams, milligrams, metric tonnes, pounds, ounces, and stones.',
    formulaSummary: '1 kg = 2.20462262 lb · 1 lb = 16 oz = 453.59237 g',
    howToSteps: [
      'Enter the mass/weight value.',
      'Choose the From and To weight units (e.g. Kilograms to Pounds).',
      'View the exact conversion and full weight reference table.',
    ],
    example: {
      scenario: 'Converting 68 kilograms to pounds',
      inputs: '68 kg to lb',
      output: '149.9143 lb',
    },
    faqs: [
      {
        question: 'How do I convert kilograms (kg) to pounds (lbs)?',
        answer: 'Multiply the weight in kilograms by 2.20462262 to get the equivalent weight in pounds.',
      },
    ],
    relatedToolIds: ['unit-converter', 'length-converter', 'temperature-converter', 'scientific-calc'],
  },
  {
    id: 'temperature-converter',
    slug: '/temperature-converter',
    name: 'Temperature Converter',
    shortName: 'Temperature',
    seoTitle: 'Temperature Converter – Celsius (°C), Fahrenheit (°F) & Kelvin (K)',
    seoDescription:
      'Convert temperature scales online between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with exact thermodynamic formulas.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'converters-date',
    categoryLabel: 'Unit Converters',
    isStudentTool: false,
    description:
      'Convert between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with live thermodynamic formulas.',
    longExplanation:
      'Convert temperatures for physics, chemistry, weather, and everyday use across Celsius, Fahrenheit, Kelvin, and Rankine scales.',
    formulaSummary: '°F = (°C × 9/5) + 32 · K = °C + 273.15',
    howToSteps: [
      'Enter any temperature value.',
      'Select the input scale (°C, °F, K, or °R) and target scale.',
      'See all four temperature scales side-by-side.',
    ],
    example: {
      scenario: 'Normal human body temperature conversion',
      inputs: '37 °C to °F and K',
      output: '98.6 °F · 310.15 K',
    },
    faqs: [
      {
        question: 'What is the formula to convert Celsius to Fahrenheit?',
        answer: 'Multiply the Celsius temperature by 9/5 (or 1.8) and add 32: °F = (°C × 1.8) + 32.',
      },
    ],
    relatedToolIds: ['unit-converter', 'scientific-calc', 'length-converter', 'weight-converter'],
  },
  {
    id: 'speed-converter',
    slug: '/speed-converter',
    name: 'Speed Converter',
    shortName: 'Speed',
    seoTitle: 'Speed Converter Online – km/h, m/s, mph & Knots',
    seoDescription:
      'Convert speed and velocity units online between kilometers per hour (km/h), meters per second (m/s), miles per hour (mph), and knots.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'converters-date',
    categoryLabel: 'Unit Converters',
    isStudentTool: false,
    description:
      'Convert between meters per second (m/s), kilometers per hour (km/h), miles per hour (mph), and knots (kn).',
    longExplanation:
      'Designed for physics kinematics problems and travel calculations, the Speed Converter converts effortlessly between m/s, km/h, mph, and knots.',
    formulaSummary: '1 m/s = 3.6 km/h · 1 mph = 1.609344 km/h',
    howToSteps: [
      'Enter the speed or velocity value.',
      'Choose the source unit (e.g. km/h) and target unit (e.g. m/s).',
      'Inspect all speed equivalents in the side table.',
    ],
    example: {
      scenario: 'Converting highway speed 108 km/h to m/s',
      inputs: '108 km/h to m/s',
      output: '30 m/s',
    },
    faqs: [
      {
        question: 'How do I convert m/s to km/h?',
        answer: 'Multiply meters per second (m/s) by 3.6 (or 18/5) to convert to kilometers per hour (km/h).',
      },
    ],
    relatedToolIds: ['unit-converter', 'length-converter', 'scientific-calc', 'data-converter'],
  },
  {
    id: 'data-converter',
    slug: '/data-storage-converter',
    name: 'Data Storage Converter',
    shortName: 'Data Storage',
    seoTitle: 'Data Storage Converter – Bytes, KB, MB, GB & TB Calculator',
    seoDescription:
      'Convert digital data storage sizes online between Bytes (B), Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB).',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'converters-date',
    categoryLabel: 'Unit Converters',
    isStudentTool: false,
    description:
      'Convert digital file and memory sizes between Bytes (B), Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB).',
    longExplanation:
      'Essential for computer science students and IT professionals, the Data Storage Converter computes binary 1024-base equivalents across Bytes, KB, MB, GB, and TB.',
    formulaSummary: '1 KB = 1,024 Bytes · 1 GB = 1,024 MB (Binary IEC Standard)',
    howToSteps: [
      'Enter the digital storage value.',
      'Choose the From Unit (e.g. GB) and To Unit (e.g. MB).',
      'See exact binary 1024-base equivalents across all storage units.',
    ],
    example: {
      scenario: 'Converting 2.5 Gigabytes to Megabytes',
      inputs: '2.5 GB to MB',
      output: '2,560 MB',
    },
    faqs: [
      {
        question: 'How many Megabytes (MB) are in 1 Gigabyte (GB)?',
        answer: 'In binary computer memory addressing, 1 Gigabyte (GB) equals 1,024 Megabytes (MB).',
      },
    ],
    relatedToolIds: ['unit-converter', 'scientific-calc', 'speed-converter', 'percentage-calc'],
  },
  {
    id: 'fraction-calc',
    slug: '/fraction-calculator',
    name: 'Fraction Calculator',
    shortName: 'Fractions',
    seoTitle: 'Fraction Calculator Online – Add, Subtract, Multiply, Divide & Simplify',
    seoDescription:
      'Free online fraction calculator to add, subtract, multiply, divide, and simplify fractions into lowest terms, mixed numbers, and decimals.',
    priority: 3,
    priorityLabel: 'Priority 3 · Finance & Utility',
    category: 'math-general',
    categoryLabel: 'Everyday Math',
    isStudentTool: false,
    description:
      'Add, subtract, multiply, divide, and simplify fractions with automatic Greatest Common Divisor (GCD) reduction and mixed number output.',
    longExplanation:
      'Perform fraction arithmetic and automatically reduce improper fractions to their simplest form using Greatest Common Divisor (GCD) division, along with mixed-number and decimal conversions.',
    formulaSummary: 'a/b ± c/d = (ad ± bc) / bd',
    howToSteps: [
      'Enter the numerator and denominator for Fraction 1 and Fraction 2 (denominators cannot be zero).',
      'Select the operation (+, −, ×, ÷).',
      'Click Calculate to see the simplified fraction, mixed number, decimal equivalent, and GCD reduction steps.',
    ],
    example: {
      scenario: 'Adding two fractions with different denominators',
      inputs: '3/4 + 5/6',
      output: '19/12 = 1 7/12 ≈ 1.5833',
    },
    faqs: [
      {
        question: 'How do you simplify a fraction to lowest terms?',
        answer:
          'Divide both the numerator and the denominator by their Greatest Common Divisor (GCD). For example, in 18/24, the GCD is 6, giving 3/4.',
      },
    ],
    relatedToolIds: ['percentage-calc', 'normal-calc', 'scientific-calc', 'negative-marking'],
  },
];

export const EDUCATIONAL_TOPICS: EducationalTopic[] = [
  {
    id: 'what-is-negative-marking',
    title: 'What is Negative Marking & How It Affects Your Score',
    category: 'Competitive Exams',
    summary:
      'Negative marking is a penalty system used in competitive exams where marks are deducted for every incorrect answer to discourage random guessing.',
    formula:
      'Final Score = (Correct Answers × Marks per Question) − (Wrong Answers × Penalty per Wrong Answer)',
    details: [
      'In a 1/4 negative marking scheme (0.25 penalty on a 1-mark question), 4 wrong answers cancel out the marks earned from 1 correct answer.',
      'In a 1/3 negative marking scheme (common in UPSC, GATE, and JEE sections), 3 wrong answers erase 1 full correct answer’s reward.',
      'In a 1/2 negative marking scheme, just 2 wrong answers wipe out 1 correct response.',
      'Unattempted (skipped) questions typically carry 0 marks and 0 penalty, preserving your earned score.',
    ],
    studentTip:
      'If you can eliminate 2 out of 4 options in a 1/4 negative marking exam, the mathematical expected value of an educated guess is positive (+0.375 marks per question on average).',
    relatedToolId: 'negative-marking',
  },
  {
    id: 'what-is-accuracy',
    title: 'What is Exam Accuracy vs. Attempt Rate?',
    category: 'Competitive Exams',
    summary:
      'Accuracy measures the percentage of your attempted questions that were answered correctly, whereas Attempt Rate measures how much of the paper you answered.',
    formula: 'Accuracy % = (Correct Answers ÷ Attempted Questions) × 100',
    details: [
      'Attempt Rate % = (Attempted Questions ÷ Total Questions) × 100.',
      'High attempt rate with low accuracy leads to heavy negative marking penalties.',
      'For example, attempting 90/100 questions with 60 correct and 30 wrong (66.7% accuracy) in a 1/3 penalty exam yields 60 − 10 = 50 marks.',
      'Attempting 70/100 questions with 60 correct and 10 wrong (85.7% accuracy) yields 60 − 3.33 = 56.67 marks — a 6.67-mark advantage with 20 fewer attempts!',
    ],
    studentTip:
      'Aim for at least 85%+ accuracy in mock tests before pushing to increase your total attempts.',
    relatedToolId: 'negative-marking',
  },
  {
    id: 'what-is-percentage',
    title: 'What is a Percentage?',
    category: 'Mathematics',
    summary:
      'A percentage represents a fraction or ratio expressed out of 100 ("per cent" means "per hundred").',
    formula: 'Percentage (%) = (Part ÷ Whole) × 100',
    details: [
      'To find X% of a number Y, multiply Y by (X ÷ 100).',
      'Percentage Change measures growth or reduction relative to the original starting value: ((New − Old) ÷ |Old|) × 100.',
      'Percentage Difference compares two independent values relative to their average: (|A − B| ÷ ((A + B)/2)) × 100.',
    ],
    studentTip:
      'Remember that percentages are reversible: 16% of 25 is the exact same as 25% of 16 (which is 1/4 of 16 = 4).',
    relatedToolId: 'percentage-calc',
  },
  {
    id: 'what-is-emi',
    title: 'What is EMI (Equated Monthly Installment)?',
    category: 'Finance',
    summary:
      'An Equated Monthly Installment (EMI) is a fixed monthly payment made by a borrower to a lender to pay off both principal and interest over a specified loan tenure.',
    formula: 'EMI = [P × r × (1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1]',
    details: [
      'P is the Principal loan amount borrowed.',
      'r is the monthly interest rate (Annual Rate ÷ 12 ÷ 100).',
      'n is the total number of monthly installments (Years × 12).',
      'In the early months of a loan, a larger share of the EMI goes toward interest; in later months, most of the EMI pays down the principal.',
    ],
    studentTip:
      'Even a 1% lower interest rate or prepaying 1 extra EMI per year on an education loan can reduce your total interest burden significantly.',
    relatedToolId: 'emi-calc',
  },
  {
    id: 'what-is-gst',
    title: 'What is GST (Goods and Services Tax)?',
    category: 'Finance',
    summary:
      'GST is a unified indirect tax levied on the supply of goods and services. Standard GST slabs include 5%, 12%, 18%, and 28%.',
    formula: 'GST Amount = (Original Cost × GST Rate) ÷ 100',
    details: [
      'Intra-state sales split GST equally into CGST (Central GST) and SGST (State GST). For example, 18% GST consists of 9% CGST + 9% SGST.',
      'To remove GST from a GST-inclusive bill, do NOT simply subtract 18% from the total. Instead, divide the inclusive price by (1 + Rate/100).',
    ],
    studentTip:
      'When reverse-calculating pre-tax price from ₹1,180 at 18% GST: ₹1,180 ÷ 1.18 = ₹1,000 base price (and ₹180 tax).',
    relatedToolId: 'gst-calc',
  },
  {
    id: 'what-is-cgpa-gpa',
    title: 'What are GPA and CGPA?',
    category: 'Academics',
    summary:
      'GPA (Grade Point Average) measures academic performance in a single semester, while CGPA (Cumulative Grade Point Average) is the credit-weighted average across all completed semesters.',
    formula: 'CGPA = ∑(Course Credits × Grade Points) ÷ Total Credits',
    details: [
      'A high-credit course (e.g., 4-credit Core Lab or Major paper) impacts your GPA twice as much as a 2-credit elective.',
      'In India (CBSE / UGC 10-point scale), the standard approximate percentage conversion is Percentage = CGPA × 9.5, though some universities use CGPA × 10 or (CGPA − 0.75) × 10.',
      'In the US/International 4.0 scale, an A grade equals 4.0 points, B equals 3.0, C equals 2.0, and D equals 1.0.',
    ],
    studentTip:
      'Prioritize scoring top grades in 4-credit and 5-credit subjects—they carry the heaviest weight in lifting your cumulative GPA.',
    relatedToolId: 'cgpa-calc',
  },
];
