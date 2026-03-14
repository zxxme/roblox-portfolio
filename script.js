function toggleSocials() {
    document.getElementById('socials-overlay').classList.toggle('active');
}

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
        
        // Update stats
        document.getElementById('total-visits').innerText = (games.reduce((s, g) => s + (g.visits || 0), 0) / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();

        // Fix Glitching Images by using absolute paths
        document.getElementById('game-container').innerHTML = games.map(game => {
            let thumb = "image_256996.png"; 
            const n = game.name.toLowerCase();
            if (n.includes("tap")) thumb = "image_2f7141.png";
            else if (n.includes("yeet") || n.includes("brainrot")) thumb = "image_2fc6fc.png";
            else if (n.includes("pet")) thumb = "image_2f6d43.png";

            return `
                <div class="game-card-luca">
                    <div class="luca-thumb-wrapper">
                        <img class="luca-thumb" src="./${thumb}">
                        <div class="playing-badge">${game.playing.toLocaleString()} playing</div>
                    </div>
                    <div class="luca-info" style="padding:15px;">
                        <h3 style="margin:0; font-size:0.95rem;">${game.name}</h3>
                        <p style="color:var(--text-dim); font-size:0.75rem; margin-top:8px;">${game.visits.toLocaleString()} Visits</p>
                    </div>
                </div>`;
        }).join('');

        // Render Groups
        document.getElementById('group-container').innerHTML = groupsData.map(group => {
            return `
                <div class="stat-pill" style="display:flex; align-items:center; gap:15px; padding:15px;">
                    <img src="image_256996.png" style="width:40px; height:40px; border-radius:8px;">
                    <div>
                        <div style="font-size:0.85rem; font-weight:600;">${group.name}</div>
                        <div style="font-size:0.7rem; color:var(--text-dim);">${group.memberCount.toLocaleString()} members</div>
                    </div>
                </div>`;
        }).join('');

    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', init);