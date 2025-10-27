import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

export const getExplanation = async (question: Question): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const correctAnswerText = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.join('", "') 
            : question.correctAnswer;
            
        const prompt = `Hãy giải thích ngắn gọn, dễ hiểu bằng tiếng Việt cho học sinh lớp 10, tại sao đáp án đúng cho câu hỏi trắc nghiệm: "${question.question}" lại là "${correctAnswerText}". Chỉ tập trung vào giải thích, không thêm lời chào hay giới thiệu.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error with Gemini API:", error);
        if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API key is missing") || error.message.includes("API_KEY_INVALID"))) {
             return "**Lỗi Cấu Hình API Key**\n\nKhông tìm thấy API Key của Google AI. Vui lòng thực hiện các bước sau để cấu hình:\n\n1.  Trên giao diện của nền tảng (ví dụ: AI Studio), tìm và nhấn vào biểu tượng **\"Secrets\"** (Quản lý bí mật) hoặc **\"Bảng điều khiển\"**.\n2.  Trong mục **API Key**, hãy chắc chắn rằng bạn đã chọn một API Key hợp lệ cho dự án này.\n3.  Nếu chưa có, bạn có thể tạo một Key mới.\n\nSau khi cấu hình xong, hãy thử lại. Nếu vẫn gặp lỗi, vui lòng làm mới trang.";
        }
        return "Đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại sau.";
    }
};