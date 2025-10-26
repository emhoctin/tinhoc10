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
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-4">Giải thích từ AI</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationModal;