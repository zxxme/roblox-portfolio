const CONFIG = {
    universeIds: [9753920000, 9863921361, 9561068069],
    groupIds: ["524021069", "623751942", "917252309"] 
};

async function init() {
    try {
        const [gamesRes, ...groupsData] = await Promise.all([
            fetch(`https://games.roproxy.com/v1/games?universeIds=${CONFIG.universeIds.join(",")}`).then(r => r.json()),
            ...CONFIG.groupIds.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()))
        ]);

        const games = gamesRes.data || [];
        
        // Update Stats Bar
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const totalPlaying = games.reduce((s, g) => s + (g.playing || 0), 0);
        
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M+";
        document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();
        document.getElementById('total-games').innerText = games.length;

        // Render Game Cards
        document.getElementById('game-container').innerHTML = games.map(game => `
            <div class="game-card">
                <div class="thumb-wrapper">
                    <img class="game-thumb" src="https://www.roblox.com/asset-thumbnail/image?assetId=${game.rootPlaceId}&width=768&height=432&format=png">
                    <div class="live-badge">● ${game.playing.toLocaleString()} LIVE</div>
                </div>
                <div class="game-info">
                    <h3 style="margin:0; font-size: 1.4rem;">${game.name}</h3>
                    <p style="color:var(--text-dim); margin: 8px 0; font-size: 0.9rem;">${game.visits.toLocaleString()} Total Visits</p>
                    <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" class="play-btn">Launch Experience</a>
                </div>
            </div>
        `).join('');

        // Render Community Cards
        document.getElementById('group-container').innerHTML = groupsData.map(group => `
            <div class="group-card">
                <img class="group-logo" src="https://www.roblox.com/asset-thumbnail/set?assetId=${group.id}&width=150&height=150&format=png">
                <div class="group-details">
                    <h4 style="margin:0; font-size: 1.1rem;">${group.name}</h4>
                    <p style="color:var(--text-dim); font-size:0.85rem; margin: 4px 0;">${group.memberCount.toLocaleString()} Members</p>
                    <a href="https://www.roblox.com/groups/${group.id}" target="_blank" style="color:var(--accent); font-size:0.8rem; text-decoration:none; font-weight:bold;">Join Community →</a>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Critical Load Error:", e);
    }
}

document.addEventListener('DOMContentLoaded', init);