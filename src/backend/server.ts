// Importing the express library to create a web server
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
// Importing the cors library to allow cross-origin requests
import cors from 'cors';
// Importing 'dotenv/config' to manage environment variables
import 'dotenv/config';
// Importing the upload router for handling file uploads
import uploadRoutes from './routes/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';
import "./jobs/gifQueue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creating an instance of an express application
const app = express();
// Setting the port number for the server, using the value from environment variables or defaulting to 5000
const PORT = process.env.PORT || 5000;

// Detailed request logging middleware - MUST be first
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('\n=== Incoming Request ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Log response headers after they're set
  res.on('finish', () => {
    console.log('\n=== Response Sent ===');
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.getHeaders(), null, 2));
    console.log('==================\n');
  });
  
  next();
});

// Temporarily allow all origins for debugging
app.use(cors({
  origin: 'http://localhost:5173', // Specific origin instead of *
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Global OPTIONS handler
app.options('*', cors());

// Explicit OPTIONS handler for upload endpoint with detailed logging
app.options('/api/upload', (req: Request, res: Response) => {
  console.log('\n=== Handling OPTIONS Preflight for /api/upload ===');
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
  
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Max-Age', '3600');
  
  console.log('Response Headers:', JSON.stringify(res.getHeaders(), null, 2));
  res.sendStatus(204);
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Welcome to Whirrl.ai Backend API!');
});

// Mount routes
app.use('/api', uploadRoutes);

const gifsDirectory = path.join(process.cwd(), 'gifs'); // 
app.use('/gifs', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  next();
}, express.static(gifsDirectory));
console.log(` Serving GIFs from: ${gifsDirectory}`);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api`);
});
