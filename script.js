const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];

// Tab System
function showTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Mouse Follower
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

async function loadRobloxData() {
    const grid = document.getElementById('game-grid');
    const vTotal = document.getElementById('v-total');
    const pTotal = document.getElementById('p-total');

    try {
        const url = `https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`;
        const res = await fetch(url);
        const { data } = await res.json();

        if (!data || data.length === 0) {
            grid.innerHTML = `<p style="color:var(--dim)">Fetching data from Roblox API...</p>`;
            // Retry in 3 seconds if empty
            setTimeout(loadRobloxData, 3000);
            return;
        }

        // Calculate Totals
        const visits = data.reduce((a, b) => a + (b.visits || 0), 0);
        const playing = data.reduce((a, b) => a + (b.playing || 0), 0);

        vTotal.innerText = visits >= 1000000 ? (visits / 1000000).toFixed(1) + "M" : visits.toLocaleString();
        pTotal.innerText = playing.toLocaleString();

        // Build Game Cards
        grid.innerHTML = data.map(game => `
            <div class="bento-card" onclick="window.open('https://roblox.com/games/${game.rootPlaceId}')" style="cursor:pointer">
                <span style="color:var(--dim); font-size:12px; font-weight:700;">EXPERIENCE</span>
                <h3 style="margin:10px 0 5px; font-size:22px; font-weight:800;">${game.name}</h3>
                <p style="color:var(--dim); font-size:14px;">${game.visits.toLocaleString()} Visits</p>
                <div class="badge"><div class="dot"></div> ${game.playing} Active</div>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();

    } catch (e) {
        grid.innerHTML = `<p style="color:red">Proxy Error. Retrying...</p>`;
        setTimeout(loadRobloxData, 5000);
    }
}

document.addEventListener('DOMContentLoaded', loadRobloxData);