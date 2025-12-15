export enum Mood {
  CONFUSED = 'confused',
  CONFIDENT = 'confident',
  BORED = 'bored',
  ALERT = 'alert',
}

export type Importance = 'Low' | 'Medium' | 'High';

export interface ParagraphAnalysis {
  id: string; // Unique ID for Drag and Drop
  text: string;
  mood: Mood;
  importance: Importance;
  keywords: string[];
}

export interface AnalysisSummary {
  [Mood.CONFUSED]: number;
  [Mood.CONFIDENT]: number;
  [Mood.BORED]: number;
  [Mood.ALERT]: number;
}

export interface StudyPlan {
  topConfusedIndices: number[];
  topConfidentIndices: number[];
  suggestion: string;
}

export interface AnalysisResponse {
  paragraphs: ParagraphAnalysis[];
  summary: AnalysisSummary;
  studyPlan: StudyPlan;
}

export interface SimpleNote {
  id: string;
  title: string;
  content: string;
  analysis: AnalysisResponse | null;
}

// Helper to ensure type safety when mapping API strings to Enum
export function isMood(value: string): value is Mood {
  return Object.values(Mood).includes(value as Mood);
}