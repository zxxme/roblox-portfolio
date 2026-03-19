const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];
const GROUP_IDS = [623751942, 524021069, 917252309];
const LOGO_FALLBACK = './images/miku_logo.png';

// Tab Switching Logic (Updated for .nav-item)
document.querySelectorAll('.nav-pill .nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-pill .nav-item').forEach(b => b.classList.remove('active'));
        
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        e.target.classList.add('active');
    });
});

// Fetch Data
async function init() {
    try {
        // --- FETCH GAMES ---
        if (UNIVERSE_IDS.length > 0) {
            const universeQuery = UNIVERSE_IDS.join(',');
            
            // Fetch game data (Fixed URL)
            const gRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${universeQuery}`);
            const { data: games } = await gRes.json();
            
            // Fetch game thumbnails (Fixed URL)
            const tRes = await fetch(`https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeQuery}&size=512x512&format=Png&isCircular=false`);
            const { data: thumbs } = await tRes.json();
            
            if (games && thumbs) {
                document.getElementById('game-grid').innerHTML = games.map(g => {
                    const thumbData = thumbs.find(t => t.targetId === g.id);
                    const thumbUrl = thumbData ? thumbData.imageUrl : LOGO_FALLBACK;
                    
                    return `
                        <a href="https://roblox.com/games/${g.rootPlaceId}" target="_blank" class="bento-card">
                            <div class="thumb-box">
                                <img src="${thumbUrl}" onerror="this.src='${LOGO_FALLBACK}'">
                            </div>
                            <span class="label">Experience</span>
                            <h3 class="title">${g.name}</h3>
                            <div class="status">
                                <div class="dot"></div> ${g.playing.toLocaleString()} Playing
                            </div>
                        </a>
                    `;
                }).join('');
            }
        }

        // --- FETCH GROUPS ---
        if (GROUP_IDS.length > 0) {
            const groupQuery = GROUP_IDS.join(',');
            
            // Fetch group data (Fixed URL)
            const groupPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
            const groups = await Promise.all(groupPromises);
            
            // Fetch group icons (Fixed URL)
            const iRes = await fetch(`https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${groupQuery}&size=150x150&format=Png`);
            const { data: icons } = await iRes.json();
            
            document.getElementById('group-grid').innerHTML = groups.map(group => {
                const iconData = icons.find(i => i.targetId === group.id);
                const iconUrl = iconData ? iconData.imageUrl : LOGO_FALLBACK;
                
                return `
                    <a href="https://roblox.com/groups/${group.id}" target="_blank" class="bento-card" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                        <img src="${iconUrl}" style="width: 80px; height: 80px; border-radius: 20px; border: 1px solid var(--border); margin-bottom: 15px;" onerror="this.src='${LOGO_FALLBACK}'">
                        <span class="label">Community</span>
                        <h3 class="title" style="margin-bottom: 5px;">${group.name}</h3>
                        <p style="font-size:32px; font-weight:800; color: var(--text);">${group.memberCount.toLocaleString()}</p>
                        <span class="label" style="margin-top: 5px;">Members</span>
                    </a>
                `;
            }).join('');
        }
    } catch(e) { 
        console.error("Data error:", e); 
        document.getElementById('game-grid').innerHTML = `<p style="color: var(--red);">Failed to load data. RoProxy might be rate-limiting.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
