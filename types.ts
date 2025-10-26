export enum GameState {
  START,
  PREPARING,
  QUIZ,
  END,
  LEADERBOARD,
  TEACHER_DASHBOARD,
}

export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string | string[]; // Can be single string or array of strings
  topic: string;
  difficulty: number;
  type: QuestionType; // To distinguish between single and multiple choice
}

export interface ScoreRecord {
    fullName: string;
    className: string;
    score: number;
    timestamp: number;
}
