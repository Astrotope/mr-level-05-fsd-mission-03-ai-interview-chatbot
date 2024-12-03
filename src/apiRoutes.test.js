const request = require('supertest');
const express = require('express');
const router = require('./apiRoutes');

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/', router);

// Mock the interview service functions
jest.mock('./services/interviewService', () => ({
    startInterview: jest.fn().mockImplementation((input) => ({
        jobTitle: input.jobTitle,
        question: "Tell me about yourself.",
        history: [
            {
                role: "user",
                parts: [{ text: `I am applying for the ${input.jobTitle} position. Please start the interview with your first question.` }]
            },
            {
                role: "model",
                parts: [{ text: "Tell me about yourself." }]
            }
        ]
    })),
    processResponse: jest.fn().mockImplementation((input) => ({
        jobTitle: input.jobTitle,
        question: "What are your strengths?",
        history: input.history
    })),
    analyzeInterview: jest.fn().mockImplementation((input) => ({
        analysis: "Great interview performance!"
    }))
}));

describe('API Routes', () => {
    test('POST /start should start a new interview', async () => {
        const response = await request(app)
            .post('/start')
            .send({ jobTitle: 'Software Developer' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('jobTitle', 'Software Developer');
        expect(response.body).toHaveProperty('question');
        expect(response.body).toHaveProperty('history');
    });

    test('POST /respond should handle interview response', async () => {
        const response = await request(app)
            .post('/respond')
            .send({
                jobTitle: 'Software Developer',
                response: 'I have 5 years of experience.',
                history: []
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('jobTitle');
        expect(response.body).toHaveProperty('question');
        expect(response.body).toHaveProperty('history');
    });

    test('POST /analyse should analyze the interview', async () => {
        const response = await request(app)
            .post('/analyse')
            .send({
                jobTitle: 'Software Developer',
                history: []
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('analysis');
    });
});