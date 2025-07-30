// Vercel Serverless Function
const app = require('../dist/src/server.js').default;

module.exports = (req, res) => {
  return app(req, res);
};
