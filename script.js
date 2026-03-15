const IDS = [9753920000, 9863921361, 9561068069];

// Mouse Glow
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Navigation System
function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window.scrollTo(0,0);
}

async function loadData() {
    try {
        const res = await fetch(`https://games.roproxy.com/v1/games?universeIds=${IDS.join(",")}`);
        const { data } = await res.json();
        if (!data) return;

        // Populate Stats
        const v = data.reduce((a, b) => a + (b.visits || 0), 0);
        const p = data.reduce((a, b) => a + (b.playing || 0), 0);
        document.getElementById('v-count').innerText = (v / 1000000).toFixed(1) + "M";
        document.getElementById('p-count').innerText = p.toLocaleString();

        // Populate Game Grid
        document.getElementById('game-grid').innerHTML = data.map(g => `
            <div class="stat-card" onclick="window.open('https://roblox.com/games/${g.rootPlaceId}')" style="cursor:pointer">
                <div class="card-top"><span>Experience</span><i data-lucide="external-link"></i></div>
                <h3 style="margin:15px 0 5px; font-size:20px; font-weight:800;">${g.name}</h3>
                <p style="color:var(--dim); font-size:14px;">${g.visits.toLocaleString()} Visits</p>
                <div class="playing" style="margin-top:20px;"><div class="dot"></div>${g.playing} Active</div>
            </div>
        `).join('');

        lucide.createIcons();
    } catch (err) { console.error("Update error:", err); }
}

document.addEventListener('DOMContentLoaded', loadData);