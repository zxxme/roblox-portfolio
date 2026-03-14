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
        
        document.getElementById('total-visits').innerText = (games.reduce((s, g) => s + (g.visits || 0), 0) / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();

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
                    <div class="luca-info" style="padding:20px;">
                        <h3 style="margin:0; font-size:1rem;">${game.name}</h3>
                        <p style="color:var(--text-dim); font-size:0.8rem; margin:10px 0 0;">${game.visits.toLocaleString()} Visits</p>
                    </div>
                </div>`;
        }).join('');

    } catch (e) { console.error(e); }
}
document.addEventListener('DOMContentLoaded', init);