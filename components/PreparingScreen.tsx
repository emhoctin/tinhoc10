import React from 'react';
import Loader from './Loader';

const PreparingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-4 text-center animate-fade-in">
      <Loader />
      <h2 className="text-2xl font-bold text-blue-600 mt-6">Đang chuẩn bị bộ câu hỏi mới...</h2>
      <p className="text-slate-600 mt-2">Chúc bạn may mắn!</p>
    </div>
  );
};

export default PreparingScreen;