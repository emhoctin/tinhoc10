import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

export const getExplanation = async (question: Question): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Cải thiện định dạng cho câu trả lời đúng để tránh lỗi dấu ngoặc kép lồng nhau.
        const correctAnswerBlock = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.map(ans => `- ${ans}`).join('\n')
            : question.correctAnswer;

        const allOptionsText = question.options.map(o => `- ${o}`).join('\n');
            
        // Tinh chỉnh lại prompt để rõ ràng và mạnh mẽ hơn.
        const prompt = `Bạn là một giáo viên Tin học lớp 10 chuyên nghiệp. Hãy cung cấp một lời giải thích cặn kẽ, rõ ràng và sư phạm cho câu hỏi trắc nghiệm dưới đây.

**Câu hỏi:**
${question.question}

**Các lựa chọn:**
${allOptionsText}

**Đáp án đúng là:**
${correctAnswerBlock}

---
**YÊU CẦU GIẢI THÍCH:**

1.  **Phân tích Kiến thức Cốt lõi:** Bắt đầu bằng việc giải thích ngắn gọn khái niệm hoặc nguyên tắc Tin học chính mà câu hỏi này đang kiểm tra.
2.  **Lý giải Đáp án Đúng:** Phân tích chi tiết tại sao các lựa chọn được đánh dấu là "đúng" lại chính xác. Hãy liên hệ trực tiếp đến kiến thức cốt lõi đã nêu.
3.  **Phân tích Các Đáp án Sai:** Giải thích ngắn gọn tại sao mỗi lựa chọn còn lại là không chính xác.
4.  **Định dạng:** Trình bày câu trả lời bằng Markdown để dễ đọc. Sử dụng **văn bản in đậm** cho các thuật ngữ quan trọng và dùng gạch đầu dòng (-) cho các danh sách.
5.  **Ngôn ngữ:** Sử dụng ngôn từ trong sáng, dễ hiểu, phù hợp với học sinh lớp 10. Chỉ tập trung vào nội dung giải thích, không thêm lời chào hay bình luận ngoài lề.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        // Kiểm tra trường hợp phản hồi rỗng (có thể xảy ra do cờ an toàn, v.v.)
        if (!response.text || response.text.trim() === '') {
            return "AI không thể tạo giải thích cho câu hỏi này. Có thể do nội dung không phù hợp hoặc đã xảy ra lỗi. Vui lòng thử câu hỏi khác.";
        }
        
        return response.text;
    } catch (error) {
        console.error("Error with Gemini API:", error);
        // Cung cấp thông báo lỗi thân thiện hơn với người dùng.
        return "Đã có lỗi xảy ra khi kết nối đến dịch vụ AI. Vui lòng kiểm tra lại kết nối mạng của bạn và thử lại sau. Nếu vấn đề tiếp diễn, có thể do cấu hình API bị lỗi.";
    }
};
