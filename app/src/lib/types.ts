export type FormId = "A" | "B";

export type Dimension = "technical" | "applied" | "risk" | "case";

export type OptionKey = "A" | "B" | "C" | "D";

export interface Option {
  key: string;
  text: string;
}

export interface Item {
  id: string;
  section: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  q: string;
  options: Option[];
  answer: string;
}

export interface Form {
  form: string;
  scenario: { title: string; body: string };
  items: Item[];
}

/** answers[itemId] = chosen option key */
export type AnswerMap = Record<string, string>;

export interface DimensionScore {
  key: Dimension;
  name: string;
  blurb: string;
  correct: number;
  total: number;
  score: number;
}

export interface Result {
  form: FormId | "Adaptive";
  total: number;
  band: BandName;
  correct: number;
  items: number;
  dimensions: DimensionScore[];
  weakest: DimensionScore;
  strongest: DimensionScore;
}

export type BandName = "Beginner" | "Novice" | "Intermediate" | "Advanced";
