export default function handler(req, res) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.KICK_CLIENT_ID,
    redirect_uri: process.env.KICK_REDIRECT_URI,
    scope: "user:read channel:read"
  });

  res.redirect(`https://kick.com/oauth/authorize?${params.toString()}`);
}
