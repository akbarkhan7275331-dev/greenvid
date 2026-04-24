async function getTranscript(videoId) {
  try {
    const { YoutubeTranscript } = await import('youtube-transcript');
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript
      .slice(0, 100) // first 100 segments to keep token count reasonable
      .map((t) => t.text)
      .join(' ');
    return text;
  } catch {
    return null; // transcripts may be disabled — not a blocker
  }
}

module.exports = { getTranscript };
