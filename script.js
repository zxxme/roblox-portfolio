const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069],
    groupIds: ["524021069", "623751942", "917252309"],
    fallback: "./images/miku_logo.png"
};

async function init() {
    try {
        const [gamesRes, ...groupsData] = await Promise.all([
            fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`).then(r => r.json()),
            ...CONFIG.groupIds.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()))
        ]);

        const games = gamesRes.data || [];
        const topGame = [...games].sort((a, b) => b.visits - a.visits)[0];

        // Stats
        document.getElementById('total-visits').innerText = (games.reduce((s, g) => s + (g.visits || 0), 0) / 1000000).toFixed(1) + "M";
        const playing = games.reduce((s, g) => s + (g.playing || 0), 0);
        document.getElementById('total-playing').innerText = playing.toLocaleString();
        if (playing > 0) document.getElementById('playing-card').classList.add('pulse-active');

        // Community
        document.getElementById('group-container').innerHTML = groupsData.map(group => {
            const goal = Math.ceil((group.memberCount + 1) / 500) * 500;
            return `<div class="stat-card">
                <div class="stat-header"><span class="stat-label">${group.name}</span><i data-lucide="users" class="stat-icon-red"></i></div>
                <div class="stat-number">${group.memberCount.toLocaleString()}</div>
                <div class="progress-container"><div class="progress-fill" style="width:${(group.memberCount/goal)*100}%"></div></div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-dim);"><span>Milestone Progress</span><span>${goal}</span></div>
            </div>`;
        }).join('');

        // Games Grid
        const thumbRes = await fetch(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${CONFIG.universeIds.join(",")}&size=768x432&format=Png`).then(r => r.json());
        const thumbMap = {};
        thumbRes.data.forEach(t => thumbMap[t.universeId] = t.thumbnails[0]?.imageUrl);

        document.getElementById('game-container').innerHTML = games.map(game => `
            <div class="stat-card" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')" style="cursor:pointer; padding:0; overflow:hidden;">
                <img src="${thumbMap[game.id] || CONFIG.fallback}" style="width:100%; aspect-ratio:16/9; object-fit:cover;">
                <div style="padding:20px;">
                    ${game.id === topGame.id ? '<span class="top-badge"><i data-lucide="award"></i> Top Performer</span>' : ''}
                    <h3 style="margin:0;">${game.name}</h3>
                    <p style="color:var(--text-dim); font-size:14px; margin-top:8px;">${game.visits.toLocaleString()} Visits</p>
                </div>
            </div>`).join('');

        drawMiniGraph();
        lucide.createIcons();
    } catch (e) { console.error(e); }
}

function drawMiniGraph() {
    const canvas = document.getElementById('visit-graph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth; canvas.height = 40;
    ctx.strokeStyle = '#238636'; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(0, 35); ctx.bezierCurveTo(canvas.width*0.3, 35, canvas.width*0.6, 5, canvas.width, 10); ctx.stroke();
}

function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
}
document.addEventListener('DOMContentLoaded', init);