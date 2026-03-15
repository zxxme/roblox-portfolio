const IDS = [9753920000, 9863921361, 9561068069];

// Mouse Glow Effect
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Section Toggle (Fixes broken buttons)
function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

async function init() {
    try {
        const res = await fetch(`https://games.roproxy.com/v1/games?universeIds=${IDS.join(",")}`);
        const { data } = await res.json();
        if (!data) return;

        // Totals
        const v = data.reduce((a, b) => a + (b.visits || 0), 0);
        const p = data.reduce((a, b) => a + (b.playing || 0), 0);
        document.getElementById('v-count').innerText = (v / 1000000).toFixed(1) + "M";
        document.getElementById('p-count').innerText = p.toLocaleString();

        // Cards
        document.getElementById('game-grid').innerHTML = data.map(g => `
            <div class="game-card" onclick="window.open('https://roblox.com/games/${g.rootPlaceId}')">
                <h3 style="margin:0; font-size:18px;">${g.name}</h3>
                <p style="color:#666; font-size:13px; margin:10px 0;">${g.visits.toLocaleString()} Visits</p>
                <div class="playing-badge"><div class="pulse-dot"></div> ${g.playing} Playing</div>
            </div>
        `).join('');

        lucide.createIcons();
    } catch (err) { console.error("Site Error:", err); }
}

document.addEventListener('DOMContentLoaded', init);