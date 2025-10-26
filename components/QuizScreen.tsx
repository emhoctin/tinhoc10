import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Question } from '../types';
import { getExplanation } from '../services/geminiService';
import ExplanationModal from './ExplanationModal';

interface QuizScreenProps {
  questions: Question[];
  onQuizEnd: (score: number, correctCount: number) => void;
}

const POINTS_PER_CORRECT_SINGLE = 10;
const POINTS_PER_CORRECT_MULTI_CHOICE = 10;

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};


const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onQuizEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion]);


  const resetForNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswers([]);
  }

  const handleNextQuestion = () => {
    if (!isAnswered) {
        // This is now the 'Check Answer' button
        setIsAnswered(true);
        let questionScore = 0;
        let isQuestionCorrect = false;

        const correct = Array.isArray(currentQuestion.correctAnswer)
            ? currentQuestion.correctAnswer
            : [currentQuestion.correctAnswer];
        
        if (currentQuestion.type === 'single') {
            if (selectedAnswers.length === 1 && selectedAnswers[0] === correct[0]) {
                questionScore = POINTS_PER_CORRECT_SINGLE;
                isQuestionCorrect = true;
            }
        } else {
            const hasSelectedIncorrect = selectedAnswers.some(ans => !correct.includes(ans));
            if (!hasSelectedIncorrect) {
                const correctlyChosenCount = selectedAnswers.filter(ans => correct.includes(ans)).length;
                questionScore = correctlyChosenCount * POINTS_PER_CORRECT_MULTI_CHOICE;
                // Full points only if all correct answers are selected
                if(correctlyChosenCount === correct.length && correctlyChosenCount > 0){
                    isQuestionCorrect = true;
                } else if(correctlyChosenCount > 0){
                    isQuestionCorrect = true; // Still counts as a "correctly answered question" for stats if partially right
                }
            }
        }
        setScore(prev => prev + questionScore);
        if(isQuestionCorrect) {
            setCorrectCount(prev => prev + 1);
        }

    } else {
        // This is the 'Next Question' button
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            resetForNextQuestion();
        } else {
            onQuizEnd(score, correctCount);
        }
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    
    if (currentQuestion.type === 'single') {
        setSelectedAnswers([answer]);
    } else {
        setSelectedAnswers(prev => 
            prev.includes(answer) 
            ? prev.filter(a => a !== answer)
            : [...prev, answer]
        );
    }
  };
  
  const handleGetExplanation = useCallback(async () => {
    if (!currentQuestion) return;
    setIsLoadingExplanation(true);
    setShowExplanation(true);
    const expl = await getExplanation(currentQuestion);
    setExplanation(expl);
    setIsLoadingExplanation(false);
  }, [currentQuestion]);
  

  if (questions.length === 0 || !currentQuestion) {
    return <div className="flex items-center justify-center h-screen">Đang tải câu hỏi...</div>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span>Câu hỏi {currentQuestionIndex + 1} / {questions.length}</span>
            <span className="font-bold">Điểm: {score} XP</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-slate-800">{currentQuestion.question}</h2>
        <p className="text-sm text-blue-600 font-medium mb-6">{currentQuestion.type === 'single' ? '(Chọn một đáp án)' : '(Chọn các đáp án đúng)'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledOptions.map((option) => {
            const isSelected = selectedAnswers.includes(option);
            const correctAnswers = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
            const isCorrect = correctAnswers.includes(option);

            let buttonClass = 'bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600';
            if (isAnswered) {
              if (isCorrect) {
                buttonClass = 'bg-green-100 border-2 border-green-500 text-green-800';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-100 border-2 border-red-500 text-red-800';
              } else {
                 buttonClass = 'bg-slate-100 text-slate-500 opacity-70';
              }
            } else if (isSelected) {
                buttonClass = 'bg-blue-100 border-2 border-blue-500 text-blue-700 ring-2 ring-blue-200';
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered && !isSelected && currentQuestion.type === 'multiple'}
                className={`w-full text-left p-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-3 ${buttonClass}`}
              >
                {currentQuestion.type === 'multiple' && (
                    <div className={`w-6 h-6 rounded border-2 ${isSelected ? isAnswered ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600' : 'bg-blue-500 border-blue-600' : 'border-slate-400'} flex-shrink-0 flex items-center justify-center`}>
                        {isSelected && <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </div>
                )}
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-4">
            {isAnswered && (
                <button
                onClick={handleGetExplanation}
                className="w-full sm:w-auto bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 animate-fade-in"
                >
                Giải thích đáp án
                </button>
            )}
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswers.length === 0 && !isAnswered}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isAnswered ? (currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả') : 'Kiểm tra'}
            </button>
        </div>
      </div>

      <ExplanationModal 
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        explanation={explanation}
        isLoading={isLoadingExplanation}
      />
    </div>
  );
};

export default QuizScreen;