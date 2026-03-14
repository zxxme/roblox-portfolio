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

        // Render Games
        document.getElementById('game-container').innerHTML = games.map(game => {
            let thumb = "";
            const name = game.name.toLowerCase();

            // Matching by Name or ID to ensure images actually show up
            if (name.includes("tap") || game.rootPlaceId == 115206262431806) {
                thumb = "image_2f7141.png"; // Tap Titans
            } else if (name.includes("yeet") || name.includes("brainrot")) {
                thumb = "image_2fc6fc.png"; // Yeet A Brainrot
            } else if (name.includes("pet") || name.includes("collector")) {
                thumb = "image_2f6d43.png"; // Pet Collectors
            } else {
                thumb = "image_256996.png"; // Your Avatar as fallback
            }

            return `
                <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" style="text-decoration:none; color:inherit;">
                    <div class="game-card-luca">
                        <div class="luca-thumb-wrapper">
                            <img class="luca-thumb" src="${thumb}" onerror="this.src='image_256996.png'">
                            <div class="playing-badge">${game.playing.toLocaleString()} playing</div>
                        </div>
                        <div class="luca-info">
                            <h3>${game.name}</h3>
                            <div class="luca-stats">
                                <div class="l-stat">👥 ${game.visits.toLocaleString()} Visits</div>
                            </div>
                        </div>
                    </div>
                </a>`;
        }).join('');

        // Render Groups
        document.getElementById('group-container').innerHTML = groupsData.map(group => {
            let icon = "image_256996.png"; // Default to your PFP
            const gName = group.name.toLowerCase();

            if (gName.includes("tap")) icon = "image_2f7141.png";
            else if (gName.includes("yeet") || gName.includes("brainrot")) icon = "image_2fc6fc.png";
            else if (gName.includes("pet")) icon = "image_2f6d43.png";

            return `
                <div class="stat-card" style="display:flex; align-items:center; gap:15px; padding:15px;">
                    <img src="${icon}" style="width:40px; height:40px; border-radius:8px;" onerror="this.src='image_256996.png'">
                    <div>
                        <div style="font-size:0.85rem; font-weight:600;">${group.name}</div>
                        <div style="font-size:0.7rem; color:var(--text-dim);">${group.memberCount.toLocaleString()} members</div>
                    </div>
                </div>`;
        }).join('');

    } catch (e) { console.error("Load error:", e); }
}

document.addEventListener('DOMContentLoaded', init);