import cookie from "cookie";

export default async function handler(req, res) {
  const { code } = req.query;

  const r = await fetch("https://kick.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.KICK_CLIENT_ID,
      client_secret: process.env.KICK_CLIENT_SECRET,
      redirect_uri: process.env.KICK_REDIRECT_URI,
      code
    })
  });

  const data = await r.json();

  res.setHeader("Set-Cookie", [
    cookie.serialize("kick_access", data.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: data.expires_in
    }),
    cookie.serialize("kick_refresh", data.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    })
  ]);

  res.redirect("/");
}
