// Configuration
const UNIVERSE_IDS = [9753920000, 9863921361, 9561068069];
const GROUP_IDS = [623751942, 524021069, 917252309];

// Formatter (e.g., 1100000 -> 1.1M)
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
            const gRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(',')}`);
            const { data: games } = await gRes.json();
            
            if (games) {
                // Sort games by playing count (highest first)
                games.sort((a, b) => (b.playing || 0) - (a.playing || 0));

                document.getElementById('games-container').innerHTML = games.map(g => {
                    const visits = g.visits || 0;
                    const playing = g.playing || 0;
                    
                    totalVisits += visits;
                    totalPlaying += playing;
                    
                    return `
                        <a href="https://roblox.com/games/${g.rootPlaceId}" target="_blank" class="game-row">
                            <div class="game-header">
                                <div class="game-title-area">
                                    <span class="game-playing-badge">${playing} playing</span>
                                    <h3 class="game-title">${g.name}</h3>
                                </div>
                            </div>
                            <p class="game-desc">${g.description ? g.description.replace(/\n/g, ' ') : 'No description available.'}</p>
                            
                            <div class="game-stats-footer">
                                <div class="stat-item">
                                    <span class="stat-item-value">${playing}</span>
                                    <span class="stat-item-label">Playing</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-item-value">${formatNumber(visits)}</span>
                                    <span class="stat-item-label">Visits</span>
                                </div>
                            </div>
                        </a>
                    `;
                }).join('');
            }
        }

        // Update Top Stats Overview
        document.getElementById('overview-games').innerText = UNIVERSE_IDS.length;
        document.getElementById('overview-visits').innerText = formatNumber(totalVisits);
        document.getElementById('overview-playing').innerText = formatNumber(totalPlaying);
        
        // Update Section Header Badges
        document.getElementById('total-playing-badge').innerText = `${totalPlaying} playing`;

        // --- FETCH GROUPS ---
        if (GROUP_IDS.length > 0) {
            const groupPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
            const groups = await Promise.all(groupPromises);
            
            document.getElementById('groups-container').innerHTML = groups.map(g => {
                return `
                    <a href="https://roblox.com/groups/${g.id}" target="_blank" class="game-row">
                        <div class="game-header">
                            <div class="game-title-area">
                                <h3 class="game-title">${g.name}</h3>
                            </div>
                        </div>
                        <p class="game-desc">${g.description ? g.description.replace(/\n/g, ' ') : 'Community group.'}</p>
                        <div class="game-stats-footer">
                            <div class="stat-item">
                                <span class="stat-item-value">${formatNumber(g.memberCount || 0)}</span>
                                <span class="stat-item-label">Members</span>
                            </div>
                        </div>
                    </a>
                `;
            }).join('');
        }
    } catch(e) { 
        console.error("Data error:", e); 
    }
}

document.addEventListener('DOMContentLoaded', init);
