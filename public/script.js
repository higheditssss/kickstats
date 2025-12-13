let chart;

async function load(){
  const res = await fetch("/api/hyghman");
  const data = await res.json();

  followers.textContent = data.followers.toLocaleString();
  viewers.textContent = data.viewers.toLocaleString();
  status.textContent = data.isLive ? "LIVE" : "OFFLINE";

  liveBadge.classList.toggle("hidden", !data.isLive);

  updated.textContent =
    "Last updated: " + new Date(data.lastUpdated).toLocaleString();

  renderGraph(data.history);
  renderVods(data.vods);
}

function renderGraph(history){
  if(chart) chart.destroy();

  chart = new Chart(chart,{
    type:"line",
    data:{
      labels:history.map(h=>h.time),
      datasets:[{
        data:history.map(h=>h.followers),
        borderColor:"#7c3aed",
        backgroundColor:"rgba(124,58,237,0.25)",
        fill:true,
        tension:.4,
        pointRadius:0
      }]
    },
    options:{
      plugins:{legend:{display:false}},
      scales:{x:{display:false},y:{display:false}}
    }
  });
}

function renderVods(vods){
  vodList.innerHTML="";
  vods.forEach(v=>{
    const d=document.createElement("div");
    d.className="vod";
    d.onclick=()=>window.open(v.url,"_blank");
    d.innerHTML=`
      <img src="${v.thumbnail}">
      <div class="vod-title">${v.title}</div>
    `;
    vodList.appendChild(d);
  });
}

load();
