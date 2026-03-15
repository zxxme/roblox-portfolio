// PUT YOUR UNIVERSE IDS HERE
const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];

// Mouse Movement Glow
const glow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Navigation Toggle
function tab(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window.scrollTo(0,0);
}

// Fetch and Render Games
async function refreshGames() {
    const grid = document.getElementById('game-grid');
    
    try {
        const res = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`);
        const { data } = await res.json();

        if (!data || data.length === 0) {
            grid.innerHTML = `<p style="color:red">No games found. Check your Universe IDs.</p>`;
            return;
        }

        // Totals
        const totalVisits = data.reduce((a, b) => a + (b.visits || 0), 0);
        const totalPlayers = data.reduce((a, b) => a + (b.playing || 0), 0);
        
        document.getElementById('v-total').innerText = (totalVisits / 1000000).toFixed(1) + "M";
        document.getElementById('p-total').innerText = totalPlayers.toLocaleString();

        // Cards
        grid.innerHTML = data.map(game => `
            <div class="stat-card" onclick="window.open('https://roblox.com/games/${game.rootPlaceId}')" style="cursor:pointer">
                <div class="stat-top"><span>Experience</span><i data-lucide="external-link"></i></div>
                <h3 style="margin:20px 0 5px; font-size:20px; font-weight:800;">${game.name}</h3>
                <p style="color:var(--dim); font-size:14px;">${game.visits.toLocaleString()} Visits</p>
                <div class="status"><div class="dot"></div>${game.playing} Active Now</div>
            </div>
        `).join('');

        lucide.createIcons();

    } catch (err) {
        grid.innerHTML = `<p style="color:red">Error: Could not connect to Roblox API.</p>`;
        console.error("API Error:", err);
    }
}

document.addEventListener('DOMContentLoaded', refreshGames);