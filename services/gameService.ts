
import { ScoreRecord } from '../types';

const SCORES_KEY = 'tinHoc10Scores';

export const getAllRecords = (): ScoreRecord[] => {
  try {
    const records = localStorage.getItem(SCORES_KEY);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error("Error reading scores from localStorage", error);
    return [];
  }
};

export const saveScore = (fullName: string, className: string, score: number): void => {
  const allScores = getAllRecords();
  const newRecord: ScoreRecord = {
    fullName: fullName.trim(),
    className: className.trim(),
    score,
    timestamp: Date.now(),
  };
  allScores.push(newRecord);
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(allScores));
  } catch (error) {
    console.error("Error saving score to localStorage", error);
  }
};

export const getLeaderboard = (): Omit<ScoreRecord, 'timestamp'>[] => {
    const allScores = getAllRecords();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyScores = allScores.filter(record => record.timestamp >= oneWeekAgo);
    
    const playerScores = weeklyScores.reduce((acc, record) => {
        const key = `${record.fullName.toLowerCase().trim()}|${record.className.toLowerCase().trim()}`;
        if (!acc[key]) {
            acc[key] = {
                fullName: record.fullName,
                className: record.className,
                score: 0
            };
        }
        acc[key].score += record.score;
        return acc;
    }, {} as { [key: string]: Omit<ScoreRecord, 'timestamp'> });

    return Object.values(playerScores).sort((a, b) => b.score - a.score).slice(0, 10);
};

export const getTotalXP = (fullName: string, className: string): number => {
    if (!fullName.trim() || !className.trim()) return 0;
    const allScores = getAllRecords();
    const fNameLower = fullName.toLowerCase().trim();
    const cNameLower = className.toLowerCase().trim();
    return allScores
        .filter(record => 
            record.fullName.toLowerCase().trim() === fNameLower &&
            record.className.toLowerCase().trim() === cNameLower
        )
        .reduce((total, record) => total + record.score, 0);
};
