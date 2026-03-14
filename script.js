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
        
        // Stats
        const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
        document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M+";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();

        // Experiences
        document.getElementById('game-container').innerHTML = games.map(game => {
            let thumb = "image_2fc6fc.png"; // Yeet a Brainrot
            if (game.id == 9863921361) thumb = "image_2f7141.png"; // Tap Titans
            if (game.id == 9753920000) thumb = "image_2f6d43.png"; // Pet Collectors

            return `
                <div class="game-card">
                    <div class="thumb-wrapper">
                        <img class="game-thumb" src="${thumb}" alt="${game.name}">
                    </div>
                    <div class="game-info">
                        <h3 style="margin:0; font-size:1.6rem; letter-spacing:-1px;">${game.name}</h3>
                        <p style="color:var(--text-dim); margin: 12px 0;">${game.visits.toLocaleString()} VISITS</p>
                        <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" class="play-btn">VIEW PROJECT</a>
                    </div>
                </div>`;
        }).join('');

        // Communities
        document.getElementById('group-container').innerHTML = groupsData.map(group => {
            let icon = "image_2fc6fc.png";
            if (group.id == 623751942) icon = "image_2f7141.png";
            if (group.id == 524021069) icon = "image_2f6d43.png";

            return `
                <div class="group-card">
                    <img class="group-logo" src="${icon}" alt="${group.name}">
                    <div>
                        <h4 style="margin:0; font-size:0.95rem;">${group.name}</h4>
                        <p style="color:var(--text-dim); font-size:0.75rem; margin-top:4px;">${group.memberCount.toLocaleString()} MEMBERS</p>
                    </div>
                </div>`;
        }).join('');

    } catch (e) { console.error("Load Error:", e); }
}

document.addEventListener('DOMContentLoaded', init);