
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameState, Question } from './types';
import { questions } from './constants/questions';
import { saveScore } from './services/gameService';
import StartScreen from './components/StartScreen';
import PreparingScreen from './components/PreparingScreen';
import QuizScreen from './components/QuizScreen';
import EndScreen from './components/EndScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import TeacherDashboard from './components/TeacherDashboard';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.START);
    const [finalScore, setFinalScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [fullName, setFullName] = useState('');
    const [className, setClassName] = useState('');

    const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    // Corrected question counts to match the available data
    const QUESTIONS_SINGLE = 14;
    const QUESTIONS_MULTIPLE = 4;

    const handleStart = useCallback((name: string, cls: string) => {
      setFullName(name);
      setClassName(cls);
      setGameState(GameState.PREPARING);
    }, []);

    useEffect(() => {
      if (gameState === GameState.PREPARING) {
        const timer = setTimeout(() => setGameState(GameState.QUIZ), 1500);
        return () => clearTimeout(timer);
      }
    }, [gameState]);

    const activeQuestions = useMemo(() => {
      if (gameState !== GameState.QUIZ && gameState !== GameState.END) return [];
      const single = questions.filter(q => q.type === 'single');
      const multiple = questions.filter(q => q.type === 'multiple');
      const roundSingles = shuffleArray(single).slice(0, QUESTIONS_SINGLE);
      const roundMultiples = shuffleArray(multiple).slice(0, QUESTIONS_MULTIPLE);
      return shuffleArray([...roundSingles, ...roundMultiples]);
    }, [gameState]);

    const handleQuizEnd = useCallback((score: number, count: number) => {
      if (fullName && className) saveScore(fullName, className, score);
      setFinalScore(score);
      setCorrectCount(count);
      setGameState(GameState.END);
    }, [fullName, className]);
    
    const handleRestart = useCallback((name: string, cls: string) => {
      setFullName(name);
      setClassName(cls);
      setGameState(GameState.PREPARING);
    }, []);

    const handleBackToStart = useCallback(() => setGameState(GameState.START), []);
    const handleViewLeaderboard = useCallback(() => setGameState(GameState.LEADERBOARD), []);
    const handleViewDashboard = useCallback(() => setGameState(GameState.TEACHER_DASHBOARD), []);
    
    const renderGameState = () => {
        switch (gameState) {
            case GameState.START: 
                return <StartScreen onStart={handleStart} onViewLeaderboard={handleViewLeaderboard} onViewDashboard={handleViewDashboard}/>;
            case GameState.PREPARING:
                return <PreparingScreen />;
            case GameState.QUIZ: 
                return <QuizScreen questions={activeQuestions} onQuizEnd={handleQuizEnd} />;
            case GameState.END: 
                return <EndScreen score={finalScore} correctCount={correctCount} totalQuestions={activeQuestions.length} onRestart={handleRestart} onBackToStart={handleBackToStart} onViewLeaderboard={handleViewLeaderboard} fullName={fullName} className={className}/>;
            case GameState.LEADERBOARD:
                return <LeaderboardScreen onBack={handleBackToStart} />;
            case GameState.TEACHER_DASHBOARD:
                return <TeacherDashboard onBack={handleBackToStart} />;
            default: 
                return <StartScreen onStart={handleStart} onViewLeaderboard={handleViewLeaderboard} onViewDashboard={handleViewDashboard}/>;
        }
    };
    
    return <div className="min-h-screen">{renderGameState()}</div>;
}

export default App;
