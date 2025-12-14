export default async function handler(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "Missing user" });
  }

  try {
    const channelRes = await fetch(
      `https://kick.com/api/v2/channels/${user}`
    );
    const channel = await channelRes.json();

    const vodRes = await fetch(
      `https://kick.com/api/v2/channels/${user}/videos`
    );
    const vods = await vodRes.json();

    res.status(200).json({
      username: channel.slug,
      avatar: channel.user.profile_pic,
      followers: channel.followersCount,
      isLive: channel.livestream !== null,
      viewers: channel.livestream?.viewer_count || 0,
      vods: vods.data.slice(0, 7)
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch Kick data" });
  }
}
