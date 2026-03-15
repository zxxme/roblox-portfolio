const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];

async function updateDash() {
    try {
        const response = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`);
        const data = await response.json();
        const games = data.data || [];

        // Update Numbers
        const visits = games.reduce((a, b) => a + (b.visits || 0), 0);
        const playing = games.reduce((a, b) => a + (b.playing || 0), 0);
        
        document.getElementById('v-total').innerText = (visits / 1000000).toFixed(1) + "M";
        document.getElementById('p-total').innerText = playing.toLocaleString();

        // Render Cards
        const grid = document.getElementById('game-grid');
        grid.innerHTML = games.map(game => `
            <div class="card game-card" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')">
                <h3 style="margin:0; font-size:16px;">${game.name}</h3>
                <p style="color:#666; font-size:13px; margin:8px 0;">${game.visits.toLocaleString()} Visits</p>
                <div class="playing-tag"><span class="dot"></span> ${game.playing} playing</div>
            </div>
        `).join('');

        lucide.createIcons();
    } catch (e) { console.error("Error loading games", e); }
}

function showSection(id, el) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

document.addEventListener('DOMContentLoaded', updateDash);