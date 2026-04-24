/**
 * Parses a YouTube URL and returns { type: 'video'|'channel', id }
 */
function parseYouTubeUrl(url) {
  try {
    const u = new URL(url.trim());

    // Video: youtube.com/watch?v=ID or youtu.be/ID
    const videoId =
      u.searchParams.get('v') ||
      (u.hostname === 'youtu.be' ? u.pathname.slice(1) : null);
    if (videoId) return { type: 'video', id: videoId };

    // Channel: /channel/ID
    const channelMatch = u.pathname.match(/\/channel\/([\w-]+)/);
    if (channelMatch) return { type: 'channel', id: channelMatch[1] };

    // Channel: /c/handle or /@handle
    const handleMatch = u.pathname.match(/\/@?([\w.-]+)/);
    if (handleMatch) return { type: 'channel', id: handleMatch[1], isHandle: true };

    // Channel: /user/username
    const userMatch = u.pathname.match(/\/user\/([\w-]+)/);
    if (userMatch) return { type: 'channel', id: userMatch[1], isHandle: true };

    return null;
  } catch {
    return null;
  }
}

module.exports = { parseYouTubeUrl };
