import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardPlayer } from '../services/gameService';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLeaderboard(getLeaderboard());
        setLoading(false);
    }, []);

    const getTrophy = (index: number) => {
        if (index === 0) return '🏆';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg w-full animate-fade-in-scale">
                <h2 className="text-4xl font-bold text-blue-600 mb-6">Bảng Xếp Hạng Tuần</h2>
                {loading ? (
                    <p>Đang tải...</p>
                ) : leaderboard.length > 0 ? (
                    <ol className="space-y-3 text-left">
                        {leaderboard.map((entry, index) => (
                            <li key={index} className={`flex items-center justify-between p-3 rounded-lg ${index < 3 ? 'bg-blue-50' : 'bg-slate-100'}`}>
                                <div className="flex items-center">
                                    <span className={`font-bold text-xl w-8 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-yellow-600' : 'text-slate-500'}`}>{getTrophy(index)}</span>
                                    <div>
                                        <div className="font-medium text-slate-800">{entry.fullName}</div>
                                        <div className="text-xs text-slate-500">Lớp: {entry.className}</div>
                                    </div>
                                </div>
                                <span className="font-bold text-blue-600">{entry.score} XP</span>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-slate-500">Chưa có ai chơi trong tuần này. Hãy là người đầu tiên!</p>
                )}
                 <button
                    onClick={onBack}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default LeaderboardScreen;