const axios = require('axios');

const YT_BASE = 'https://www.googleapis.com/youtube/v3';
const KEY = process.env.YOUTUBE_API_KEY;

async function getVideoData(videoId) {
  const [videoRes, commentRes] = await Promise.allSettled([
    axios.get(`${YT_BASE}/videos`, {
      params: {
        key: KEY,
        id: videoId,
        part: 'snippet,statistics,contentDetails,status',
      },
    }),
    axios.get(`${YT_BASE}/commentThreads`, {
      params: {
        key: KEY,
        videoId,
        part: 'snippet',
        maxResults: 20,
        order: 'relevance',
      },
    }),
  ]);

  const video = videoRes.status === 'fulfilled' ? videoRes.value.data.items?.[0] : null;
  if (!video) throw new Error('Video not found or API error');

  const comments =
    commentRes.status === 'fulfilled'
      ? (commentRes.value.data.items || []).map(
          (c) => c.snippet.topLevelComment.snippet.textDisplay
        )
      : [];

  return {
    id: videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    tags: video.snippet.tags || [],
    category: video.snippet.categoryId,
    publishedAt: video.snippet.publishedAt,
    duration: video.contentDetails.duration,
    thumbnail: video.snippet.thumbnails?.maxres?.url || video.snippet.thumbnails?.high?.url,
    viewCount: video.statistics.viewCount,
    likeCount: video.statistics.likeCount,
    commentCount: video.statistics.commentCount,
    ageRestricted: video.contentDetails.contentRating?.ytRating === 'ytAgeRestricted',
    madeForKids: video.status.madeForKids,
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle,
    comments,
  };
}

async function getChannelData(channelIdOrHandle, isHandle = false) {
  let channelRes;
  if (isHandle) {
    channelRes = await axios.get(`${YT_BASE}/channels`, {
      params: {
        key: KEY,
        forHandle: channelIdOrHandle.startsWith('@')
          ? channelIdOrHandle
          : `@${channelIdOrHandle}`,
        part: 'snippet,statistics,brandingSettings',
      },
    });
    // fallback to forUsername
    if (!channelRes.data.items?.length) {
      channelRes = await axios.get(`${YT_BASE}/channels`, {
        params: {
          key: KEY,
          forUsername: channelIdOrHandle,
          part: 'snippet,statistics,brandingSettings',
        },
      });
    }
  } else {
    channelRes = await axios.get(`${YT_BASE}/channels`, {
      params: {
        key: KEY,
        id: channelIdOrHandle,
        part: 'snippet,statistics,brandingSettings',
      },
    });
  }

  const channel = channelRes.data.items?.[0];
  if (!channel) throw new Error('Channel not found or API error');

  const channelId = channel.id;

  // Get recent 10 videos
  const uploadsRes = await axios.get(`${YT_BASE}/search`, {
    params: {
      key: KEY,
      channelId,
      part: 'snippet',
      order: 'date',
      maxResults: 10,
      type: 'video',
    },
  });

  const recentVideos = (uploadsRes.data.items || []).map((v) => ({
    id: v.id.videoId,
    title: v.snippet.title,
    thumbnail: v.snippet.thumbnails?.high?.url,
    publishedAt: v.snippet.publishedAt,
  }));

  // Get video details for age restriction check
  const videoIds = recentVideos.map((v) => v.id).join(',');
  let videoDetails = [];
  if (videoIds) {
    const detailRes = await axios.get(`${YT_BASE}/videos`, {
      params: {
        key: KEY,
        id: videoIds,
        part: 'contentDetails,status',
      },
    });
    videoDetails = detailRes.data.items || [];
  }

  const ageRestrictedCount = videoDetails.filter(
    (v) => v.contentDetails.contentRating?.ytRating === 'ytAgeRestricted'
  ).length;

  return {
    id: channelId,
    name: channel.snippet.title,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails?.high?.url,
    subscriberCount: channel.statistics.subscriberCount,
    videoCount: channel.statistics.videoCount,
    viewCount: channel.statistics.viewCount,
    publishedAt: channel.snippet.publishedAt,
    country: channel.snippet.country,
    keywords: channel.brandingSettings?.channel?.keywords || '',
    recentVideos,
    ageRestrictedCount,
  };
}

module.exports = { getVideoData, getChannelData };
