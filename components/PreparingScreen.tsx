import React from 'react';
import Loader from './Loader';

const PreparingScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center animate-fade-in">
            <Loader />
            <p className="text-sky-700 font-semibold mt-4 text-xl">Đang chuẩn bị câu hỏi ngẫu nhiên...</p>
        </div>
    );
};

export default PreparingScreen;