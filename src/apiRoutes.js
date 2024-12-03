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

// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const { startInterview } = require('./services/interviewService.js');
// const { respond } = require('./respond');
// const { analyse } = require('./analyse');

// const router = express.Router();

// // Set up multer for handling form-data (no files here, just form fields)
// const upload = multer(); // No storage configuration, so it will process data in memory

// // Route to start interview
// router.post('/start', upload.none(), (req, res) => {
//     try {
//         const result = startInterview(req.body);
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Route to respond to already started interview
// router.post('/respond', upload.none(), (req, res) => {
//   const result = respond(req.body);  // req.body now contains form data
//   res.json(result);
// });

// // Route to analyse interview so far
// router.post('/analyse', upload.none(), (req, res) => {
//   const result = analyse(req.body);  // req.body now contains form data
//   res.json(result);
// });

// module.exports = router;