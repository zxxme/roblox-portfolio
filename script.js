
// --- CONFIGURATION ---
// Add or remove universe/group IDs as needed
const CONFIG = {
    universeIds: [12345678, 87654321], // Example: [12345678, 87654321]
    groupIds: ["0000000"] // Example: ["1234567", "7654321"]
};

// --- Data Fetching ---
async function fetchGames(universeIds) {
    if (!universeIds.length) return [];
    const url = `https://games.roproxy.com/v1/games?universeIds=${universeIds.join(",")}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
}

async function fetchGroups(groupIds) {
    if (!groupIds.length) return [];
    // Only fetch the first group for now (can be expanded)
    const url = `https://groups.roproxy.com/v1/groups/${groupIds[0]}`;
    const res = await fetch(url);
    if (res.status !== 200) return [];
    const data = await res.json();
    return [data];
}

async function fetchAndRender() {
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
        console.error("Failed to fetch Roblox data:", err);
    }
}

// --- UI Rendering ---
function updateStatsOverview(games) {
    let totalVisits = 0, totalPlaying = 0;
    games.forEach(g => {
        totalVisits += g.visits;
        totalPlaying += g.playing;
    });
    document.getElementById('total-games').innerText = games.length;
    document.getElementById('total-playing').innerText = totalPlaying;
    document.getElementById('total-visits').innerText = (totalVisits / 1000000).toFixed(1) + "M";
}

function renderGames(games) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    games.forEach(game => {
        gameContainer.innerHTML += `
            <div class="game-card">
                <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${game.rootPlaceId}&width=420&height=420&format=png" class="game-thumb" alt="${game.name}">
                <div class="game-info">
                    <span style="color:var(--success)">● ${game.playing} Playing</span>
                    <h3>${game.name}</h3>
                    <p style="color:var(--text-dim)">${(game.visits / 1000000).toFixed(1)}M+ Visits</p>
                </div>
            </div>`;
    });
}

function renderGroups(groups) {
    const groupContainer = document.getElementById('group-container');
    groupContainer.innerHTML = '';
    groups.forEach(group => {
        groupContainer.innerHTML += `
            <div class="group-card">
                <img src="https://www.roblox.com/asset-thumbnail/set?assetId=${group.id}&width=150&height=150&format=png" class="group-logo" alt="${group.name}">
                <div class="group-info">
                    <h3>${group.name}</h3>
                    <p style="color:var(--text-dim)">${group.memberCount.toLocaleString()} Members</p>
                </div>
            </div>`;
    });
}

function renderAnalyticsTable(games) {
    const tableBody = document.getElementById('analytics-body');
    tableBody.innerHTML = '';
    games.forEach(game => {
        tableBody.innerHTML += `
            <tr>
                <td>${game.name}</td>
                <td style="color:var(--success)">${game.playing}</td>
                <td>${game.visits.toLocaleString()}</td>
                <td><a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" style="color:var(--accent)">View</a></td>
            </tr>`;
    });
}

// --- INIT ---
fetchAndRender();