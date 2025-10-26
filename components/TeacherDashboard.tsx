import React, { useState, useEffect, useMemo } from 'react';
import { getAllRecords } from '../services/gameService';
import { ScoreRecord } from '../types';

interface TeacherDashboardProps {
    onBack: () => void;
}

type SortKey = keyof ScoreRecord;

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
    const [allRecords, setAllRecords] = useState<ScoreRecord[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'desc' });

    useEffect(() => {
        setAllRecords(getAllRecords());
    }, []);
    
    const sortedRecords = useMemo(() => {
        let sortableItems = [...allRecords];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [allRecords, sortConfig]);
    
    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }
    
    const getSortIndicator = (key: SortKey) => {
        if (sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    }

    return (
         <div className="flex flex-col items-center min-h-screen p-4 animate-fade-in my-10">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 mb-6 text-center pb-2">Teacher Dashboard</h2>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-100 text-slate-700 font-semibold">
                            <tr>
                                <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('fullName')}>Họ và tên {getSortIndicator('fullName')}</th>
                                <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('className')}>Lớp {getSortIndicator('className')}</th>
                                <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('score')}>Điểm {getSortIndicator('score')}</th>
                                <th className="p-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('timestamp')}>Thời gian {getSortIndicator('timestamp')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sortedRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-sky-50 transition-colors">
                                    <td className="p-4">{record.fullName}</td>
                                    <td className="p-4">{record.className}</td>
                                    <td className="p-4 font-semibold text-indigo-600">{record.score}</td>
                                    <td className="p-4 text-sm text-slate-600">{new Date(record.timestamp).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={onBack} className="mt-8 w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-bold py-2 px-6 rounded-full transition-colors">Quay lại</button>
            </div>
         </div>
    );
};

export default TeacherDashboard;