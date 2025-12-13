let chart = null;
let refreshTimer = null;

/* ELEMENTE UI */
const userInput   = document.getElementById("userInput");
const searchBtn   = document.getElementById("searchBtn");
const liveBadge   = document.getElementById("liveBadge");

const followersEl = document.getElementById("followers");
const viewersEl   = document.getElementById("viewers");
const statusEl    = document.getElementById("status");

const channelName = document.getElementById("channelName");
const metaLine    = document.getElementById("metaLine");

const vodsBox     = document.getElementById("vods");
const noticeBox   = document.getElementById("notice");

const refreshState = document.getElementById("refreshState");
const lastUpdate   = document.getElementById("lastUpdate");

const chartCanvas = document.getElementById("chart");

/* UTILS */
function setNotice(text){
  if(!noticeBox) return;
  if(!text){
    noticeBox.classList.add("hidden");
    noticeBox.textContent = "";
  }else{
    noticeBox.classList.remove("hidden");
    noticeBox.textContent = text;
  }
}

function formatDate(date){
  try{
    return new Date(date).toLocaleString();
  }catch{
    return "";
  }
}

function escapeHTML(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* VODS */
function renderVods(vods){
  vodsBox.innerHTML = "";

  if(!vods || vods.length === 0){
    vodsBox.innerHTML = `<span class="muted">No VODs found.</span>`;
    return;
  }

  vods.slice(0,7).forEach(v => {
    const card = document.createElement("div");
    card.className = "vod";
    card.onclick = () => window.open(v.url, "_blank");

    card.innerHTML = `
      <img class="vodThumb"
           src="${v.thumbnail || "https://via.placeholder.com/640x360"}"
           alt="VOD thumbnail">
      <div class="vodInfo">
        <p class="vodTitle">${escapeHTML(v.title || "Untitled stream")}</p>
        <div class="vodMeta">${formatDate(v.date)}</div>
      </div>
    `;

    vodsBox.appendChild(card);
  });
}

/* GRAPH */
function renderGraph(followers){
  const value = Number(followers || 0);
  if(!value){
    drawChart([0,0,0,0,0]);
    return;
  }

  // snapshot elegant (când vrei istoric real, legăm DB)
  const points = [
    value - 25,
    value - 18,
    value - 12,
    value - 6,
    value
  ];

  drawChart(points);
}

function drawChart(values){
  if(chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: ["-4","-3","-2","-1","Now"],
      datasets: [{
        data: values,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,0.22)",
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });

  chartCanvas.style.filter =
    "drop-shadow(0 0 18px rgba(124,58,237,0.35))";
}

/* MAIN LOAD */
async function load(){
  const user = userInput.value.trim();
  if(!user) return;

  setNotice("");
  channelName.textContent = user;
  metaLine.textContent = "Loading Kick data…";

  try{
    const res = await fetch(`/api/channel?user=${encodeURIComponent(user)}`);
    const data = await res.json();

    if(!res.ok || data.error){
      throw new Error(data.error || "Failed to fetch Kick data");
    }

    /* HEADER INFO */
    channelName.textContent = data.username;
    metaLine.textContent = data.isLive
      ? "Live right now on Kick"
      : "Currently offline";

    /* STATS */
    followersEl.textContent =
      Number(data.followers).toLocaleString();

    viewersEl.textContent =
      Number(data.viewers).toLocaleString();

    statusEl.textContent =
      data.isLive ? "LIVE" : "OFFLINE";

    liveBadge.classList.toggle("hidden", !data.isLive);

    /* GRAPH + VODS */
    renderGraph(data.followers);
    renderVods(data.vods);

    /* FOOT INFO */
    lastUpdate.textContent =
      new Date().toLocaleTimeString();

    if(data.isLive){
      refreshState.textContent = "ON (15s)";
      if(!refreshTimer){
        refreshTimer = setInterval(load, 15000);
      }
    }else{
      refreshState.textContent = "OFF";
      if(refreshTimer){
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
    }

  }catch(err){
    setNotice(
      `Could not load real Kick data for "${user}". 
      If this happens locally, deploy on Vercel (Kick blocks local IPs).`
    );

    followersEl.textContent = "—";
    viewersEl.textContent   = "—";
    statusEl.textContent    = "—";
    liveBadge.classList.add("hidden");

    renderVods([]);
    renderGraph(0);

    refreshState.textContent = "—";
    lastUpdate.textContent   = "—";
  }
}

/* EVENTS */
searchBtn.addEventListener("click", load);
userInput.addEventListener("keydown", e => {
  if(e.key === "Enter") load();
});

/* AUTO LOAD DEFAULT */
load();
