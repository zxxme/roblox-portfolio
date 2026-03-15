// CRITICAL: Replace these with UNIVERSE IDs (Go to Roblox Creator Dashboard -> Three Dots -> Copy Universe ID)
const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069]; 

// Mouse Glow
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Navigation
function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window.scrollTo(0,0);
}

async function refresh() {
    const grid = document.getElementById('game-grid');
    const vDisplay = document.getElementById('v-count');
    const pDisplay = document.getElementById('p-count');

    try {
        const response = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`);
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; padding: 40px; border: 2px dashed #1c1c21; border-radius: 24px; text-align: center;">
                    <p style="color: var(--red); font-weight: 800; font-size: 20px;">No Games Found</p>
                    <p style="color: var(--dim); font-size: 14px; margin-top: 10px;">The IDs in your script might be <b>Place IDs</b>. You need <b>Universe IDs</b>.</p>
                </div>`;
            return;
        }

        const games = result.data;

        // Stats
        const visits = games.reduce((a, b) => a + (b.visits || 0), 0);
        const playing = games.reduce((a, b) => a + (b.playing || 0), 0);

        vDisplay.innerText = visits >= 1000000 ? (visits / 1000000).toFixed(1) + "M" : visits.toLocaleString();
        pDisplay.innerText = playing.toLocaleString();

        // Cards
        grid.innerHTML = games.map(g => `
            <div class="stat-card" onclick="window.open('https://roblox.com/games/${g.rootPlaceId}')" style="cursor:pointer">
                <div class="card-top"><span>Experience</span><i data-lucide="external-link"></i></div>
                <h3 style="margin:20px 0 5px; font-size:20px; font-weight:800; letter-spacing:-0.5px;">${g.name}</h3>
                <p style="color:var(--dim); font-size:14px;">${g.visits.toLocaleString()} Visits</p>
                <div class="status"><div class="dot"></div>${g.playing} Playing</div>
            </div>
        `).join('');

        lucide.createIcons();

    } catch (err) {
        grid.innerHTML = `<p style="color: var(--red)">Connection failed. The proxy might be offline.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', refresh);