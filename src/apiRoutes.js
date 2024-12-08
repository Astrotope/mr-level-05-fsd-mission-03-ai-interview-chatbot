const express = require('express');
const multer = require('multer');
const { startInterview, handleResponse, analyzeInterview } = require('./services/interviewService.js');

const router = express.Router();

// Set up multer for handling form-data (no files here, just form fields)
const upload = multer(); // No storage configuration, so it will process data in memory

// Route to start interview
router.post('/start', upload.none(), async (req, res) => {
    try {
        console.log('Starting interview for job title:', req.body.jobTitle);
        const result = await startInterview(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error in /start route:', error);
        res.status(400).json({ 
            error: error.message,
            details: 'Error occurred while starting the interview'
        });
    }
});

// Route to handle candidate response
router.post('/respond', upload.none(), async (req, res) => {
    try {
        console.log('Processing candidate response');
        const result = await handleResponse(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error in /respond route:', error);
        res.status(400).json({ error: error.message });
    }
});

// Route to analyze interview
router.post('/analyse', upload.none(), async (req, res) => {
    try {
        console.log('Analyzing interview');
        const result = await analyzeInterview(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error in /analyse route:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
