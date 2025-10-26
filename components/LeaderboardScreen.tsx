import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/gameService';
import { ScoreRecord } from '../types';

interface LeaderboardScreenProps {
    onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState<Omit<ScoreRecord, 'timestamp'>[]>([]);
    
    useEffect(() => {
        setLeaderboard(getLeaderboard());
    }, []);
    
    const trophyIcons = ["🏆", "🥈", "🥉"];
    const rankColors = [
        "bg-amber-100 border-amber-300", 
        "bg-slate-200 border-slate-300", 
        "bg-orange-200 border-orange-300"
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 mb-6 text-center pb-2">Bảng Xếp Hạng Tuần</h2>
                <ul className="space-y-3">
                    {leaderboard.length > 0 ? leaderboard.map((player, index) => (
                        <li key={index} className={`flex items-center justify-between p-4 rounded-xl border-2 ${index < 3 ? rankColors[index] : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center">
                                <span className="text-2xl w-8 text-center font-bold">{trophyIcons[index] || (index + 1)}</span>
                                <div className="ml-4">
                                    <p className="font-bold text-slate-800">{player.fullName}</p>
                                    <p className="text-sm text-slate-500">{player.className}</p>
                                </div>
                            </div>
                            <span className="font-bold text-indigo-600 text-lg">{player.score} XP</span>
                        </li>
                    )) : <p className="text-center text-slate-500 py-8">Chưa có ai trong bảng xếp hạng tuần này. Hãy là người đầu tiên!</p>}
                </ul>
                 <button onClick={onBack} className="mt-8 w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-bold py-2 px-6 rounded-full transition-colors">Quay lại</button>
            </div>
        </div>
    );
};

export default LeaderboardScreen;