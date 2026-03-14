const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069], // Update these
    fallback: "./images/miku_logo.png"
};

async function init() {
    try {
        const response = await fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`);
        const gamesRes = await response.json();
        const games = gamesRes.data || [];
        
        // Populate Dashboard Stats
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const totalPlaying = games.reduce((s, g) => s + (g.playing || 0), 0);
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();

        // Render Game Cards
        document.getElementById('game-container').innerHTML = games.map(game => `
            <div class="stat-card" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')" style="cursor:pointer;">
                <h3 style="margin:0;">${game.name}</h3>
                <p style="color:var(--text-dim); margin-top:10px; font-size:14px;">${game.visits.toLocaleString()} Visits</p>
                <p style="color:#238636; font-size:12px;">● ${game.playing} playing</p>
            </div>`).join('');

        lucide.createIcons();
    } catch (e) { console.error("Load error:", e); }
}

function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);