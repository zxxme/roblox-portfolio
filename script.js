const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];
const GROUP_IDS = [623751942, 524021069, 917252309];

function showTab(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    btn.classList.add('active');
}

async function loadData() {
    try {
        // Fetch Games
        const gRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`);
        const { data: games } = await gRes.json();

        if (games) {
            document.getElementById('game-grid').innerHTML = games.map(g => `
                <a href="https://roblox.com/games/${g.rootPlaceId}" target="_blank" class="bento-card">
                    <div class="thumb-box">
                        <img src="https://thumbnails.roproxy.com/v1/games/icons?universeIds=${g.id}&size=512x512&format=Png&isCircular=false" onerror="this.src='./images/miku_logo.png'">
                    </div>
                    <span class="label">Experience</span>
                    <h3 class="title">${g.name}</h3>
                    <div class="status"><div class="dot"></div>${g.playing} Playing</div>
                </a>
            `).join('');
        }

        // Fetch Groups
        const groupGrid = document.getElementById('group-grid');
        const groupPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
        const groups = await Promise.all(groupPromises);

        groupGrid.innerHTML = groups.map(group => `
            <div class="bento-card">
                <img src="https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${group.id}&size=150x150&format=Png" style="width:60px; border-radius:12px; margin-bottom:15px;">
                <span class="label">Community</span>
                <h3 class="title">${group.name}</h3>
                <p style="font-size:32px; font-weight:800;">${group.memberCount.toLocaleString()}</p>
                <span class="label">Members</span>
            </div>
        `).join('');

    } catch (e) { console.error("Load failed", e); }
}

document.addEventListener('DOMContentLoaded', loadData);