const express = require('express');
const multer = require('multer');
const { startInterview, processResponse, analyzeInterview } = require('./services/interviewService.js');

const router = express.Router();
const upload = multer();

// Route to start interview
router.post('/start', upload.none(), (req, res) => {
    try {
        const result = startInterview(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to respond to already started interview
router.post('/respond', upload.none(), async (req, res) => {
    try {
        const result = await processResponse(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to analyse interview so far
router.post('/analyse', upload.none(), async (req, res) => {
    try {
        const result = await analyzeInterview(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
