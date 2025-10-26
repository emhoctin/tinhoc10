export enum GameState {
    START = 'START',
    PREPARING = 'PREPARING',
    QUIZ = 'QUIZ',
    END = 'END',
    LEADERBOARD = 'LEADERBOARD',
    TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
}

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string | string[];
    topic: string;
    difficulty: number;
    // FIX: Add 'true-false-set' to the Question type to allow for a new question format. This fixes errors across multiple files.
    type: 'single' | 'multiple' | 'true-false-set';
}

export interface ScoreRecord {
    fullName: string;
    className: string;
    score: number;
    timestamp: number;
}
