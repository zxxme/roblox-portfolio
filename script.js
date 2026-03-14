function showSection(sectionId, element) {
    document.querySelectorAll('.page-section').forEach(p => p.style.display = 'none');
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    element.classList.add('active');
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
        document.getElementById('total-visits').innerText = (games.reduce((s, g) => s + (g.visits || 0), 0) / 1000000).toFixed(1) + "M";
        document.getElementById('total-playing').innerText = games.reduce((s, g) => s + (g.playing || 0), 0).toLocaleString();

        document.getElementById('game-container').innerHTML = games.map(game => {
            let thumb = "image_247137.png"; // Fallback image
            const n = game.name.toLowerCase();
            
            // Image mapping logic
            if (n.includes("tapping") || n.includes("titan")) {
                thumb = "image_247137.png";
            } else if (n.includes("yeet") || n.includes("brainrot")) {
                thumb = "image_2fc6fc.png";
            } else if (n.includes("pet")) {
                thumb = "Pet Collectors Thumbnail (2).png";
            }

            return `
                <div class="game-card-luca">
                    <div class="luca-thumb-wrapper">
                        <img class="luca-thumb" src="./images/${thumb}" onerror="this.src='./images/image_247137.png'">
                        <div class="playing-badge"><span class="badge-dot"></span>${game.playing.toLocaleString()} playing</div>
                    </div>
                    <div style="padding:15px;">
                        <h3 style="margin:0; font-size:0.9rem;">${game.name}</h3>
                        <p style="color:var(--text-dim); font-size:0.75rem; margin-top:5px;">${game.visits.toLocaleString()} Visits</p>
                    </div>
                </div>`;
        }).join('');

        // Updating community icons to use the working image
        document.getElementById('group-container').innerHTML = groupsData.map(group => `
            <div class="group-card">
                <img src="./images/image_247137.png" class="group-icon">
                <div>
                    <div style="font-weight:600; font-size:0.9rem;">${group.name}</div>
                    <div style="color:var(--text-dim); font-size:0.75rem;">${group.memberCount.toLocaleString()} Members</div>
                </div>
            </div>`).join('');

        lucide.createIcons();
    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', init);