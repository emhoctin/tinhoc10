
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
         <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Teacher Dashboard</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="p-3 cursor-pointer" onClick={() => requestSort('fullName')}>Họ và tên {getSortIndicator('fullName')}</th>
                                <th className="p-3 cursor-pointer" onClick={() => requestSort('className')}>Lớp {getSortIndicator('className')}</th>
                                <th className="p-3 cursor-pointer" onClick={() => requestSort('score')}>Điểm {getSortIndicator('score')}</th>
                                <th className="p-3 cursor-pointer" onClick={() => requestSort('timestamp')}>Thời gian {getSortIndicator('timestamp')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.map((record, index) => (
                                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="p-3">{record.fullName}</td>
                                    <td className="p-3">{record.className}</td>
                                    <td className="p-3">{record.score}</td>
                                    <td className="p-3">{new Date(record.timestamp).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={onBack} className="mt-8 w-full bg-transparent border-2 border-slate-300 text-slate-600 hover:bg-slate-200 font-bold py-2 px-6 rounded-full transition-colors">Quay lại</button>
            </div>
         </div>
    );
};

export default TeacherDashboard;
