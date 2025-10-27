import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

export const getExplanation = async (question: Question): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const correctAnswerText = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.join('", "') 
            : question.correctAnswer;

        const allOptionsText = question.options.map(o => `- ${o}`).join('\n');
            
        const prompt = `Bạn là một giáo viên Tin học lớp 10. Hãy giải thích cặn kẽ, rõ ràng và dễ hiểu cho học sinh tại sao đáp án đúng cho câu hỏi trắc nghiệm sau đây là "${correctAnswerText}".

Câu hỏi: "${question.question}"

Các lựa chọn:
${allOptionsText}

Đáp án đúng: "${correctAnswerText}"

**Yêu cầu giải thích:**
1.  **Phân tích kiến thức:** Bắt đầu bằng việc phân tích kiến thức cốt lõi liên quan đến câu hỏi.
2.  **Giải thích đáp án đúng:** Trình bày chi tiết tại sao lựa chọn "${correctAnswerText}" là câu trả lời chính xác.
3.  **Phân tích các đáp án sai:** Giải thích ngắn gọn lý do tại sao mỗi lựa chọn còn lại là không chính xác.
4.  **Trình bày:** Sử dụng ngôn ngữ sư phạm, phù hợp với học sinh lớp 10. Định dạng câu trả lời bằng Markdown (ví dụ: dùng **để in đậm**, dùng - cho gạch đầu dòng) để dễ đọc.
5.  **Phạm vi:** Chỉ tập trung vào nội dung giải thích, không thêm lời chào hay bất kỳ bình luận ngoài lề nào.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error with Gemini API:", error);
        return "Đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại sau.";
    }
};