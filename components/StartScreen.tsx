import React, { useState, useEffect } from 'react';
import { getTotalXP } from '../services/gameService';

interface StartScreenProps {
    onStart: (fullName: string, className: string) => void;
    onViewLeaderboard: () => void;
    onViewDashboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onViewLeaderboard, onViewDashboard }) => {
    const [fullName, setFullName] = useState('');
    const [className, setClassName] = useState('');
    const [totalXP, setTotalXP] = useState(0);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (fullName.trim() && className.trim()) {
                setTotalXP(getTotalXP(fullName, className));
            } else {
                setTotalXP(0);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [fullName, className]);

    const canStart = fullName.trim().length > 0 && className.trim().length > 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 mb-2 pb-2">Kết Nối Tri Thức Tin 10</h1>
                <p className="text-slate-500 mb-8">Game ôn tập kiến thức Tin học 10</p>
                <div className="space-y-4">
                    <input type="text" placeholder="Nhập họ và tên..." value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-full text-center outline-none transition-all"/>
                    <input type="text" placeholder="Nhập lớp..." value={className} onChange={e => setClassName(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-full text-center outline-none transition-all"/>
                </div>
                {totalXP > 0 && <p className="text-indigo-600 mt-4 font-semibold">Điểm tích lũy của bạn: {totalXP} XP</p>}
                <button onClick={() => onStart(fullName, className)} disabled={!canStart} className="mt-8 w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-xl disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg disabled:shadow-none">Bắt đầu lượt mới</button>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={onViewLeaderboard} className="w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-bold py-2 px-6 rounded-full transition-colors">Bảng xếp hạng</button>
                    <button onClick={onViewDashboard} className="w-full bg-transparent border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-400 font-bold py-2 px-6 rounded-full transition-colors">Xem điểm</button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;