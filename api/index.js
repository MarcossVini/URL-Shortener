// Vercel Serverless Function
const app = require('../dist/src/server.js').default;

// Handle serverless function with proper error handling
module.exports = async (req, res) => {
  try {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Ensure database connection is ready
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not configured');
    }

    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};
