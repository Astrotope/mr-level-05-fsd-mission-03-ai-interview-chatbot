import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './apiRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5567;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Conditionally start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

export default app;


// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5567;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api', require('./apiRoutes'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });

// // Conditionally start the server
// if (process.env.NODE_ENV !== 'test') {
//     app.listen(PORT, () => {
//         console.log(`Server running at http://localhost:${PORT}`);
//     });
// }

// module.exports = app;

// const express = require('express');
// const { startInterview, processResponse, analyzeInterview } = require('./services/interviewService.js');

// const router = express.Router();

// // Route to start interview
// router.post('/start', (req, res) => {
//     try {
//         if (!req.body.jobTitle) {
//             throw new Error('Job title is required');
//         }
//         const result = startInterview({ jobTitle: req.body.jobTitle });
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Route to respond to already started interview
// router.post('/respond', async (req, res) => {
//     try {
//         const { jobTitle, response, history } = req.body;
//         if (!jobTitle || !response || !history) {
//             throw new Error('Job title, response, and history are required');
//         }
//         const result = await processResponse({ jobTitle, response, history });
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Route to analyse interview so far
// router.post('/analyse', async (req, res) => {
//     try {
//         const { jobTitle, history } = req.body;
//         if (!jobTitle || !history) {
//             throw new Error('Job title and history are required');
//         }
//         const result = await analyzeInterview({ jobTitle, history });
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// module.exports = router;


// const express = require('express');
// const multer = require('multer');
// const { startInterview, processResponse, analyzeInterview } = require('./services/interviewService.js');

// const router = express.Router();
// const upload = multer();

// // Route to start interview
// router.post('/start', upload.none(), (req, res) => {
//     try {
//         if (!req.body.jobTitle) {
//             throw new Error('Job title is required');
//         }
//         const result = startInterview({ jobTitle: req.body.jobTitle });
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Route to respond to already started interview
// router.post('/respond', upload.none(), async (req, res) => {
//     try {
//         const { jobTitle, response, history } = req.body;
//         if (!jobTitle || !response || !history) {
//             throw new Error('Job title, response, and history are required');
//         }
//         const result = await processResponse({ jobTitle, response, history });
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Route to analyse interview so far
// router.post('/analyse', upload.none(), async (req, res) => {
//     try {
//         const { jobTitle, history } = req.body;
//         if (!jobTitle || !history) {
//             throw new Error('Job title and history are required');
//         }
//         const result = await analyzeInterview({ jobTitle, history });
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// module.exports = router;