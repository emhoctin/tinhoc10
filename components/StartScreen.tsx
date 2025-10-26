import React, { useState, useEffect } from 'react';
import { getTotalXP } from '../services/gameService';

interface StartScreenProps {
  onStart: (fullName: string, className: string) => void;
  onViewLeaderboard: () => void;
  onViewDashboard: () => void; // For teachers
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

    return () => {
      clearTimeout(handler);
    };
  }, [fullName, className]);

  const canStart = fullName.trim().length > 0 && className.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-4 text-center">
      <div className="absolute top-4 right-4">
        <button onClick={onViewDashboard} className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
          Teacher Dashboard
        </button>
      </div>
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 animate-fade-in-down">
          Ôn Tập Tin Học 10
        </h1>
        <p className="text-lg text-slate-600 mb-8 animate-fade-in-up">
          Nhập thông tin và bắt đầu chinh phục thử thách!
        </p>
        
        <div className="mb-8 w-full max-w-sm mx-auto space-y-3">
          <input 
            type="text" 
            placeholder="Nhập họ và tên..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-full text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            aria-label="Full Name"
          />
          <input 
            type="text" 
            placeholder="Nhập lớp..."
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-full text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            aria-label="Class Name"
          />
          {totalXP > 0 && (
            <p className="text-blue-600 mt-2 text-sm">Tổng điểm tích lũy: {totalXP} XP</p>
          )}
        </div>

        <button
          onClick={() => onStart(fullName.trim(), className.trim())}
          disabled={!canStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
        >
          Bắt đầu
        </button>

         <button
          onClick={onViewLeaderboard}
          className="mt-4 bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-800 font-bold py-2 px-6 rounded-full transition-colors duration-300"
        >
          Bảng xếp hạng
        </button>
      </div>
    </div>
  );
};

export default StartScreen;