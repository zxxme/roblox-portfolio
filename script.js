const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069], // Put your IDs here
    groupIds: ["524021069"], 
    fallback: "./images/miku_logo.png"
};

// Error-proof Section Toggling
function showSection(sectionId, element) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.style.display = 'none');
    
    const target = document.getElementById(sectionId);
    if(target) target.style.display = 'block';

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    element.classList.add('active');
}

async function init() {
    try {
        const gamesRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`).then(r => r.json());
        if (!gamesRes.data) throw new Error("No data");

        const games = gamesRes.data;
        
        // Stats Calculation
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const totalPlaying = games.reduce((s, g) => s + (g.playing || 0), 0);
        
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();

        // Render Games
        const container = document.getElementById('game-container');
        container.innerHTML = games.map(game => `
            <div class="stat-card" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')" style="cursor:pointer; padding:0; overflow:hidden;">
                <div style="padding:20px;">
                    <h3 style="margin:0;">${game.name}</h3>
                    <p style="color:var(--text-dim); font-size:14px;">${game.visits.toLocaleString()} Visits</p>
                </div>
            </div>`).join('');

        lucide.createIcons();
    } catch (e) {
        console.error("Failed to load stats:", e);
    }
}

document.addEventListener('DOMContentLoaded', init);