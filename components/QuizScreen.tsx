
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 animate-fade-in">
            <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-2xl shadow-xl">
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2 text-slate-500">
                        <span>Câu hỏi {currentQIndex + 1} / {questions.length}</span>
                        <span className="font-bold text-blue-600">{score} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-slate-800">{currentQuestion.question}</h2>
                <p className="text-sm text-slate-500 mb-6">{currentQuestion.type === 'single' ? 'Chọn một đáp án đúng' : 'Chọn tất cả các đáp án đúng'}</p>
                
                <div className="space-y-3">
                    {shuffledOptions.map((option, index) => {
                        const isSelected = selectedAnswers.has(option);
                        let buttonClass = 'border-slate-300 bg-white hover:bg-slate-50';
                        if (isAnswered) {
                            const isCorrect = (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(option) : currentQuestion.correctAnswer === option);
                            if (isCorrect) buttonClass = 'border-green-500 bg-green-100 text-green-800';
                            else if (isSelected) buttonClass = 'border-red-500 bg-red-100 text-red-800';
                        } else if (isSelected) {
                            buttonClass = 'border-blue-500 bg-blue-100';
                        }
                        return (
                            <button key={index} onClick={() => handleSelectAnswer(option)} disabled={isAnswered} className={`w-full p-4 text-left rounded-lg border-2 font-medium transition-all duration-300 ${buttonClass}`}>
                                {option}
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                   <button onClick={handleSubmit} disabled={selectedAnswers.size === 0 || isAnswered} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                       {isAnswered ? 'Đã trả lời' : 'Xác nhận'}
                   </button>
                   {isAnswered && (
                        <button onClick={handleGetExplanation} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
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
