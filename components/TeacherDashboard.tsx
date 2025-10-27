import React, { useState, useEffect, useMemo } from 'react';
import { getAllRecords } from '../services/gameService';
import { ScoreRecord } from '../types';

interface TeacherDashboardProps {
    onBack: () => void;
}

// New type for student summary
type StudentSummary = {
    fullName: string;
    className: string;
    totalScore: number;
    attemptCount: number;
    highestScore: number;
    lastAttempt: number;
};

type SortKeyAll = keyof ScoreRecord;
type SortKeySummary = keyof StudentSummary;

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
    const [allRecords, setAllRecords] = useState<ScoreRecord[]>([]);
    const [viewMode, setViewMode] = useState<'summary' | 'all'>('summary'); // Default to summary view

    // Sorting state for "All Attempts" view
    const [sortConfigAll, setSortConfigAll] = useState<{ key: SortKeyAll; direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'desc' });
    
    // Sorting state for "Summary" view
    const [sortConfigSummary, setSortConfigSummary] = useState<{ key: SortKeySummary; direction: 'asc' | 'desc' }>({ key: 'totalScore', direction: 'desc' });


    useEffect(() => {
        setAllRecords(getAllRecords());
    }, []);

    // Memoized calculation for student summaries
    const studentSummaries = useMemo(() => {
        const summaries: { [key: string]: StudentSummary } = {};
        allRecords.forEach(record => {
            const key = `${record.fullName.trim().toLowerCase()}|${record.className.trim().toLowerCase()}`;
            if (!summaries[key]) {
                summaries[key] = {
                    fullName: record.fullName,
                    className: record.className,
                    totalScore: 0,
                    attemptCount: 0,
                    highestScore: 0,
                    lastAttempt: 0,
                };
            }
            summaries[key].totalScore += record.score;
            summaries[key].attemptCount += 1;
            if (record.score > summaries[key].highestScore) {
                summaries[key].highestScore = record.score;
            }
            if (record.timestamp > summaries[key].lastAttempt) {
                summaries[key].lastAttempt = record.timestamp;
            }
        });
        return Object.values(summaries);
    }, [allRecords]);

    // Memoized sorting for "All Attempts" view
    const sortedAllRecords = useMemo(() => {
        let sortableItems = [...allRecords];
        sortableItems.sort((a, b) => {
            if (a[sortConfigAll.key] < b[sortConfigAll.key]) {
                return sortConfigAll.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfigAll.key] > b[sortConfigAll.key]) {
                return sortConfigAll.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [allRecords, sortConfigAll]);

    // Memoized sorting for "Summary" view
    const sortedSummaries = useMemo(() => {
        let sortableItems = [...studentSummaries];
        sortableItems.sort((a, b) => {
            if (a[sortConfigSummary.key] < b[sortConfigSummary.key]) {
                return sortConfigSummary.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfigSummary.key] > b[sortConfigSummary.key]) {
                return sortConfigSummary.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [studentSummaries, sortConfigSummary]);

    const requestSortAll = (key: SortKeyAll) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfigAll.key === key && sortConfigAll.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfigAll({ key, direction });
    }

    const requestSortSummary = (key: SortKeySummary) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfigSummary.key === key && sortConfigSummary.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfigSummary({ key, direction });
    }
    
    const getSortIndicator = (key: SortKeyAll | SortKeySummary) => {
        const config = viewMode === 'all' ? sortConfigAll : sortConfigSummary;
        // @ts-ignore
        if (config.key !== key) return '↕';
        // @ts-ignore
        return config.direction === 'asc' ? '↑' : '↓';
    }

    return (
         <div className="flex flex-col items-center min-h-screen p-4 animate-fade-in my-10">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-7xl">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 mb-6 text-center pb-2">Teacher Dashboard</h2>
                
                {/* View Mode Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="flex p-1 bg-slate-200 rounded-full">
                        <button 
                            onClick={() => setViewMode('summary')}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors ${viewMode === 'summary' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600'}`}
                        >
                            Tổng hợp theo học sinh
                        </button>
                        <button 
                            onClick={() => setViewMode('all')}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors ${viewMode === 'all' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600'}`}
                        >
                            Tất cả lượt chơi
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    {viewMode === 'summary' ? (
                        <table className="w-full text-left table-auto">
                            <thead className="bg-slate-100 text-slate-700 font-semibold">
                                <tr>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortSummary('fullName')}>Họ và tên {getSortIndicator('fullName')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortSummary('className')}>Lớp {getSortIndicator('className')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortSummary('totalScore')}>Tổng điểm {getSortIndicator('totalScore')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortSummary('attemptCount')}>Số lần chơi {getSortIndicator('attemptCount')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortSummary('highestScore')}>Điểm cao nhất {getSortIndicator('highestScore')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortSummary('lastAttempt')}>Lần chơi cuối {getSortIndicator('lastAttempt')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {sortedSummaries.map((summary, index) => (
                                    <tr key={index} className="hover:bg-sky-50 transition-colors">
                                        <td className="p-4">{summary.fullName}</td>
                                        <td className="p-4">{summary.className}</td>
                                        <td className="p-4 font-bold text-indigo-700">{summary.totalScore}</td>
                                        <td className="p-4">{summary.attemptCount}</td>
                                        <td className="p-4 font-semibold text-sky-600">{summary.highestScore}</td>
                                        <td className="p-4 text-sm text-slate-600">{new Date(summary.lastAttempt).toLocaleString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left table-auto">
                            <thead className="bg-slate-100 text-slate-700 font-semibold">
                                <tr>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortAll('fullName')}>Họ và tên {getSortIndicator('fullName')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortAll('className')}>Lớp {getSortIndicator('className')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortAll('score')}>Điểm {getSortIndicator('score')}</th>
                                    <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSortAll('timestamp')}>Thời gian {getSortIndicator('timestamp')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {sortedAllRecords.map((record, index) => (
                                    <tr key={index} className="hover:bg-sky-50 transition-colors">
                                        <td className="p-4">{record.fullName}</td>
                                        <td className="p-4">{record.className}</td>
                                        <td className="p-4 font-semibold text-indigo-600">{record.score}</td>
                                        <td className="p-4 text-sm text-slate-600">{new Date(record.timestamp).toLocaleString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <button onClick={onBack} className="mt-8 w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-bold py-2 px-6 rounded-full transition-colors">Quay lại</button>
            </div>
         </div>
    );
};

export default TeacherDashboard;