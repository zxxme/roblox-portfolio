const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069], 
    proxy: "https://games.roproxy.com/v1/games?universeIds="
};

async function loadDashboard() {
    try {
        const response = await fetch(CONFIG.proxy + CONFIG.universeIds.join(","));
        const data = await response.json();
        const games = data.data || [];

        // Update Stats
        const visits = games.reduce((acc, g) => acc + (g.visits || 0), 0);
        const players = games.reduce((acc, g) => acc + (g.playing || 0), 0);
        
        document.getElementById('v-total').innerText = (visits / 1000000).toFixed(1) + "M";
        document.getElementById('p-total').innerText = players.toLocaleString();

        // Build Grid
        const grid = document.getElementById('game-grid');
        grid.innerHTML = games.map(game => `
            <div class="game-card" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')">
                <h3 style="margin:0; font-size:16px;">${game.name}</h3>
                <p style="color:var(--dim); font-size:13px; margin:10px 0;">${game.visits.toLocaleString()} Visits</p>
                <div style="font-size:12px; font-weight:600; color:#238636;">
                    <span class="playing-dot"></span>${game.playing} Playing
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    } catch (e) { console.error("Could not load games", e); }
}

function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', loadDashboard);