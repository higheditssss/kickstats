function getChannel() {
  const params = new URLSearchParams(window.location.search);
  return params.get("channel");
}

const channel = getChannel();
if (!channel) {
  document.body.innerHTML = "<h2 style='color:white'>No channel</h2>";
  throw new Error("No channel");
}

const ctx = document.getElementById("viewerChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: { labels: [], datasets: [{
    data: [],
    borderColor: "#7c3aed",
    backgroundColor: "rgba(124,58,237,.25)",
    fill: true,
    tension: .4,
    pointRadius: 0
  }]},
  options: {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { beginAtZero: true } }
  }
});

async function load() {
  const r = await fetch(`/api/kick/stats?user=${channel}`);
  if (!r.ok) return;

  const d = await r.json();

  document.getElementById("name").textContent = channel;
  document.getElementById("avatar").src = d.avatar;
  document.getElementById("viewers").textContent = d.viewers;
  document.getElementById("status").textContent =
    d.isLive ? "LIVE" : "OFFLINE";

  const now = new Date().toLocaleTimeString();
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(d.viewers);

  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

load();
setInterval(load, 10000);
