const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];
const GROUP_IDS = [623751942, 524021069, 917252309];

function showTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

document.addEventListener('mousemove', (e) => {
    const glow = document.getElementById('mouse-glow');
    if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    }
});

async function init() {
    try {
        // 1. Fetch Games
        const gameRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`);
        const { data: games } = await gameRes.json();

        if (games) {
            const v = games.reduce((a, b) => a + (b.visits || 0), 0);
            const p = games.reduce((a, b) => a + (b.playing || 0), 0);
            
            document.getElementById('v-total').innerText = v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v.toLocaleString();
            document.getElementById('p-total').innerText = p.toLocaleString();

            document.getElementById('game-grid').innerHTML = games.map(g => {
                // Using a more reliable thumbnail format
                const thumbUrl = `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${g.id}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`;
                
                return `
                <div class="bento-card" onclick="window.open('https://roblox.com/games/${g.rootPlaceId}')">
                    <div class="thumb-wrapper">
                        <img class="game-thumb" src="${thumbUrl}" onerror="this.src='./images/miku_logo.png'">
                    </div>
                    <span class="label">Experience</span>
                    <h3 class="game-title">${g.name}</h3>
                    <div class="badge"><div class="dot"></div> ${g.playing} Playing</div>
                </div>`;
            }).join('');
        }

        // 2. Fetch Groups
        const groupGrid = document.getElementById('group-grid');
        const groupDataPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
        const groups = await Promise.all(groupDataPromises);

        groupGrid.innerHTML = groups.map(group => {
            const groupIconUrl = `https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${group.id}&size=150x150&format=Png`;
            
            return `
            <div class="bento-card group-card" onclick="window.open('https://www.roblox.com/groups/${group.id}')">
                <img src="${groupIconUrl}" class="group-icon" onerror="this.src='./images/miku_logo.png'">
                <span class="label">Community</span>
                <h3 class="group-title">${group.name}</h3>
                <div class="value small">${group.memberCount.toLocaleString()}</div>
                <span class="label">Members</span>
            </div>`;
        }).join('');

        if (window.lucide) lucide.createIcons();
    } catch (e) { console.error("Update failed:", e); }
}

document.addEventListener('DOMContentLoaded', init);