import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const modelName = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


/**
 * Process an interview interaction and return the next question
 * @param {string} jobTitle - The position being interviewed for
 * @param {Array} history - Array of previous interactions
 * @returns {Promise<string>} The AI's next question
 */
async function processInterviewInteraction(jobTitle, history = []) {
    // Configure AI to act as an interviewer
    const systemInstruction = `You are an interviewer for a ${jobTitle} position. After each response from the applicant, ask a relevant follow-up question. Do not analyze, give feedback, or provide any advice; simply ask a natural follow-up question based on the previous response. Do not include the following prefixes in your response: "[interviewer] " and "[applicant] ".`;

    const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction
    });

    // If this is the first interaction, start with an opening question
    if (history.length === 0) {
        history = [{
            role: "user",
            parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
        }];
    }

    try {
        // Format history for the AI model
        const formattedHistory = history.map(msg => ({
            role: msg.role === "assistant" ? "model" : msg.role,
            parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts }]
        }));

    // Send the history to the model to get the next question
    const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessageStream(
            formattedHistory[formattedHistory.length - 1].parts[0].text
        );

        // Capture AI's follow-up question
        let aiResponse = "";
        for await (const chunk of result.stream) {
            aiResponse += chunk.text();
        }

        return aiResponse;
    } catch (error) {
        console.error('Error in processInterviewInteraction:', error);
        throw error;
    }
}

export { processInterviewInteraction };