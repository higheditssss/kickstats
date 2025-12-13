import fetch from "node-fetch";

async function kickFetch(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });
  if (!res.ok) throw new Error("Kick blocked");
  return res.json();
}

export default async function handler(req, res) {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: "Missing user" });
  }

  try {
    // 1️⃣ SEARCH
    const search = await kickFetch(
      `https://kick.com/api/v1/search?query=${user}`
    );

    const channel = search.channels?.find(
      c => c.slug.toLowerCase() === user.toLowerCase()
    );

    if (!channel) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ CHANNEL DATA
    const data = await kickFetch(
      `https://kick.com/api/v2/channels/${channel.id}`
    );

    // 3️⃣ RESPONSE
    res.status(200).json({
      username: data.username,
      followers: data.followersCount,
      isLive: !!data.livestream,
      viewers: data.livestream?.viewer_count || 0,
      vods: (data.previous_livestreams || [])
        .slice(0, 7)
        .map(v => ({
          title: v.session_title || "Untitled stream",
          thumbnail: v.thumbnail?.url,
          url: `https://kick.com/${data.username}/videos/${v.id}`,
          date: v.created_at
        }))
    });

  } catch (e) {
    res.status(500).json({ error: "Failed to fetch Kick data" });
  }
}
