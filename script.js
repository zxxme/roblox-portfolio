// Navigation Fix
function showSection(id, btn) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    // Show target section
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';

    // Update active button state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    btn.classList.add('active');
}

const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069], // Update these
    fallback: "./images/miku_logo.png"
};

async function init() {
    try {
        const res = await fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`);
        const data = await res.json();
        const games = data.data || [];

        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const totalPlaying = games.reduce((s, g) => s + (g.playing || 0), 0);

        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();

        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = games.map(game => `
                <div class="game-card-luca" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')">
                    <div class="thumb-wrapper">
                        <div class="playing-badge"><div class="dot"></div> ${game.playing} playing</div>
                    </div>
                    <div class="game-info">
                        <h3 style="margin:0;">${game.name}</h3>
                        <p style="color:#8b949e; font-size:12px; margin-top:10px;">${game.visits.toLocaleString()} Visits</p>
                    </div>
                </div>`).join('');
        }

        lucide.createIcons();
    } catch (e) {
        console.error("Dashboard Load Error:", e);
    }
}

document.addEventListener('DOMContentLoaded', init);