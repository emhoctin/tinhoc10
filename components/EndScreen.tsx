import React from 'react';

interface EndScreenProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, correctCount, totalQuestions, onRestart, onViewLeaderboard }) => {
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let feedbackMessage = "";
  if (percentage >= 80) {
    feedbackMessage = "Xuất sắc! Bạn thật sự là một chuyên gia Tin học.";
  } else if (percentage >= 50) {
    feedbackMessage = "Làm tốt lắm! Hãy tiếp tục ôn tập để đạt kết quả cao hơn nhé.";
  } else {
    feedbackMessage = "Đừng lo lắng! Chơi lại để củng cố kiến thức nào.";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-4 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in-scale">
        <h2 className="text-4xl font-bold text-blue-600 mb-4">Hoàn thành!</h2>
        <p className="text-xl text-slate-600 mb-2">Bạn trả lời đúng:</p>
        <p className="text-6xl font-bold text-slate-800 mb-2">
          {correctCount} / {totalQuestions}
        </p>
         <p className="text-2xl font-bold text-blue-600 mb-6">
          Điểm nhận được: {score} XP
        </p>
        <p className="text-lg text-slate-500 mb-8">{feedbackMessage}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
            >
            Chơi lại
            </button>
            <button
            onClick={onViewLeaderboard}
            className="bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-800 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
            >
            Bảng xếp hạng
            </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;