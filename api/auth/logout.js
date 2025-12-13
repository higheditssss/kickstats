import cookie from "cookie";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", [
    cookie.serialize("kick_access", "", { maxAge: 0, path: "/" }),
    cookie.serialize("kick_refresh", "", { maxAge: 0, path: "/" })
  ]);
  res.redirect("/");
}
