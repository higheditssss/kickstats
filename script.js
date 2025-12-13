function login() {
  window.location.href = "/api/auth/login";
}

function logout() {
  window.location.href = "/api/auth/logout";
}

async function loadStats() {
  const r = await fetch("/api/kick/stats");

  if (r.status === 401) {
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("content").style.display = "none";
    return;
  }

  const d = await r.json();

  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline-block";
  document.getElementById("content").style.display = "block";

  document.getElementById("avatar").src = d.avatar;
  document.getElementById("username").textContent = d.username;
  document.getElementById("status").textContent = d.isLive ? "LIVE" : "OFFLINE";
  document.getElementById("viewers").textContent = "Viewers: " + d.viewers;
  document.getElementById("followers").textContent = "Followers: " + d.followers;
}

loadStats();
setInterval(loadStats, 10000);
