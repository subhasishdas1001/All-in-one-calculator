export type ToolId =
  | 'negative-marking'
  | 'normal-calc'
  | 'scientific-calc'
  | 'percentage-calc'
  | 'exam-score'
  | 'cgpa-calc'
  | 'gpa-calc'
  | 'attendance-calc'
  | 'age-calc'
  | 'date-calc'
  | 'study-time-calc'
  | 'emi-calc'
  | 'gst-calc'
  | 'discount-calc'
  | 'currency-calc'
  | 'unit-converter'
  | 'length-converter'
  | 'weight-converter'
  | 'temperature-converter'
  | 'speed-converter'
  | 'data-converter'
  | 'fraction-calc';

export type ToolCategory = 'exam-student' | 'math-general' | 'finance' | 'converters-date';

export type PriorityTier = 1 | 2 | 3;

export type NavTab =
  | 'home'
  | 'calculators'
  | 'students'
  | 'finance'
  | 'converters'
  | 'history'
  | 'learn'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'disclaimer';

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorMeta {
  id: ToolId;
  slug: string;
  name: string;
  shortName: string;
  seoTitle: string;
  seoDescription: string;
  priority: PriorityTier;
  priorityLabel: string;
  category: ToolCategory;
  categoryLabel: string;
  isStudentTool: boolean;
  isFeatured?: boolean;
  description: string;
  longExplanation: string;
  formulaSummary: string;
  howToSteps: string[];
  example: {
    scenario: string;
    inputs: string;
    output: string;
  };
  faqs: CalculatorFaq[];
  relatedToolIds: ToolId[];
}

export interface CalculationHistoryItem {
  id: string;
  toolId: ToolId;
  toolName: string;
  inputsSummary: string;
  resultSummary: string;
  timestamp: string;
  isPinned?: boolean;
}

export interface EducationalTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  formula?: string;
  details: string[];
  studentTip: string;
  relatedToolId: ToolId;
}
