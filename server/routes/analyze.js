const express = require('express');
const router = express.Router();
const { parseYouTubeUrl } = require('../utils/urlParser');
const { getVideoData, getChannelData } = require('../utils/youtube');
const { getTranscript } = require('../utils/transcript');
const { analyzeWithGemini, analyzeThumbnail } = require('../utils/gemini');

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const parsed = parseYouTubeUrl(url);
  if (!parsed) {
    return res.status(400).json({ error: 'Invalid YouTube URL. Please paste a valid YouTube channel or video link.' });
  }

  try {
    if (parsed.type === 'video') {
      // Step 1: Fetch video metadata
      const videoData = await getVideoData(parsed.id);

      // Step 2: Fetch transcript
      const transcript = await getTranscript(parsed.id);
      videoData.transcript = transcript;

      // Step 3: Analyze thumbnail
      const thumbnailAnalysis = videoData.thumbnail
        ? await analyzeThumbnail(videoData.thumbnail)
        : { risk_score: 1, issues: [], summary: 'No thumbnail' };
      videoData.thumbnailAnalysis = thumbnailAnalysis;

      // Step 4: Run full Gemini analysis
      const analysis = await analyzeWithGemini(videoData, 'video');

      return res.json({
        type: 'video',
        meta: {
          id: videoData.id,
          title: videoData.title,
          thumbnail: videoData.thumbnail,
          channelTitle: videoData.channelTitle,
          viewCount: videoData.viewCount,
          likeCount: videoData.likeCount,
          publishedAt: videoData.publishedAt,
        },
        analysis,
      });
    } else {
      // Step 1: Fetch channel metadata
      const channelData = await getChannelData(parsed.id, parsed.isHandle);

      // Step 2: Analyze thumbnails of recent videos
      const thumbnailResults = await Promise.allSettled(
        channelData.recentVideos.slice(0, 3).map((v) =>
          v.thumbnail ? analyzeThumbnail(v.thumbnail) : Promise.resolve({ risk_score: 1 })
        )
      );
      const thumbnailAnalysis = thumbnailResults
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
      channelData.thumbnailAnalysis = thumbnailAnalysis;

      // Step 3: Run full Gemini analysis
      const analysis = await analyzeWithGemini(channelData, 'channel');

      return res.json({
        type: 'channel',
        meta: {
          id: channelData.id,
          name: channelData.name,
          thumbnail: channelData.thumbnail,
          subscriberCount: channelData.subscriberCount,
          videoCount: channelData.videoCount,
          viewCount: channelData.viewCount,
        },
        analysis,
      });
    }
  } catch (err) {
    console.error('Analysis error:', err.message);
    const msg = err.message || 'Analysis failed';
    return res.status(500).json({ error: msg });
  }
});

module.exports = router;
