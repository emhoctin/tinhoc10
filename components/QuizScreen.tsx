import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { getExplanation } from '../services/geminiService';
import ExplanationModal from './ExplanationModal';

interface QuizScreenProps {
    questions: Question[];
    onQuizEnd: (score: number, correctCount: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onQuizEnd }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

    const currentQuestion = questions[currentQIndex];
    
    useEffect(() => {
        if (currentQuestion) {
            setShuffledOptions([...currentQuestion.options].sort(() => Math.random() - 0.5));
        }
    }, [currentQuestion]);
    
    const handleSelectAnswer = (option: string) => {
        if (isAnswered) return;
        const newAnswers = new Set(selectedAnswers);
        if (currentQuestion.type === 'single') {
            newAnswers.clear();
            newAnswers.add(option);
        } else {
            if (newAnswers.has(option)) newAnswers.delete(option);
            else newAnswers.add(option);
        }
        setSelectedAnswers(newAnswers);
    };
    
    const handleSubmit = () => {
        if (isAnswered) return;
        setIsAnswered(true);
        let questionScore = 0;
        let isFullyCorrect = false;

        if (currentQuestion.type === 'single') {
            const selected = Array.from(selectedAnswers)[0];
            if (selected === currentQuestion.correctAnswer) {
                questionScore = 10;
                isFullyCorrect = true;
            }
        } else { // multiple
            const correctAnswers = new Set(currentQuestion.correctAnswer as string[]);
            let correctSelections = 0;
            selectedAnswers.forEach(ans => {
                if (correctAnswers.has(ans)) {
                    correctSelections++;
                }
            });
            questionScore = correctSelections * 10;
            isFullyCorrect = correctSelections === correctAnswers.size && selectedAnswers.size === correctAnswers.size;
        }

        setScore(prev => prev + questionScore);
        if (isFullyCorrect) setCorrectCount(prev => prev + 1);

        setTimeout(() => {
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setSelectedAnswers(new Set());
                setIsAnswered(false);
            } else {
                onQuizEnd(score + questionScore, isFullyCorrect ? correctCount + 1 : correctCount);
            }
        }, 2000);
    };

    const handleGetExplanation = async () => {
        setIsModalOpen(true);
        setIsLoadingExplanation(true);
        const expl = await getExplanation(currentQuestion);
        setExplanation(expl);
        setIsLoadingExplanation(false);
    };

    if (!currentQuestion) return <div>Loading questions...</div>;
    
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
            <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-3xl shadow-2xl">
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2 text-slate-500">
                        <span>Câu hỏi {currentQIndex + 1} / {questions.length}</span>
                        <span className="font-bold text-indigo-600 text-lg">{score} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3"><div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800">{currentQuestion.question}</h2>
                <p className="text-sm text-slate-500 mb-6">{currentQuestion.type === 'single' ? 'Chọn một đáp án đúng' : 'Chọn tất cả các đáp án đúng'}</p>
                
                <div className="space-y-3">
                    {shuffledOptions.map((option, index) => {
                        const isSelected = selectedAnswers.has(option);
                        let buttonClass = 'border-slate-300 bg-white hover:bg-sky-50 hover:border-sky-400';
                        if (isAnswered) {
                            const isCorrect = (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(option) : currentQuestion.correctAnswer === option);
                            if (isCorrect) buttonClass = 'border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300';
                            else if (isSelected) buttonClass = 'border-rose-500 bg-rose-100 text-rose-800 ring-2 ring-rose-300';
                        } else if (isSelected) {
                            buttonClass = 'border-amber-500 bg-amber-100 ring-2 ring-amber-400';
                        }
                        return (
                            <button key={index} onClick={() => handleSelectAnswer(option)} disabled={isAnswered} className={`w-full p-4 text-left rounded-lg border-2 font-semibold transition-all duration-300 ${buttonClass}`}>
                                {option}
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                   <button onClick={handleSubmit} disabled={selectedAnswers.size === 0 || isAnswered} className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg disabled:shadow-none">
                       {isAnswered ? 'Đã trả lời' : 'Xác nhận'}
                   </button>
                   {isAnswered && (
                        <button onClick={handleGetExplanation} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl">
                            Xem giải thích AI
                        </button>
                   )}
                </div>
            </div>
            <ExplanationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} explanation={explanation} isLoading={isLoadingExplanation} />
        </div>
    );
};

export default QuizScreen;