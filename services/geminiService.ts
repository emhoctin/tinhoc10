import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

export const getExplanation = async (question: Question): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("Gemini API key is not set in environment variables.");
        return "Lỗi cấu hình: API Key cho dịch vụ AI chưa được thiết lập. Vui lòng liên hệ quản trị viên để khắc phục.";
    }
    
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
        if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API key is missing"))) {
             return "API Key không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ quản trị viên để kiểm tra lại.";
        }
        return "Đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại sau.";
    }
};