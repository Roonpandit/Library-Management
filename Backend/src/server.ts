import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
import cors from 'cors';

// Load env vars
dotenv.config();

// CORS options
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

// Set up CORS middleware
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust this based on your needs
  credentials: true, // If you need cookies or sessions, set this to true
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
