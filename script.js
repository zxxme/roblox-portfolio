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
        
        // Update Header Stats
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M+";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();
        document.getElementById('total-games').innerText = games.length;

        // Render Games with Custom Assets
        document.getElementById('game-container').innerHTML = games.map(game => {
            let thumb = "yeet-thumb.jpg"; // Default
            if (game.id == 9863921361) thumb = "tap-thumb.jpg";
            if (game.id == 9753920000) thumb = "pet-thumb.jpg";

            return `
                <div class="game-card">
                    <div class="thumb-wrapper">
                        <img class="game-thumb" src="${thumb}" alt="${game.name}">
                        <div class="live-badge">● ${game.playing.toLocaleString()} LIVE</div>
                    </div>
                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <p style="color:var(--text-dim); font-size: 0.9rem;">${game.visits.toLocaleString()} Visits</p>
                        <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" class="play-btn">Launch Game</a>
                    </div>
                </div>`;
        }).join('');

        // Render Groups with Custom Icons
        document.getElementById('group-container').innerHTML = groupsData.map(group => {
            let icon = "yeet-icon.png"; // Default
            if (group.id == 623751942) icon = "tap-icon.png";
            if (group.id == 524021069) icon = "pet-icon.png";

            return `
                <div class="group-card">
                    <img class="group-logo" src="${icon}" alt="${group.name}">
                    <div class="group-details">
                        <h4 style="margin:0">${group.name}</h4>
                        <p style="color:var(--text-dim); font-size:0.8rem;">${group.memberCount.toLocaleString()} Members</p>
                        <a href="https://www.roblox.com/groups/${group.id}" target="_blank" style="color:var(--accent); font-size:0.8rem; text-decoration:none; font-weight:bold;">Join Community →</a>
                    </div>
                </div>`;
        }).join('');

    } catch (e) { console.error("Portfolio Load Error:", e); }
}

document.addEventListener('DOMContentLoaded', init);