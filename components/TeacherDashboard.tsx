import React, { useState, useEffect, useMemo } from 'react';
import { getAllRecords } from '../services/gameService';
import type { ScoreRecord } from '../types';

interface TeacherDashboardProps {
  onBack: () => void;
}

type SortKey = 'fullName' | 'className' | 'score' | 'timestamp';
type SortDirection = 'asc' | 'desc';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
    const [records, setRecords] = useState<ScoreRecord[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>('timestamp');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    useEffect(() => {
        setRecords(getAllRecords());
    }, []);

    const sortedRecords = useMemo(() => {
        return [...records].sort((a, b) => {
            if (a[sortKey] < b[sortKey]) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (a[sortKey] > b[sortKey]) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [records, sortKey, sortDirection]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const SortableHeader: React.FC<{ headerKey: SortKey; children: React.ReactNode }> = ({ headerKey, children }) => (
        <th className="p-3 cursor-pointer select-none" onClick={() => handleSort(headerKey)}>
            {children} {sortKey === headerKey && (sortDirection === 'desc' ? '▼' : '▲')}
        </th>
    );

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl w-full animate-fade-in-scale">
                <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">Bảng điều khiển của Giáo viên</h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-200 text-slate-600">
                            <tr>
                                <SortableHeader headerKey="fullName">Họ và Tên</SortableHeader>
                                <SortableHeader headerKey="className">Lớp</SortableHeader>
                                <SortableHeader headerKey="score">Điểm (XP)</SortableHeader>
                                <SortableHeader headerKey="timestamp">Thời gian</SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sortedRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-slate-100">
                                    <td className="p-3">{record.fullName}</td>
                                    <td className="p-3">{record.className}</td>
                                    <td className="p-3 font-mono text-blue-600">{record.score}</td>
                                    <td className="p-3 text-sm text-slate-500">{new Date(record.timestamp).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {records.length === 0 && <p className="text-center text-slate-500 mt-4">Chưa có dữ liệu nào.</p>}

                 <button
                    onClick={onBack}
                    className="block mx-auto mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default TeacherDashboard;