const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069], // Update with your actual Universe IDs
    fallback: "./images/miku_logo.png"
};

async function init() {
    try {
        const gamesRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`).then(r => r.json());
        const games = gamesRes.data || [];

        const thumbRes = await fetch(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${CONFIG.universeIds.join(",")}&size=768x432&format=Png`).then(r => r.json());
        const thumbMap = {};
        thumbRes.data.forEach(t => thumbMap[t.universeId] = t.thumbnails[0]?.imageUrl);

        // Update Stats
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const totalPlaying = games.reduce((s, g) => s + (g.playing || 0), 0);
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();

        // Render Games
        document.getElementById('game-container').innerHTML = games.map(game => `
            <div class="game-card-luca" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')">
                <div class="thumb-wrapper">
                    <img src="${thumbMap[game.id] || CONFIG.fallback}" class="game-thumb">
                    <div class="playing-badge"><div class="dot"></div> ${game.playing} playing</div>
                </div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <p class="game-desc">${game.description || "No description provided for this game."}</p>
                    <div class="game-meta">
                        <span><i data-lucide="users" style="width:12px"></i> ${game.playing}</span>
                        <span><i data-lucide="eye" style="width:12px"></i> ${(game.visits/1000000).toFixed(1)}M</span>
                    </div>
                </div>
            </div>`).join('');

        lucide.createIcons();
    } catch (e) { console.error("Load failed", e); }
}

document.addEventListener('DOMContentLoaded', init);