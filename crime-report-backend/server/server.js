const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reports');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api/reports', reportRoutes); // Crime report routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
