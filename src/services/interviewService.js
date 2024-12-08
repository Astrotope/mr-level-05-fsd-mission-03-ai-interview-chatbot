const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

let chat;

/**
 * Creates the initial system prompt for the interview
 * @param {string} jobTitle - The position being applied for
 * @returns {string} The system prompt
 */
function createSystemPrompt(jobTitle) {
    return `You are an experienced job interviewer conducting an interview for the position of ${jobTitle}. 
    Follow these rules:
    1. Ask one question at a time
    2. Start with "Tell me about yourself"
    3. Based on the candidate's responses, ask relevant follow-up questions
    4. Focus on their experience, skills, and suitability for the ${jobTitle} role
    5. After 6 or more questions, provide a detailed evaluation of their interview performance and suggestions for improvement
    6. Keep responses concise and professional
    7. Do not mention that you are an AI`;
}

/**
 * Starts a new interview session with initial question
 * @param {Object} input - The input object containing jobTitle
 * @param {string} input.jobTitle - The position being applied for
 * @returns {Object} Interview session data including question and chat history
 */
async function startInterview(input) {
    const { jobTitle } = input;

    if (!jobTitle) {
        throw new Error('Please provide the position you are interviewing for');
    }

    // Initialize chat
    chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [createSystemPrompt(jobTitle)],
            },
        ],
    });

    // Get initial response
    const result = await chat.sendMessage("Start the interview with 'Tell me about yourself'");
    const response = result.response.text();

    return {
        jobTitle,
        question: response,
        history: [
            {
                role: 'system',
                content: 'Interview started'
            },
            {
                role: 'assistant',
                content: response
            }
        ]
    };
}

/**
 * Handles candidate's response and generates next question
 * @param {Object} input - The input object
 * @param {string} input.response - Candidate's response
 * @returns {Object} Next question and updated history
 */
async function handleResponse(input) {
    const { response } = input;

    if (!response) {
        throw new Error('Please provide your response');
    }

    if (!chat) {
        throw new Error('Interview has not been started');
    }

    const result = await chat.sendMessage(response);
    const aiResponse = result.response.text();

    return {
        question: aiResponse,
        history: [
            {
                role: 'user',
                content: response
            },
            {
                role: 'assistant',
                content: aiResponse
            }
        ]
    };
}

/**
 * Analyzes the interview progress
 * @param {Object} input - The input object
 * @param {Array} input.history - Chat history
 * @returns {Object} Analysis of the interview
 */
async function analyzeInterview(input) {
    const { history } = input;

    if (!history || !Array.isArray(history)) {
        throw new Error('Invalid chat history provided');
    }

    const prompt = `Based on this interview conversation, provide a brief analysis of:
    1. The candidate's strengths
    2. Areas for improvement
    3. Overall interview performance
    
    Chat history:
    ${JSON.stringify(history)}`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return {
        analysis
    };
}

module.exports = { startInterview, handleResponse, analyzeInterview };
