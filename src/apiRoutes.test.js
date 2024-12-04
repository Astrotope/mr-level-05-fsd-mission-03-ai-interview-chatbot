import request from 'supertest';
import express from 'express';
import router from './apiRoutes.js';
import * as interviewService from './services/interviewService.js';
import { jest } from '@jest/globals';

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/', router);

// Mock the interview service functions using spyOn
jest.spyOn(interviewService, 'startInterview').mockImplementation((input) => ({
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
}));

jest.spyOn(interviewService, 'processResponse').mockImplementation((input) => ({
    jobTitle: input.jobTitle,
    question: "What are your strengths?",
    history: input.history
}));

jest.spyOn(interviewService, 'analyzeInterview').mockImplementation((input) => ({
    analysis: "Great interview performance!"
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

describe('Error Handling', () => {
    test('POST /start should return 400 when jobTitle is missing', async () => {
        const response = await request(app)
            .post('/start')
            .send({});
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('POST /respond should return 400 when required fields are missing', async () => {
        // Missing jobTitle
        let response = await request(app)
            .post('/respond')
            .send({
                response: 'test',
                history: []
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');

        // Missing response
        response = await request(app)
            .post('/respond')
            .send({
                jobTitle: 'test',
                history: []
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');

        // Missing history
        response = await request(app)
            .post('/respond')
            .send({
                jobTitle: 'test',
                response: 'test'
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('POST /analyse should return 400 when required fields are missing', async () => {
        // Missing jobTitle
        let response = await request(app)
            .post('/analyse')
            .send({
                history: []
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');

        // Missing history
        response = await request(app)
            .post('/analyse')
            .send({
                jobTitle: 'test'
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('Routes should handle service errors', async () => {
        // Mock service to throw error
        const mockError = new Error('Service error');
        interviewService.startInterview.mockImplementationOnce(() => {
            throw mockError;
        });

        const response = await request(app)
            .post('/start')
            .send({ jobTitle: 'test' });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', mockError.message);
    });
});
