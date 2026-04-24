# GreenVID — YouTube Policy Health Checker

**GreenVID** helps YouTube creators instantly know if their channel or video is at risk of being flagged, demonetized, or terminated by YouTube — before YouTube acts on it.

## Features

- **Instant Analysis**: Paste any YouTube URL (channel or video) and get a policy health report in seconds
- **AI-Powered**: Uses Google Gemini 1.5 Flash for deep content analysis
- **6 Risk Categories**: Copyright, Community Guidelines, Inauthentic Content, Circumvention, Misleading Content, Advertiser Friendliness
- **Thumbnail Scanning**: AI vision analysis detects policy violations in thumbnails
- **Transcript Analysis**: Reads video captions to detect problematic content
- **Bilingual**: Full English and Urdu support
- **Free Tier**: 3 free checks per device, no account needed
- **Dark Theme**: Professional, modern UI inspired by diagnostic tools

## Tech Stack

### Backend
- Node.js + Express
- YouTube Data API v3 (free)
- Google Gemini 1.5 Flash API (free)
- youtube-transcript package
- Airtable API (optional, for email collection)

### Frontend
- React
- Tailwind-inspired custom CSS
- DM Sans font
- localStorage for free check tracking

## Setup Instructions

### 1. Get Your API Keys (All Free)

#### YouTube Data API v3
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project called "GreenVID"
3. Go to "Enable APIs" and search for "YouTube Data API v3"
4. Enable it
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy the key

**Free quota**: 10,000 units per day

#### Google Gemini API
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Click "Get API Key" → "Create API Key"
4. Copy the key

**Free tier**: Gemini 1.5 Flash — 15 requests/minute, 1M tokens/day

#### Airtable (Optional)
1. Go to [airtable.com](https://airtable.com)
2. Create a free account
3. Create a base called "GreenVID"
4. Create a table called "Emails" with fields: Email (single line text), Source (single line text), Date (date)
5. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
6. Create a personal access token with `data.records:write` scope
7. Copy the token and your base ID (from the base URL)

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
AIRTABLE_API_KEY=your_airtable_token_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=Emails
PORT=3001
```

### 4. Run the Application

#### Development Mode (Both servers)
```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:3001`
- React frontend on `http://localhost:3000`

#### Production Mode
```bash
# Start backend only
npm start

# Build and serve frontend separately
cd client
npm run build
# Serve the build folder with your preferred static server
```

## How It Works

### Analysis Flow

1. **URL Parsing**: Detects if input is a channel or video URL
2. **Data Fetching**: 
   - For videos: metadata, transcript, comments, thumbnail
   - For channels: metadata, recent 10 videos, thumbnails
3. **Thumbnail Analysis**: Gemini Vision scans images for policy violations
4. **AI Analysis**: Gemini 1.5 Flash analyzes all data and returns structured JSON with:
   - Overall risk score (1-10)
   - Plain English summary
   - 6 category scores with explanations and fix tips
5. **Results Display**: Color-coded gauge, expandable sections, actionable insights

### Free Check System

- Uses `localStorage` to track checks per device
- 3 free checks allowed
- After 3rd check, paywall appears
- Email collection for waitlist (stored in Airtable)

### Scoring System

- **1-3 (Green)**: Safe — Low risk
- **4-6 (Yellow)**: Caution — Moderate risk
- **7-10 (Red)**: High Risk — Serious policy concerns

## API Endpoints

### `POST /api/analyze`
Analyzes a YouTube URL

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "type": "video",
  "meta": {
    "id": "...",
    "title": "...",
    "thumbnail": "...",
    "viewCount": "...",
    ...
  },
  "analysis": {
    "overall_score": 5,
    "summary": "...",
    "copyright_risk": {
      "score": 7,
      "explanation": "...",
      "fix_tip": "..."
    },
    ...
  }
}
```

### `POST /api/email`
Collects email for waitlist

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true
}
```

## Project Structure

```
greenvid/
├── server/
│   ├── index.js              # Express server
│   ├── routes/
│   │   ├── analyze.js        # Analysis endpoint
│   │   └── email.js          # Email collection
│   └── utils/
│       ├── urlParser.js      # YouTube URL parser
│       ├── youtube.js        # YouTube API wrapper
│       ├── transcript.js     # Transcript fetcher
│       └── gemini.js         # Gemini AI integration
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js            # Main app logic
│       ├── i18n.js           # Translations (EN/UR)
│       ├── components/
│       │   ├── Logo.js
│       │   └── LangToggle.js
│       └── pages/
│           ├── HomePage.js
│           ├── LoadingPage.js
│           ├── ResultsPage.js
│           └── PaywallPage.js
├── package.json
├── .env.example
└── README.md
```

## Deployment

### Replit (Recommended)
1. Import this repo to Replit
2. Add secrets in Replit Secrets panel (same as .env variables)
3. Run `npm install && cd client && npm install && npm run build && cd ..`
4. Start with `npm start`
5. Serve client build folder as static files

### Other Platforms
- **Backend**: Deploy to Heroku, Railway, Render, or any Node.js host
- **Frontend**: Build with `npm run build` and deploy to Vercel, Netlify, or Cloudflare Pages

## Customization

### Change Free Check Limit
Edit `MAX_FREE_CHECKS` in `client/src/App.js`

### Modify Scoring Logic
Edit prompts in `server/utils/gemini.js`

### Add More Languages
Add translations to `client/src/i18n.js`

### Adjust UI Colors
Edit CSS variables in `client/src/index.css`

## Troubleshooting

### "Invalid YouTube URL" Error
- Make sure the URL is a valid YouTube channel or video link
- Supported formats:
  - `youtube.com/watch?v=VIDEO_ID`
  - `youtu.be/VIDEO_ID`
  - `youtube.com/channel/CHANNEL_ID`
  - `youtube.com/@HANDLE`
  - `youtube.com/c/CUSTOM_NAME`
  - `youtube.com/user/USERNAME`

### "Analysis failed" Error
- Check that your API keys are correctly set in `.env`
- Verify YouTube API quota hasn't been exceeded (check Google Cloud Console)
- Check Gemini API rate limits (15 requests/minute)

### Transcript Not Available
- Some videos have transcripts disabled — this is normal
- Analysis will continue without transcript data

### Thumbnail Analysis Fails
- Gemini Vision may occasionally fail — analysis continues with other data
- Check that thumbnail URLs are accessible

## License

MIT License — Free to use and modify

## Credits

Built with ❤️ for YouTube creators who want to stay safe and compliant.

---

**Note**: GreenVID is an independent tool and is not affiliated with YouTube or Google. Analysis results are AI-generated suggestions and should not be considered legal advice.
