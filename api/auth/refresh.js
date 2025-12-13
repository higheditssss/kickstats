import cookie from "cookie";

export default async function handler(req, res) {
  const refresh = req.cookies.kick_refresh;
  if (!refresh) return res.status(401).end();

  const r = await fetch("https://kick.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: process.env.KICK_CLIENT_ID,
      client_secret: process.env.KICK_CLIENT_SECRET
    })
  });

  const data = await r.json();

  res.setHeader("Set-Cookie", cookie.serialize(
    "kick_access",
    data.access_token,
    { httpOnly: true, secure: true, path: "/", maxAge: data.expires_in }
  ));

  res.status(200).end();
}
