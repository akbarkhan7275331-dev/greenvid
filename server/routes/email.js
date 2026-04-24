const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE_NAME || 'Emails';

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    // Airtable not configured — still return success so UX isn't broken
    console.log('Email collected (Airtable not configured):', email);
    return res.json({ success: true });
  }

  try {
    await axios.post(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
      {
        fields: {
          Email: email,
          Source: 'GreenVID Paywall',
          Date: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Airtable error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to save email' });
  }
});

module.exports = router;
