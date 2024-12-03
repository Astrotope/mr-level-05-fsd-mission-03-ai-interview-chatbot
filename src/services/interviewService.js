import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = process.env.GEMINI_MODEL_NAME;

function startInterview(input) {
    const { jobTitle } = input;

    if (!jobTitle) {
        throw new Error('Job title is required');
    }

    const question = "Tell me about yourself.";

    return {
        jobTitle,
        question,
        history: [
            {
                role: "user",
                parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
            },
            {
                role: "model",
                parts: [{ text: question }]
            }
        ]
    };
}

async function processResponse(input) {
    const { jobTitle, response, history } = input;

    if (!jobTitle || !response || !history) {
        throw new Error('Job title, response, and history are required');
    }

    // Configure AI model with system instructions
    const systemInstruction = `You are an interviewer for a ${jobTitle} position. 
    Your role is to:
    1. Ask relevant follow-up questions based on the candidate's responses
    2. Focus on technical skills, problem-solving abilities, and experience
    3. Maintain a professional interviewer tone
    4. Always respond with a single, clear question
    5. Do not provide feedback or advice
    
    Important: Your response should ONLY be a follow-up question. Do not include any commentary, feedback, or suggestions.`;

    const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction
    });
    
    // If this is the first interaction, initialize with opening context
    let formattedHistory = history;
    if (history.length === 0) {
        formattedHistory = [{
            role: "user",
            parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
        }];
    }
    
    // Add the current response to history
    formattedHistory = [...formattedHistory, {
        role: "user",
        parts: [{ text: response }]
    }];

    // Send the history to the model to get the next question
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessageStream(response);

    let aiResponse = "";
    for await (const chunk of result.stream) {
        aiResponse += chunk.text();
    }

    return {
        jobTitle,
        question: aiResponse,
        history: [...history, 
            { role: "user", parts: [{ text: response }] },
            { role: "model", parts: [{ text: aiResponse }] }
        ]
    };
}

async function analyzeInterview(input) {
    const { jobTitle, history } = input;

    if (!jobTitle || !history) {
        throw new Error('Job title and history are required');
    }

    // Configure AI model with system instructions
    const systemInstruction = `You are an expert interview coach analyzing an interview for a ${jobTitle} position. 
    Review the conversation and provide constructive feedback on:
    1. Technical Skills: Evaluate depth of knowledge and experience
    2. Problem-Solving: Assess approach to challenges and technical problems
    3. Communication: Analyze clarity, structure, and professionalism
    4. Experience & Examples: Evaluate the relevance and impact of shared experiences
    5. Overall Assessment: Provide a clear recommendation
    
    Be specific, reference actual responses, and provide actionable feedback.`;

    const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction
    });

    // Format history for the AI model
    const formattedHistory = history.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts }]
    }));

    // Create analysis request
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessageStream(
        "Please provide your analysis of this interview conversation."
    );

    // Capture AI's analysis
    let analysis = "";
    for await (const chunk of result.stream) {
        analysis += chunk.text();
    }

    return { analysis };
}

export { 
    startInterview,
    processResponse,
    analyzeInterview
};



// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const dotenv = require('dotenv');

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const modelName = process.env.GEMINI_MODEL_NAME;

// function startInterview(input) {
//     const { jobTitle } = input;

//     if (!jobTitle) {
//         throw new Error('Job title is required');
//     }

//     const question = "Tell me about yourself.";

//     return {
//         jobTitle,
//         question,
//         history: [
//             {
//                 role: "user",
//                 parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
//             },
//             {
//                 role: "model",
//                 parts: [{ text: question }]
//             }
//         ]
//     };
// }

// async function processResponse(input) {
//     const { jobTitle, response, history } = input;

//     if (!jobTitle || !response || !history) {
//         throw new Error('Job title, response, and history are required');
//     }

//     // Configure AI model with system instructions
//     const systemInstruction = `You are an interviewer for a ${jobTitle} position. 
//     Your role is to:
//     1. Ask relevant follow-up questions based on the candidate's responses
//     2. Focus on technical skills, problem-solving abilities, and experience
//     3. Maintain a professional interviewer tone
//     4. Always respond with a single, clear question
//     5. Do not provide feedback or advice
    
//     Important: Your response should ONLY be a follow-up question. Do not include any commentary, feedback, or suggestions.`;

//     const model = genAI.getGenerativeModel({ 
//         model: modelName,
//         systemInstruction: systemInstruction
//     });
    
//     // If this is the first interaction, initialize with opening context
//     let formattedHistory = history;
//     if (history.length === 0) {
//         formattedHistory = [{
//             role: "user",
//             parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
//         }];
//     }
    
//     // Add the current response to history
//     formattedHistory = [...formattedHistory, {
//         role: "user",
//         parts: [{ text: response }]
//     }];

//     // Send the history to the model to get the next question
//     const chat = model.startChat({ history: formattedHistory });
//     const result = await chat.sendMessageStream(response);

//     let aiResponse = "";
//     for await (const chunk of result.stream) {
//         aiResponse += chunk.text();
//     }

//     return {
//         jobTitle,
//         question: aiResponse,
//         history: [...history, 
//             { role: "user", parts: [{ text: response }] },
//             { role: "model", parts: [{ text: aiResponse }] }
//         ]
//     };
// }

// async function analyzeInterview(input) {
//     const { jobTitle, history } = input;

//     if (!jobTitle || !history) {
//         throw new Error('Job title and history are required');
//     }

//     // Configure AI model with system instructions
//     const systemInstruction = `You are an expert interview coach analyzing an interview for a ${jobTitle} position. 
//     Review the conversation and provide constructive feedback on:
//     1. Technical Skills: Evaluate depth of knowledge and experience
//     2. Problem-Solving: Assess approach to challenges and technical problems
//     3. Communication: Analyze clarity, structure, and professionalism
//     4. Experience & Examples: Evaluate the relevance and impact of shared experiences
//     5. Overall Assessment: Provide a clear recommendation
    
//     Be specific, reference actual responses, and provide actionable feedback.`;

//     const model = genAI.getGenerativeModel({ 
//         model: modelName,
//         systemInstruction: systemInstruction
//     });

//     // Format history for the AI model
//     const formattedHistory = history.map(msg => ({
//         role: msg.role === "assistant" ? "model" : msg.role,
//         parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts }]
//     }));

//     // Create analysis request
//     const chat = model.startChat({ history: formattedHistory });
//     const result = await chat.sendMessageStream(
//         "Please provide your analysis of this interview conversation."
//     );

//     // Capture AI's analysis
//     let analysis = "";
//     for await (const chunk of result.stream) {
//         analysis += chunk.text();
//     }

//     return { analysis };
// }

// module.exports = { 
//     startInterview,
//     processResponse,
//     analyzeInterview
// };