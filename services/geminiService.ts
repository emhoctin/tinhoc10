import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

export const getExplanation = async (question: Question): Promise<string> => {
    const correctAnswerText = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer.join('", "') 
        : question.correctAnswer;

    const prompt = `
      Hãy giải thích một cách đơn giản, dễ hiểu bằng tiếng Việt tại sao đáp án đúng cho câu hỏi trắc nghiệm sau đây lại là "${correctAnswerText}".
      
      Câu hỏi: "${question.question}"
      
      Các lựa chọn:
      ${question.options.join('\n')}
      
      Chỉ tập trung vào việc giải thích (các) đáp án đúng, không cần phân tích các đáp án sai.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching explanation from Gemini API:", error);
        return "Rất tiếc, đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại sau.";
    }
};
