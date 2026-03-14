function showSection(sectionId, element) {
    document.querySelectorAll('.page-section').forEach(p => p.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
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

        const thumbRes = await fetch(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${CONFIG.universeIds.join(",")}&size=768x432&format=Png`).then(r => r.json());
        const thumbMap = {};
        thumbRes.data.forEach(t => thumbMap[t.universeId] = t.thumbnails[0]?.imageUrl);

        document.getElementById('game-container').innerHTML = gamesRes.data.map(game => `
            <div class="game-card-luca" onclick="window.open('https://www.roblox.com/games/${game.rootPlaceId}')">
                <img class="luca-thumb" src="${thumbMap[game.id] || './images/miku_avatar.png'}">
                <div style="padding:20px;">
                    <h3>${game.name}</h3>
                    <p>${game.visits.toLocaleString()} Visits • ${game.playing} Active</p>
                </div>
            </div>`).join('');

        lucide.createIcons();
    } catch (e) { console.error(e); }
}
document.addEventListener('DOMContentLoaded', init);