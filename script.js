const ctx = document.getElementById("viewerChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderColor: "#7c3aed",
      backgroundColor: "rgba(124,58,237,.3)",
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { beginAtZero: true }
    }
  }
});

function login() {
  window.location.href = "/api/auth/login";
}

function logout() {
  window.location.href = "/api/auth/logout";
}

async function loadStats() {
  const r = await fetch("/api/kick/stats");

  if (!r.ok) {
    document.getElementById("loginBtn").classList.remove("hidden");
    document.getElementById("dashboard").classList.add("hidden");
    return;
  }

  const d = await r.json();

  document.getElementById("loginBtn").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  document.getElementById("username").textContent = d.username;
  document.getElementById("avatar").src = d.avatar;
  document.getElementById("viewers").textContent = d.viewers;
  document.getElementById("followers").textContent = d.followers;
  document.getElementById("status").textContent = d.isLive ? "LIVE" : "OFFLINE";

  const badge = document.getElementById("liveBadge");
  badge.textContent = d.isLive ? "LIVE" : "OFFLINE";
  badge.className = "badge " + (d.isLive ? "live" : "offline");

  const time = new Date().toLocaleTimeString();
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(d.viewers);

  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

loadStats();
setInterval(loadStats, 10000);
