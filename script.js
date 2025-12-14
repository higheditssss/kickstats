let chart;
const ctx = document.getElementById("chart").getContext("2d");

chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderColor: "#7c3aed",
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { x: { display: false } }
  }
});

async function load() {
  const user = document.getElementById("userInput").value || "hyghman";

  const r = await fetch(`/api/kick?user=${user}`);
  const d = await r.json();

  document.getElementById("avatar").src = d.avatar;
  document.getElementById("username").textContent = d.username;
  document.getElementById("followers").textContent = d.followers;
  document.getElementById("viewers").textContent = d.viewers;
  document.getElementById("status").textContent = d.isLive ? "LIVE" : "OFFLINE";

  const time = new Date().toLocaleTimeString();
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(d.viewers);

  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();

  const vods = document.getElementById("vods");
  vods.innerHTML = "";
  d.vods.forEach(v => {
    const a = document.createElement("a");
    a.href = `https://kick.com/${user}?clip=${v.id}`;
    a.target = "_blank";
    a.textContent = v.title;
    vods.appendChild(a);
  });
}

load();
setInterval(load, 10000);
