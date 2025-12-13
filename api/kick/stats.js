import cookie from "cookie";

export default async function handler(req, res) {
  const cookies = req.headers.cookie
    ? cookie.parse(req.headers.cookie)
    : {};

  const token = cookies.kick_access;

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const r = await fetch("https://api.kick.com/public/v1/channel", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!r.ok) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const d = await r.json();

  res.json({
    username: d.slug,
    avatar: d.user.profile_picture,
    followers: d.followers_count,
    isLive: !!d.livestream,
    viewers: d.livestream?.viewer_count || 0
  });
}
