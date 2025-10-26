import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, Question, QuestionType } from './types';
import StartScreen from './components/StartScreen';
import PreparingScreen from './components/PreparingScreen';
import QuizScreen from './components/QuizScreen';
import EndScreen from './components/EndScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import TeacherDashboard from './components/TeacherDashboard';
import { questions } from './constants/questions';
import * as gameService from './services/gameService';

const QUESTIONS_SINGLE = 20;
const QUESTIONS_MULTIPLE = 5;

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [finalScore, setFinalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  
  const handleStart = useCallback((name: string, cls: string) => {
    setFullName(name);
    setClassName(cls);
    setGameState(GameState.PREPARING);
  }, []);

  useEffect(() => {
    if (gameState === GameState.PREPARING) {
      const timer = setTimeout(() => {
        setGameState(GameState.QUIZ);
      }, 1500); // Show preparing screen for 1.5s

      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const activeQuestions = useMemo(() => {
    if (gameState !== GameState.QUIZ && gameState !== GameState.END) return [];
    
    const singleQuestions = questions.filter(q => q.type === 'single');
    const multipleQuestions = questions.filter(q => q.type === 'multiple');
    
    const roundSingles = shuffleArray(singleQuestions).slice(0, QUESTIONS_SINGLE);
    const roundMultiples = shuffleArray(multipleQuestions).slice(0, QUESTIONS_MULTIPLE);

    return shuffleArray([...roundSingles, ...roundMultiples]);
  }, [gameState]);

  const handleQuizEnd = useCallback((score: number, count: number) => {
    if (fullName && className) {
      gameService.saveScore(fullName, className, score);
    }
    setFinalScore(score);
    setCorrectCount(count);
    setGameState(GameState.END);
  }, [fullName, className]);

  const handleRestart = useCallback(() => {
    setFinalScore(0);
    setCorrectCount(0);
    setFullName('');
    setClassName('');
    setGameState(GameState.START);
  }, []);

  const handleViewLeaderboard = useCallback(() => {
    setGameState(GameState.LEADERBOARD);
  }, []);
  
  const handleViewDashboard = useCallback(() => {
      setGameState(GameState.TEACHER_DASHBOARD);
  }, []);


  const renderGameState = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={handleStart} onViewLeaderboard={handleViewLeaderboard} onViewDashboard={handleViewDashboard}/>;
      case GameState.PREPARING:
        return <PreparingScreen />;
      case GameState.QUIZ:
        return <QuizScreen questions={activeQuestions} onQuizEnd={handleQuizEnd} />;
      case GameState.END:
        return (
          <EndScreen 
            score={finalScore}
            correctCount={correctCount}
            totalQuestions={QUESTIONS_SINGLE + QUESTIONS_MULTIPLE}
            onRestart={handleRestart}
            onViewLeaderboard={handleViewLeaderboard}
          />
        );
      case GameState.LEADERBOARD:
        return <LeaderboardScreen onBack={handleRestart} />;
      case GameState.TEACHER_DASHBOARD:
        return <TeacherDashboard onBack={handleRestart} />;
      default:
        return <StartScreen onStart={handleStart} onViewLeaderboard={handleViewLeaderboard} onViewDashboard={handleViewDashboard} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderGameState()}
    </div>
  );
};

export default App;
