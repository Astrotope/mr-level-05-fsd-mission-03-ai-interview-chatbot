// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const apiRoutes = require('./apiRoutes');

// const app = express();
// const PORT = process.env.PORT || 5567;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Routes
// app.use('/api', apiRoutes);

// // Conditionally start the server only if we're not in a test environment
// if (process.env.NODE_ENV !== 'test') {
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });
// }

// // Export the app, not the server instance
// module.exports = app;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5567;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', require('./apiRoutes'));

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

module.exports = app;
