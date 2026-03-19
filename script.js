const UNIVERSE_IDS = [
    9753920000,
    9863921361,
    9561068069,
    3827663248 // PvpMasters
];

const GROUP_IDS = [623751942, 524021069, 917252309];
const LOGO_FALLBACK = "./images/miku_logo.png";

// Tabs
document.querySelectorAll(".nav-item[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
        document.getElementById(btn.dataset.target).classList.add("active");
        btn.classList.add("active");
    });
});

// Number formatter
function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
}

async function init() {
    try {
        const universeQuery = UNIVERSE_IDS.join(",");

        // ✅ GAMES
        const gamesRes = await fetch(
            `https://games.roproxy.com/v1/games?universeIds=${universeQuery}`
        );
        const gamesJson = await gamesRes.json();

        const thumbsRes = await fetch(
            `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeQuery}&size=512x512&format=Png&isCircular=false`
        );
        const thumbsJson = await thumbsRes.json();

        const games = gamesJson.data;
        const thumbs = thumbsJson.data;

        document.getElementById("game-grid").innerHTML = games.map(game => {
            const thumb = thumbs.find(t => t.targetId === game.id);
            const img = thumb ? thumb.imageUrl : LOGO_FALLBACK;

            return `
                <a href="https://www.roblox.com/games/${game.rootPlaceId}" target="_blank" class="bento-card">
                    <div class="thumb-box">
                        <img src="${img}" onerror="this.src='${LOGO_FALLBACK}'">
                    </div>
                    <span class="label">Experience</span>
                    <h3 class="title">${game.name}</h3>
                    <p class="desc game-desc">${game.description?.slice(0, 80) || "No description"}...</p>

                    <div class="card-stats">
                        <div class="status">
                            <div class="dot"></div> ${formatNumber(game.playing)} Playing
                        </div>
                        <div class="visits-stat">
                            👁️ ${formatNumber(game.visits)} Visits
                        </div>
                    </div>
                </a>
            `;
        }).join("");

        // ✅ GROUPS
        const groupData = await Promise.all(
            GROUP_IDS.map(id =>
                fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json())
            )
        );

        const groupThumbsRes = await fetch(
            `https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${GROUP_IDS.join(",")}&size=150x150&format=Png`
        );
        const groupThumbs = (await groupThumbsRes.json()).data;

        document.getElementById("group-grid").innerHTML = groupData.map(group => {
            const icon = groupThumbs.find(i => i.targetId === group.id);
            const img = icon ? icon.imageUrl : LOGO_FALLBACK;

            return `
                <a href="https://www.roblox.com/groups/${group.id}" target="_blank" class="bento-card group-card">
                    <img src="${img}" class="group-icon" onerror="this.src='${LOGO_FALLBACK}'">
                    <span class="label">Community</span>
                    <h3 class="title">${group.name}</h3>
                    <p class="member-count">${formatNumber(group.memberCount)}</p>
                    <span class="label">Members</span>
                </a>
            `;
        }).join("");

    } catch (err) {
        console.error(err);
        document.getElementById("game-grid").innerHTML =
            `<p style="color:#ff4747">Failed to load data.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", init);
