async function loadStats() {
  const r = await fetch("/api/kick/stats");

  if (!r.ok) {
    // NU e logat
    document.getElementById("loginBtn").classList.remove("hidden");
    document.getElementById("logoutBtn").classList.add("hidden");
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("username").textContent = "Not logged in";
    return;
  }

  const d = await r.json();

  // ESTE LOGAT
  document.getElementById("loginBtn").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  document.getElementById("username").textContent = d.username;
  document.getElementById("avatar").src = d.avatar;
  document.getElementById("viewers").textContent = d.viewers;
  document.getElementById("followers").textContent = d.followers;

  const badge = document.getElementById("liveBadge");
  badge.textContent = d.isLive ? "LIVE" : "OFFLINE";
  badge.className = "badge " + (d.isLive ? "live" : "offline");
}

loadStats();
setInterval(loadStats, 10000);
