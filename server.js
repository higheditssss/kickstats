import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

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

// 🔎 SEARCH USER
async function getChannel(username) {
  const search = await kickFetch(
    `https://kick.com/api/v1/search?query=${username}`
  );

  const channel = search.channels?.find(
    c => c.slug.toLowerCase() === username.toLowerCase()
  );

  if (!channel) throw new Error("User not found");
  return channel;
}

// 📊 STATS + VODS
app.get("/api/channel/:user", async (req, res) => {
  try {
    const channel = await getChannel(req.params.user);
    const data = await kickFetch(
      `https://kick.com/api/v2/channels/${channel.id}`
    );

    res.json({
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
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log("🔥 KickStats REAL running");
});
