const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];
const GROUP_IDS = [623751942, 524021069, 917252309];
const LOGO_FALLBACK = './images/miku_logo.png';

// Format numbers (e.g., 1,200,000 -> 1.2M)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

async function init() {
    try {
        let totalVisits = 0;
        let totalPlaying = 0;

        // --- FETCH GAMES ---
        if (UNIVERSE_IDS.length > 0) {
            const universeQuery = UNIVERSE_IDS.join(',');
            
            const gRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${universeQuery}`);
            const { data: games } = await gRes.json();
            
            const tRes = await fetch(`https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeQuery}&size=150x150&format=Png&isCircular=false`);
            const { data: thumbs } = await tRes.json();
            
            if (games && thumbs) {
                document.getElementById('game-list').innerHTML = games.map(g => {
                    const thumbData = thumbs.find(t => t.targetId === g.id);
                    const thumbUrl = thumbData ? thumbData.imageUrl : LOGO_FALLBACK;
                    
                    // Add to total stats
                    totalVisits += g.visits || 0;
                    totalPlaying += g.playing || 0;
                    
                    return `
                        <a href="https://roblox.com/games/${g.rootPlaceId}" target="_blank" class="item-card">
                            <img src="${thumbUrl}" class="item-icon" onerror="this.src='${LOGO_FALLBACK}'">
                            <div class="item-info">
                                <div class="item-title">${g.name}</div>
                                <div class="item-desc">${g.description ? g.description.substring(0, 120) + '...' : 'No description provided.'}</div>
                                <div class="item-stats">
                                    <div class="stat-badge"><div class="playing-dot"></div> ${formatNumber(g.playing || 0)} Playing</div>
                                    <div class="stat-badge">👁️ ${formatNumber(g.visits || 0)} Visits</div>
                                </div>
                            </div>
                        </a>
                    `;
                }).join('');
            }
        }

        // Update Top Header Stats
        document.getElementById('total-games').innerText = UNIVERSE_IDS.length;
        document.getElementById('total-visits').innerText = formatNumber(totalVisits);
        document.getElementById('total-playing').innerText = formatNumber(totalPlaying);

        // --- FETCH GROUPS ---
        if (GROUP_IDS.length > 0) {
            const groupPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
            const groups = await Promise.all(groupPromises);
            
            const iRes = await fetch(`https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${GROUP_IDS.join(',')}&size=150x150&format=Png`);
            const { data: icons } = await iRes.json();
            
            document.getElementById('group-list').innerHTML = groups.map(group => {
                const iconData = icons.find(i => i.targetId === group.id);
                const iconUrl = iconData ? iconData.imageUrl : LOGO_FALLBACK;
                
                return `
                    <a href="https://roblox.com/groups/${group.id}" target="_blank" class="item-card">
                        <img src="${iconUrl}" class="item-icon" style="border-radius: 50%;" onerror="this.src='${LOGO_FALLBACK}'">
                        <div class="item-info">
                            <div class="item-title">${group.name}</div>
                            <div class="item-
