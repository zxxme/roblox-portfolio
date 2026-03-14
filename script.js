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
        
        // Stats Logic
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        const totalPlaying = games.reduce((s, g) => s + (g.playing || 0), 0);
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M+";
        document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();
        document.getElementById('total-games').innerText = games.length;

        // FIXED GAME IMAGES
        document.getElementById('game-container').innerHTML = games.map(game => `
            <div class="game-card">
                <div class="thumb-wrapper">
                    <img class="game-thumb" src="https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${game.id}&countPerUniverse=1&defaults=true&size=768x432&format=Png" onerror="this.src='https://tr.rbxcdn.com/431478796464f1e56b0996a6663f738a/420/420/Image/Png'">
                    <div class="live-badge">● ${game.playing.toLocaleString()} LIVE</div>
                </div>
                <div class="game-info">
                    <h3 style="margin:0">${game.name}</h3>
                    <p style="color:var(--text-dim); margin: 5px 0;">${game.visits.toLocaleString()} Visits</p>
                    <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" class="play-btn">Play Experience</a>
                </div>
            </div>
        `).join('');

        // FIXED GROUP IMAGES
        document.getElementById('group-container').innerHTML = groupsData.map(group => `
            <div class="group-card">
                <img class="group-logo" src="https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${group.id}&size=150x150&format=Png&isCircular=true">
                <div>
                    <h4 style="margin:0">${group.name}</h4>
                    <p style="color:var(--text-dim); font-size:0.8rem;">${group.memberCount.toLocaleString()} Members</p>
                </div>
            </div>
        `).join('');

    } catch (e) { console.error("Update failed", e); }
}

document.addEventListener('DOMContentLoaded', init);