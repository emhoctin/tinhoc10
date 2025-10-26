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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 mb-2 pb-2">Hoàn thành!</h2>
                <p className="text-slate-500 mb-6">Bạn đã kết thúc lượt chơi.</p>
                <div className="bg-gradient-to-br from-sky-50 to-indigo-100 p-6 rounded-2xl mb-8">
                    <p className="text-slate-600 text-lg">Tổng điểm đạt được</p>
                    <p className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 my-2">{score} XP</p>
                    <p className="text-slate-600">Bạn đã trả lời đúng {correctCount} / {totalQuestions} câu hỏi ({percentage}%)</p>
                </div>
                <div className="space-y-4">
                    <button onClick={() => onRestart(fullName, className)} className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-lg">Chơi lại</button>
                    <button onClick={onViewLeaderboard} className="w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-bold py-2 px-6 rounded-full transition-colors">Xem bảng xếp hạng</button>
                    <button onClick={onBackToStart} className="text-sm text-slate-500 hover:text-indigo-600 transition-colors pt-2">Về màn hình chính</button>
                </div>
            </div>
        </div>
    );
};

export default EndScreen;