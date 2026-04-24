const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash — free tier, stable model (April 2026)
const MODEL = 'gemini-2.5-flash';

async function analyzeWithGemini(data, type) {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = buildPrompt(data, type);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

  return JSON.parse(jsonMatch[0]);
}

async function analyzeThumbnail(imageUrl) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `Analyze this YouTube thumbnail image for policy violations. Return ONLY a JSON object with:
{
  "risk_score": <1-10>,
  "issues": ["list of issues found"],
  "summary": "one sentence summary"
}
Check for: violent content, sexual content, misleading clickbait, shocking imagery, inappropriate text.`;

    const imageData = await fetchImageAsBase64(imageUrl);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      },
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { risk_score: 1, issues: [], summary: 'No issues detected' };

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn('Thumbnail analysis skipped:', err.message);
    return { risk_score: 1, issues: [], summary: 'Thumbnail analysis unavailable' };
  }
}

async function fetchImageAsBase64(url) {
  const axios = require('axios');
  const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 });
  return Buffer.from(response.data).toString('base64');
}

function buildPrompt(data, type) {
  const structure = `{
  "overall_score": <number 1-10>,
  "summary": "<one paragraph plain English summary like a doctor giving a diagnosis>",
  "copyright_risk": { "score": <1-10>, "explanation": "<2 sentences>", "fix_tip": "<1 sentence>" },
  "community_guidelines": { "score": <1-10>, "explanation": "<2 sentences>", "fix_tip": "<1 sentence>" },
  "inauthentic_content": { "score": <1-10>, "explanation": "<2 sentences>", "fix_tip": "<1 sentence>" },
  "circumvention_policy": { "score": <1-10>, "explanation": "<2 sentences>", "fix_tip": "<1 sentence>" },
  "misleading_content": { "score": <1-10>, "explanation": "<2 sentences>", "fix_tip": "<1 sentence>" },
  "advertiser_friendliness": { "score": <1-10>, "explanation": "<2 sentences>", "fix_tip": "<1 sentence>" }
}`;

  if (type === 'video') {
    return `You are a YouTube policy expert. Analyze this video data and return ONLY a valid JSON object — no markdown, no extra text.

VIDEO DATA:
Title: ${data.title}
Description: ${(data.description || '').slice(0, 500)}
Tags: ${(data.tags || []).join(', ')}
Duration: ${data.duration}
Age Restricted: ${data.ageRestricted}
Made For Kids: ${data.madeForKids}
View Count: ${data.viewCount}
Like Count: ${data.likeCount}
Comment Count: ${data.commentCount}
Transcript Sample: ${data.transcript || 'Not available'}
Top Comments: ${(data.comments || []).slice(0, 10).join(' | ')}
Thumbnail Analysis: ${JSON.stringify(data.thumbnailAnalysis)}

Return this exact JSON structure:
${structure}`;
  } else {
    return `You are a YouTube policy expert. Analyze this channel data and return ONLY a valid JSON object — no markdown, no extra text.

CHANNEL DATA:
Name: ${data.name}
Description: ${(data.description || '').slice(0, 500)}
Subscriber Count: ${data.subscriberCount}
Video Count: ${data.videoCount}
Total Views: ${data.viewCount}
Age Restricted Videos: ${data.ageRestrictedCount}
Recent Video Titles: ${(data.recentVideos || []).map((v) => v.title).join(' | ')}
Thumbnail Analysis: ${JSON.stringify(data.thumbnailAnalysis)}

Return this exact JSON structure:
${structure}`;
  }
}

module.exports = { analyzeWithGemini, analyzeThumbnail };
