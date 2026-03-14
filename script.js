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
        
        // Header Stats
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();

        // Render Games using your specific uploaded filenames
        document.getElementById('game-container').innerHTML = games.map(game => {
            let thumb = "yeet-thumb.png"; // Default image
            
            // Map the correct image to the correct Game ID
            if (game.id == 9863921361) thumb = "tap-thumb.png";
            if (game.id == 9753920000) thumb = "pet-thumb.png";

            return `
                <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" style="text-decoration:none; color:inherit;">
                    <div class="game-card-luca">
                        <div class="luca-thumb-wrapper">
                            <img class="luca-thumb" src="${thumb}" alt="${game.name}">
                            <div class="playing-badge">${game.playing.toLocaleString()} playing</div>
                        </div>
                        <div class="luca-info">
                            <h3>${game.name}</h3>
                            <div class="luca-stats">
                                <div class="l-stat">👥 ${game.visits.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </a>`;
        }).join('');

        // Render Groups using your icons
        document.getElementById('group-container').innerHTML = groupsData.map(group => {
            let icon = "yeet-icon.png";
            if (group.id == 623751942) icon = "tap-icon.png";
            if (group.id == 524021069) icon = "pet-icon.png";

            return `
                <div class="stat-card" style="display:flex; align-items:center; gap:15px; padding:15px;">
                    <img src="${icon}" style="width:40px; height:40px; border-radius:8px;" alt="${group.name}">
                    <div>
                        <div style="font-size:0.85rem; font-weight:600;">${group.name}</div>
                        <div style="font-size:0.7rem; color:var(--text-dim);">${group.memberCount.toLocaleString()} members</div>
                    </div>
                </div>`;
        }).join('');

    } catch (e) { console.error("Update Error:", e); }
}

document.addEventListener('DOMContentLoaded', init);