const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069], // Put your IDs here
    fallback: "./images/miku_logo.png"
};

// Section Toggling Logic
function showSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
}

async function init() {
    try {
        const response = await fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`);
        const data = await response.json();
        const games = data.data || [];

        // Update Stats
        const visits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const playing = games.reduce((s, g) => s + (g.playing || 0), 0);
        
        document.getElementById('total-visits').innerText = (visits / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = playing.toLocaleString();

        // Render Game Cards
        const container = document.getElementById('game-container');
        container.innerHTML = games.map(game => `
            <div class="stat-card" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')" style="cursor:pointer; padding:0; overflow:hidden;">
                <div style="padding:20px;">
                    <h3 style="margin:0;">${game.name}</h3>
                    <p style="color:var(--text-dim); font-size:13px; margin:10px 0;">${game.visits.toLocaleString()} Visits</p>
                    <p style="color:#238636; font-size:12px; font-weight:700; display:flex; align-items:center; gap:5px;">
                        <span style="width:6px; height:6px; background:#238636; border-radius:50%;"></span>
                        ${game.playing} playing
                    </p>
                </div>
            </div>`).join('');

        lucide.createIcons();
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

document.addEventListener('DOMContentLoaded', init);