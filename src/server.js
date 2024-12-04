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
