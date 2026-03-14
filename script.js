// --- CONFIGURATION ---
const CONFIG = {
    // These are the three Universe IDs you provided
    universeIds: [9753920000, 9863921361, 9561068069], 
    
    // ACTION REQUIRED: Paste your Group ID inside the quotes below
    // You can find this in the URL of your Roblox Group page
    groupIds: ["PASTE_YOUR_GROUP_ID_HERE"] 
};

// --- Data Fetching ---
async function fetchGames(universeIds) {
    if (!universeIds || !universeIds.length) return [];
    try {
        const url = `https://games.roproxy.com/v1/games?universeIds=${universeIds.join(",")}`;
        const res = await fetch(url);
        const data = await res.json();
        return (data.data || []).sort((a, b) => b.playing - a.playing);
    } catch (e) {
        console.error("Error fetching games:", e);
        return [];
    }
}

async function fetchGroups(groupIds) {
    // Filters out the placeholder text so the site doesn't crash
    const validIds = groupIds.filter(id => id && id !== "PASTE_YOUR_GROUP_ID_HERE");
    if (!validIds.length) return [];
    
    try {
        const groupPromises = validIds.map(id => 
            fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(res => res.json())
        );
        const results = await Promise.all(groupPromises);
        return results.filter(g => g && g.id);
    } catch (e) {
        console.error("Error fetching groups:", e);
        return [];
    }
}

async function fetchAndRender() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '<p style="color:var(--text-dim)">Loading YouTubeZxme\'s creations...</p>';

    try {
        const [games, groups] = await Promise.all([
            fetchGames(CONFIG.universeIds),
            fetchGroups(CONFIG.groupIds)
        ]);

        updateStatsOverview(games);
        renderGames(games);
        renderGroups(groups);
        renderAnalyticsTable(games);
    } catch (err) {
        gameContainer.innerHTML = '<p style="color:red">Failed to load data. Please check your IDs.</p>';
        console.error("Initialization failed:", err);
    }
}

// --- UI Rendering ---
function updateStatsOverview(games) {
    let totalVisits = 0, totalPlaying = 0;
    games.forEach(g => {
        totalVisits += g.visits || 0;
        totalPlaying += g.playing || 0;
    });

    document.getElementById('total-games').innerText = games.length;
    document.getElementById('total-playing').innerText = totalPlaying.toLocaleString();
    
    const visitDisplay = totalVisits >= 1000000 
        ? (totalVisits / 1000000).toFixed(1) + "M" 
        : (totalVisits / 1000).toFixed(1) + "K";
    document.getElementById('total-visits').innerText = visitDisplay;
}

function renderGames(games) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    games.forEach(game => {
        const thumbUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${game.rootPlaceId}&width=420&height=420&format=png`;
        
        gameContainer.innerHTML += `
            <div class="game-card">
                <img src="${thumbUrl}" class="game-thumb" alt="${game.name}" onerror="this.src='https://tr.rbxcdn.com/431478796464f1e56b0996a6663f738a/420/420/Image/Png'">
                <div class="game-info">
                    <span class="playing-tag" style="color:var(--success); font-weight:bold;">● ${game.playing.toLocaleString()} Playing</span>
                    <h3 style="margin-top:10px;">${game.name}</h3>
                    <p style="color:var(--text-dim); font-size:0.9rem;">${game.visits.toLocaleString()} Total Visits</p>
                    <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" class="view-btn" style="color:var(--accent); text-decoration:none; display:inline-block; margin-top:10px;">Play Now →</a>
                </div>
            </div>`;
    });
}

function renderGroups(groups) {
    const groupContainer = document.getElementById('group-container');
    groupContainer.innerHTML = '';

    if (groups.length === 0) {
        groupContainer.innerHTML = '<p style="color:var(--text-dim)">No groups added yet.</p>';
        return;
    }

    groups.forEach(group => {
        groupContainer.innerHTML += `
            <div class="group-card">
                <img src="https://www.roblox.com/asset-thumbnail/set?assetId=${group.id}&width=150&height=150&format=png" class="group-logo" alt="${group.name}">
                <div class="group-info">
                    <h3 style="color:var(--accent)">${group.name}</h3>
                    <p style="color:var(--text-dim)">${group.memberCount.toLocaleString()} Members</p>
                </div>
            </div>`;
    });
}

function renderAnalyticsTable(games) {
    const tableBody = document.getElementById('analytics-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    games.forEach(game => {
        tableBody.innerHTML += `
            <tr>
                <td><strong>${game.name}</strong></td>
                <td style="color:var(--success)">${game.playing.toLocaleString()}</td>
                <td>${game.visits.toLocaleString()}</td>
                <td><a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" style="color:var(--accent); text-decoration:none;">Open ↗</a></td>
            </tr>`;
    });
}

document.addEventListener('DOMContentLoaded', fetchAndRender);