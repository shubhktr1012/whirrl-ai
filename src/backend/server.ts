// Importing the express library to create a web server
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
// Importing the cors library to allow cross-origin requests
import cors from 'cors';
// Importing 'dotenv/config' to manage environment variables
import 'dotenv/config';
// Importing the upload router for handling file uploads
import uploadRoutes from './routes/upload';

import "./jobs/gifQueue";


// Creating an instance of an express application
const app = express();
// Setting the port number for the server, using the value from environment variables or defaulting to 5000
const PORT = process.env.PORT || 5000;

// Middleware to enable CORS and allow requests from different origins
app.use(cors());
app.use(cors({ origin: '*' }));

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Welcome to Whirrl.ai Backend API!');
});

// Setting up the route for handling API requests, using the upload router
//Code to routes/upload.ts
app.use('/api', uploadRoutes);

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('🔥 Server Error:', {
    message: err.message,
    stack: err.stack,
    status: res.statusCode || 500,
  });
  
  res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

// Starting the server and listening on the specified port
app.listen(PORT, () => {
    // Logging a message to the console to indicate the server is running
    console.log('🚀 Server is running on:');
    console.log(`   ➜ Local:   http://localhost:${PORT}`);
    console.log(`   ➜ API Endpoint: http://localhost:${PORT}/api`);

});
