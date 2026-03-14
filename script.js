const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069],
    groupIds: ["524021069", "623751942", "917252309"]
};

// ... existing showSection code ...

async function init() {
    try {
        const [gamesRes, ...groupsData] = await Promise.all([
            fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`).then(r => r.json()),
            ...CONFIG.groupIds.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()))
        ]);

        const games = gamesRes.data || [];

        // Fetch Live Assets
        const thumbRes = await fetch(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${CONFIG.universeIds.join(",")}&countPerUniverse=1&size=768x432&format=Png`).then(r => r.json());
        const thumbMap = {};
        thumbRes.data.forEach(t => thumbMap[t.universeId] = t.thumbnails[0]?.imageUrl);

        // Update Stats
        document.getElementById('total-visits').innerText = (games.reduce((s, g) => s + (g.visits || 0), 0) / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();

        // Render Games with Clickable Links
        document.getElementById('game-container').innerHTML = games.map(game => `
            <div class="game-card-luca" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')">
                <div class="luca-thumb-wrapper">
                    <img class="luca-thumb" src="${thumbMap[game.id] || './images/miku_avatar.png'}">
                    <div class="playing-badge"><span class="badge-dot"></span>${game.playing.toLocaleString()} playing</div>
                </div>
                <div style="padding:15px;">
                    <h3 style="margin:0; font-size:0.9rem;">${game.name}</h3>
                    <p style="color:var(--text-dim); font-size:0.75rem; margin-top:5px;">${game.visits.toLocaleString()} Visits</p>
                </div>
            </div>`).join('');

        // ... existing Render Communities code ...

        lucide.createIcons();
    } catch (e) { console.error("Update failed:", e); }
}

document.addEventListener('DOMContentLoaded', init);