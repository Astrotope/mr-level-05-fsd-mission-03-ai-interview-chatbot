const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');

const app = express();
const PORT = process.env.PORT || 5567;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', apiRoutes);

// Conditionally start the server only if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export the app, not the server instance
module.exports = app;
