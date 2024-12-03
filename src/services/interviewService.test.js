import { startInterview, processResponse, analyzeInterview } from './interviewService.js';
import { jest } from '@jest/globals';

// Only mock if USE_REAL_AI is not set to 'true'
if (process.env.USE_REAL_AI !== 'true') {
    jest.unstable_mockModule('@google/generative-ai', () => ({
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockReturnValue({
                startChat: jest.fn().mockReturnValue({
                    sendMessageStream: jest.fn().mockResolvedValue({
                        stream: [{
                            text: () => "Mock AI response"
                        }]
                    })
                })
            })
        }))
    }));
}

const jobTitle = "Full stack Developer";
const question = "Tell me about yourself.";

const expectedResult = {
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

describe('startInterview() tests', () => {
    test('should return JSON object that matches expected result', () => {
        const result = startInterview({ jobTitle });
        expect(result).toStrictEqual(expectedResult);
    });

    test('should throw error when jobTitle is missing', () => {
        expect(() => startInterview({})).toThrow('Job title is required');
    });
});

describe('processResponse() tests', () => {
    const mockHistory = [
        { role: "user", parts: [{ text: "Previous response" }] },
        { role: "model", parts: [{ text: "Previous question" }] }
    ];

    test('should process response and return next question', async () => {
        // Increase timeout for real AI
        jest.setTimeout(30000);

        const response = "I have 5 years of experience working with React, Node.js, and PostgreSQL. I've built several full-stack applications and enjoy solving complex technical challenges.";
        const result = await processResponse({ jobTitle, response, history: mockHistory });
        
        expect(result).toHaveProperty('question');
        expect(result).toHaveProperty('history');
        expect(Array.isArray(result.history)).toBe(true);
        expect(result.history.length).toBe(mockHistory.length + 2); // Added user response and model question

        if (process.env.USE_REAL_AI === 'true') {
            console.log('\nProcess Response Test:');
            console.log('Job Title:', jobTitle);
            console.log('Candidate Response:', response);
            console.log('AI Follow-up Question:', result.question);
            
            // Verify the AI's response is a question
            expect(result.question).toMatch(/[?]/); // Should end with a question mark
            expect(result.question.length).toBeGreaterThan(10); // Should be a substantial question
        }
    }, 30000);

    test('should handle initial interaction with empty history correctly', async () => {
        jest.setTimeout(30000);
        
        const initialResponse = "I am excited to interview for this position";
        const result = await processResponse({ 
            jobTitle, 
            response: initialResponse,
            history: []
        });

        // Verify the history structure
        expect(result.history).toHaveLength(2); // user response + AI response
        expect(result.history[0]).toEqual({
            role: "user",
            parts: [{ text: initialResponse }]
        });
        
        // Verify we got an AI response
        expect(result.history[1].role).toBe("model");
        expect(result.history[1].parts[0].text).toBe(result.question);
    });

    test('should maintain context in follow-up questions', async () => {
        if (process.env.USE_REAL_AI === 'true') {
            jest.setTimeout(30000);

            // First interaction
            const initialResponse = "I have 5 years of experience with React and Node.js. I've built several enterprise-level applications.";
            const firstResult = await processResponse({ 
                jobTitle, 
                response: initialResponse,
                history: [] // Empty history for first interaction
            });

            // Verify first interaction history structure
            expect(firstResult.history).toHaveLength(2);
            expect(firstResult.history[0].role).toBe("user");
            expect(firstResult.history[0].parts[0].text).toBe(initialResponse);

            // Second interaction with follow-up response
            const followUpResponse = "One of my major projects was a real-time analytics dashboard that processed millions of data points daily. I used WebSocket for live updates and implemented efficient caching strategies.";
            const secondResult = await processResponse({
                jobTitle,
                response: followUpResponse,
                history: firstResult.history
            });

            console.log('\nContext Maintenance Test:');
            console.log('Initial Response:', initialResponse);
            console.log('First AI Question:', firstResult.question);
            console.log('Follow-up Response:', followUpResponse);
            console.log('Follow-up AI Question:', secondResult.question);

            // Verify questions are different and maintain context
            expect(secondResult.question).not.toBe(firstResult.question);
            expect(secondResult.history.length).toBe(firstResult.history.length + 2);
        }
    }, 30000);

    test('should throw error when required fields are missing', async () => {
        await expect(processResponse({})).rejects.toThrow('Job title, response, and history are required');
    });
});

describe('analyzeInterview() tests', () => {
    test('should analyze interview and return analysis', async () => {
        // Increase timeout to 30 seconds for this test
        jest.setTimeout(30000);
        
        const history = process.env.USE_REAL_AI === 'true' ? [
            {
                role: "user",
                parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
            },
            {
                role: "model",
                parts: [{ text: "Tell me about your experience with full-stack development." }]
            },
            {
                role: "user",
                parts: [{ text: "I have 5 years of experience working with React, Node.js, and PostgreSQL. In my current role, I built and maintained a microservices architecture that processed over 1 million transactions daily. I also implemented CI/CD pipelines using GitHub Actions and Docker, which reduced deployment time by 60%." }]
            },
            {
                role: "model",
                parts: [{ text: "How do you handle challenging technical problems in your projects?" }]
            },
            {
                role: "user",
                parts: [{ text: "I follow a systematic approach to problem-solving. First, I break down the problem into smaller, manageable components. Then, I research existing solutions and best practices. I also collaborate with team members when needed. For example, when we faced performance issues in our application, I used performance profiling tools to identify bottlenecks, implemented caching strategies, and optimized database queries, which improved response times by 40%." }]
            }
        ] : [
            { role: "user", parts: [{ text: "My response" }] },
            { role: "model", parts: [{ text: "Next question" }] }
        ];

        const result = await analyzeInterview({ jobTitle, history });
        
        expect(result).toHaveProperty('analysis');
        expect(typeof result.analysis).toBe('string');
        
        if (process.env.USE_REAL_AI === 'true') {
            console.log('\nReal Interview History:');
            history.forEach(entry => {
                console.log(`\n${entry.role.toUpperCase()}: ${entry.parts[0].text}`);
            });
            console.log('\nAI Analysis:', result.analysis);
        }
    }, 30000); // Alternative way to set timeout just for this test

    test('should throw error when required fields are missing', async () => {
        await expect(analyzeInterview({})).rejects.toThrow('Job title and history are required');
    });
});





// const { startInterview, processResponse, analyzeInterview } = require('./interviewService');

// // Only mock if USE_REAL_AI is not set to 'true'
// if (process.env.USE_REAL_AI !== 'true') {
//     jest.mock('@google/generative-ai', () => ({
//         GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
//             getGenerativeModel: jest.fn().mockReturnValue({
//                 startChat: jest.fn().mockReturnValue({
//                     sendMessageStream: jest.fn().mockResolvedValue({
//                         stream: [{
//                             text: () => "Mock AI response"
//                         }]
//                     })
//                 })
//             })
//         }))
//     }));
// }

// const jobTitle = "Full stack Developer";
// const question = "Tell me about yourself.";

// const expectedResult = {
//     jobTitle,
//     question,
//     history: [
//         {
//             role: "user",
//             parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
//         },
//         {
//             role: "model",
//             parts: [{ text: question }]
//         }
//     ]
// };

// describe('startInterview() tests', () => {
//     test('should return JSON object that matches expected result', () => {
//         const result = startInterview({ jobTitle });
//         expect(result).toStrictEqual(expectedResult);
//     });

//     test('should throw error when jobTitle is missing', () => {
//         expect(() => startInterview({})).toThrow('Job title is required');
//     });
// });

// describe('processResponse() tests', () => {
//     const mockHistory = [
//         { role: "user", parts: [{ text: "Previous response" }] },
//         { role: "model", parts: [{ text: "Previous question" }] }
//     ];

//     test('should process response and return next question', async () => {
//         // Increase timeout for real AI
//         jest.setTimeout(30000);

//         const response = "I have 5 years of experience working with React, Node.js, and PostgreSQL. I've built several full-stack applications and enjoy solving complex technical challenges.";
//         const result = await processResponse({ jobTitle, response, history: mockHistory });
        
//         expect(result).toHaveProperty('question');
//         expect(result).toHaveProperty('history');
//         expect(Array.isArray(result.history)).toBe(true);
//         expect(result.history.length).toBe(mockHistory.length + 2); // Added user response and model question

//         if (process.env.USE_REAL_AI === 'true') {
//             console.log('\nProcess Response Test:');
//             console.log('Job Title:', jobTitle);
//             console.log('Candidate Response:', response);
//             console.log('AI Follow-up Question:', result.question);
            
//             // Verify the AI's response is a question
//             expect(result.question).toMatch(/[?]/); // Should end with a question mark
//             expect(result.question.length).toBeGreaterThan(10); // Should be a substantial question
//         }
//     }, 30000);

//     test('should handle initial interaction with empty history correctly', async () => {
//         jest.setTimeout(30000);
        
//         const initialResponse = "I am excited to interview for this position";
//         const result = await processResponse({ 
//             jobTitle, 
//             response: initialResponse,
//             history: []
//         });

//         // Verify the history structure
//         expect(result.history).toHaveLength(2); // user response + AI response
//         expect(result.history[0]).toEqual({
//             role: "user",
//             parts: [{ text: initialResponse }]
//         });
        
//         // Verify we got an AI response
//         expect(result.history[1].role).toBe("model");
//         expect(result.history[1].parts[0].text).toBe(result.question);
//     });

//     test('should maintain context in follow-up questions', async () => {
//         if (process.env.USE_REAL_AI === 'true') {
//             jest.setTimeout(30000);

//             // First interaction
//             const initialResponse = "I have 5 years of experience with React and Node.js. I've built several enterprise-level applications.";
//             const firstResult = await processResponse({ 
//                 jobTitle, 
//                 response: initialResponse,
//                 history: [] // Empty history for first interaction
//             });

//             // Verify first interaction history structure
//             expect(firstResult.history).toHaveLength(2);
//             expect(firstResult.history[0].role).toBe("user");
//             expect(firstResult.history[0].parts[0].text).toBe(initialResponse);

//             // Second interaction with follow-up response
//             const followUpResponse = "One of my major projects was a real-time analytics dashboard that processed millions of data points daily. I used WebSocket for live updates and implemented efficient caching strategies.";
//             const secondResult = await processResponse({
//                 jobTitle,
//                 response: followUpResponse,
//                 history: firstResult.history
//             });

//             console.log('\nContext Maintenance Test:');
//             console.log('Initial Response:', initialResponse);
//             console.log('First AI Question:', firstResult.question);
//             console.log('Follow-up Response:', followUpResponse);
//             console.log('Follow-up AI Question:', secondResult.question);

//             // Verify questions are different and maintain context
//             expect(secondResult.question).not.toBe(firstResult.question);
//             expect(secondResult.history.length).toBe(firstResult.history.length + 2);
//         }
//     }, 30000);

//     test('should throw error when required fields are missing', async () => {
//         await expect(processResponse({})).rejects.toThrow('Job title, response, and history are required');
//     });
// });

// describe('analyzeInterview() tests', () => {
//     test('should analyze interview and return analysis', async () => {
//         // Increase timeout to 30 seconds for this test
//         jest.setTimeout(30000);
        
//         const history = process.env.USE_REAL_AI === 'true' ? [
//             {
//                 role: "user",
//                 parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
//             },
//             {
//                 role: "model",
//                 parts: [{ text: "Tell me about your experience with full-stack development." }]
//             },
//             {
//                 role: "user",
//                 parts: [{ text: "I have 5 years of experience working with React, Node.js, and PostgreSQL. In my current role, I built and maintained a microservices architecture that processed over 1 million transactions daily. I also implemented CI/CD pipelines using GitHub Actions and Docker, which reduced deployment time by 60%." }]
//             },
//             {
//                 role: "model",
//                 parts: [{ text: "How do you handle challenging technical problems in your projects?" }]
//             },
//             {
//                 role: "user",
//                 parts: [{ text: "I follow a systematic approach to problem-solving. First, I break down the problem into smaller, manageable components. Then, I research existing solutions and best practices. I also collaborate with team members when needed. For example, when we faced performance issues in our application, I used performance profiling tools to identify bottlenecks, implemented caching strategies, and optimized database queries, which improved response times by 40%." }]
//             }
//         ] : [
//             { role: "user", parts: [{ text: "My response" }] },
//             { role: "model", parts: [{ text: "Next question" }] }
//         ];

//         const result = await analyzeInterview({ jobTitle, history });
        
//         expect(result).toHaveProperty('analysis');
//         expect(typeof result.analysis).toBe('string');
        
//         if (process.env.USE_REAL_AI === 'true') {
//             console.log('\nReal Interview History:');
//             history.forEach(entry => {
//                 console.log(`\n${entry.role.toUpperCase()}: ${entry.parts[0].text}`);
//             });
//             console.log('\nAI Analysis:', result.analysis);
//         }
//     }, 30000); // Alternative way to set timeout just for this test

//     test('should throw error when required fields are missing', async () => {
//         await expect(analyzeInterview({})).rejects.toThrow('Job title and history are required');
//     });
// });