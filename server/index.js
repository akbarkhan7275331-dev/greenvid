require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRouter = require('./routes/analyze');
const emailRouter = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/analyze', analyzeRouter);
app.use('/api/email', emailRouter);
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }));

// Serve React build — always try, fallback gracefully
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.status(200).json({ message: 'GreenVID API running. Frontend not built yet.' });
  });
});

app.listen(PORT, () => {
  console.log(`GreenVID server running on port ${PORT}`);
});
