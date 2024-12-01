const express = require('express');
const multer = require('multer');
const { start } = require('./start');
const { respond } = require('./respond');
const { analyse } = require('./analyse');

const router = express.Router();

// Set up multer for handling form-data (no files here, just form fields)
const upload = multer(); // No storage configuration, so it will process data in memory

// Route for calculating car value
router.post('/start', upload.none(), (req, res) => {
  const result = start(req.body);  // req.body now contains form data
  res.json(result);
});

// Route for calculating risk rating
router.post('/respond', upload.none(), (req, res) => {
  const result = respond(req.body);  // req.body now contains form data
  res.json(result);
});

// Route for generating insurance quote
router.post('/analyse', upload.none(), (req, res) => {
  const result = analyse(req.body);  // req.body now contains form data
  res.json(result);
});

module.exports = router;
