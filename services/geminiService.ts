
import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

export const getExplanation = async (question: Question): Promise<string> => {
    const apiKey = window.prompt("Để nhận giải thích từ AI, vui lòng cung cấp Gemini API Key của bạn:");
    if (!apiKey) {
        return "Vui lòng cung cấp API Key để sử dụng tính năng này. Bạn có thể lấy key tại Google AI Studio.";
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
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
        return "Đã có lỗi xảy ra khi gọi API. Vui lòng kiểm tra lại API Key của bạn và đảm bảo nó chính xác và đã được kích hoạt.";
    }
};
