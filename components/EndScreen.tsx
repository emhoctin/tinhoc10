
import React from 'react';

interface EndScreenProps {
    score: number;
    correctCount: number;
    totalQuestions: number;
    onRestart: (fullName: string, className: string) => void;
    onBackToStart: () => void;
    onViewLeaderboard: () => void;
    fullName: string;
    className: string;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, correctCount, totalQuestions, onRestart, onBackToStart, onViewLeaderboard, fullName, className }) => {
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 text-center animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">Hoàn thành!</h2>
                <p className="text-slate-500 mb-6">Bạn đã kết thúc lượt chơi.</p>
                <div className="bg-slate-100 p-6 rounded-xl mb-8">
                    <p className="text-slate-600 text-lg">Tổng điểm đạt được</p>
                    <p className="text-5xl font-bold text-blue-600 my-2">{score} XP</p>
                    <p className="text-slate-600">Bạn đã trả lời đúng {correctCount} / {totalQuestions} câu hỏi ({percentage}%)</p>
                </div>
                <div className="space-y-4">
                    <button onClick={() => onRestart(fullName, className)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-transform">Chơi lại</button>
                    <button onClick={onViewLeaderboard} className="w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-200 font-bold py-2 px-6 rounded-full transition-colors">Xem bảng xếp hạng</button>
                    <button onClick={onBackToStart} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Về màn hình chính</button>
                </div>
            </div>
        </div>
    );
};

export default EndScreen;
