
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
    type: 'single' | 'multiple';
}

export interface ScoreRecord {
    fullName: string;
    className: string;
    score: number;
    timestamp: number;
}
