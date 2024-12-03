import express from 'express';
import { startInterview, processResponse, analyzeInterview } from './services/interviewService.js';

const router = express.Router();

// Route to start interview
router.post('/start', (req, res) => {
    try {
        if (!req.body.jobTitle) {
            throw new Error('Job title is required');
        }
        const result = startInterview({ jobTitle: req.body.jobTitle });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to respond to already started interview
router.post('/respond', async (req, res) => {
    try {
        const { jobTitle, response, history } = req.body;
        if (!jobTitle || !response || !history) {
            throw new Error('Job title, response, and history are required');
        }
        const result = await processResponse({ jobTitle, response, history });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to analyse interview so far
router.post('/analyse', async (req, res) => {
    try {
        const { jobTitle, history } = req.body;
        if (!jobTitle || !history) {
            throw new Error('Job title and history are required');
        }
        const result = await analyzeInterview({ jobTitle, history });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
