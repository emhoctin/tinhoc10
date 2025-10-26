import React from 'react';
import Loader from './Loader';

interface ExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    isLoading: boolean;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({ isOpen, onClose, explanation, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform transition-all animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 pb-1">Giải thích từ AI</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {isLoading ? <div className="flex justify-center py-8"><Loader /></div> : <div className="text-slate-700 whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2">{explanation}</div>}
            </div>
        </div>
    );
};

export default ExplanationModal;