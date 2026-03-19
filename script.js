// Added the Universe ID for PvpMasters at the end of the array
const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069, 5857508781];
const GROUP_IDS = [623751942, 524021069, 917252309];
const LOGO_FALLBACK = './images/miku_logo.png';

// Tab Switching Logic
document.querySelectorAll('.nav-pill .nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-pill .nav-item').forEach(b => b.classList.remove('active'));
        
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        e.target.classList.add('active');
    });
});

// Format Numbers (e.g. 1000000 -> 1.0M, or 10,000)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

async function init() {
    try {
        // --- FETCH GAMES ---
        if (UNIVERSE_IDS.length > 0) {
            const universeQuery = UNIVERSE_IDS.join(',');
            
            const gRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${universeQuery}`);
            const { data: games } = await gRes.json();
            
            const tRes = await fetch(`https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeQuery}&size=512x512&format=Png&isCircular=false`);
            const { data: thumbs } = await tRes.json();
            
            if (games && thumbs) {
                document.getElementById('game-grid').innerHTML = games.map(g => {
                    const thumbData = thumbs.find(t => t.targetId === g.id);
                    const thumbUrl = thumbData ? thumbData.imageUrl : LOGO_FALLBACK;
                    
                    const playingCount = g.playing ? formatNumber(g.playing) : "0";
                    const visitsCount = g.visits ? formatNumber(g.visits) : "0";
                    
                    // Shorten description so it doesn't break the card size
                    let descText = g.description || "No description provided.";
                    if (descText.length > 70) descText = descText.substring(0, 70) + "...";
                    
                    return `
                        <a href="https://roblox.com/games/${g.rootPlaceId}" target="_blank" class="bento-card">
                            <div class="thumb-box">
                                <img src="${thumbUrl}" onerror="this.src='${LOGO_FALLBACK}'" alt="Game Icon">
                            </div>
                            <span class="label">Experience</span>
                            <h3 class="title">${g.name}</h3>
                            <p class="desc game-desc">${descText}</p>
                            
                            <div class="card-stats">
                                <div class="status">
                                    <div class="dot"></div> ${playingCount} Playing
                                </div>
                                <div class="visits-stat">
                                    👁️ ${visitsCount} Visits
                                </div>
                            </div>
                        </a>
                    `;
                }).join('');
            }
        }

        // --- FETCH GROUPS ---
        if (GROUP_IDS.length > 0) {
            const groupPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
            const groups = await Promise.all(groupPromises);
            
            const groupQuery = GROUP_IDS.join(',');
            const iRes = await fetch(`https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${groupQuery}&size=150x150&format=Png`);
            const { data: icons } = await iRes.json();
            
            document.getElementById('group-grid').innerHTML = groups.map(group => {
                const iconData = icons.find(i => i.targetId === group.id);
                const iconUrl = iconData ? iconData.imageUrl : LOGO_FALLBACK;
                const memberCount = group.memberCount ? formatNumber(group.memberCount) : "0";
                
                return `
                    <a href="https://roblox.com/groups/${group.id}" target="_blank" class="bento-card group-card">
                        <img src="${iconUrl}" class="group-icon" onerror="this.src='${LOGO_FALLBACK}'" alt="Group Icon">
                        <span class="label">Community</span>
                        <h3 class="title" style="margin-bottom: 4px;">${group.name}</h3>
                        <p class="member-count">${memberCount}</p>
                        <span class="label" style="margin-bottom: 0;">Members</span>
                    </a>
                `;
            }).join('');
        }
    } catch(e) { 
        console.error("Data error:", e); 
        document.getElementById('game-grid').innerHTML = `<p style="color: var(--red);">Failed to load data. Please try again later.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
