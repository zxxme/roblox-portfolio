async function init() {
    try {
        // FETCH GAMES
        const gRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UNIVERSE_IDS.join(",")}`);
        const { data: games } = await gRes.json();
        
        if(games) {
            document.getElementById('game-grid').innerHTML = games.map(g => {
                // AGGRESSIVE THUMBNAIL FIX:
                // We use the PlaceId and add a timestamp to force the browser to bypass any block.
                const time = new Date().getTime();
                const thumbUrl = `https://thumbnails.roproxy.com/v1/places/game-icons?placeIds=${g.rootPlaceId}&size=512x512&format=Png&isCircular=false&_=${time}`;
                
                return `
                    <a href="https://roblox.com/games/${g.rootPlaceId}" target="_blank" class="card">
                        <div class="thumb-box">
                            <img src="${thumbUrl}" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.5s;" onerror="this.src='./images/miku_logo.png'">
                        </div>
                        <span class="label">Experience</span>
                        <h3 class="title">${g.name}</h3>
                        <div class="status"><div class="dot"></div>${g.playing} Playing</div>
                    </a>
                `;
            }).join('');
        }

        // FETCH GROUPS
        const groupPromises = GROUP_IDS.map(id => fetch(`https://groups.roproxy.com/v1/groups/${id}`).then(r => r.json()));
        const groups = await Promise.all(groupPromises);
        
        document.getElementById('group-grid').innerHTML = groups.map(group => {
            const time = new Date().getTime();
            const groupIcon = `https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${group.id}&size=150x150&format=Png&_=${time}`;

            return `
                <div class="card">
                    <img src="${groupIcon}" class="group-icon" onerror="this.src='./images/miku_logo.png'">
                    <span class="label">Community</span>
                    <h3 class="title">${group.name}</h3>
                    <p style="font-size:36px; font-weight:800;">${group.memberCount.toLocaleString()}</p>
                    <span class="label">Members</span>
                </div>
            `;
        }).join('');

    } catch(e) { console.error("Data error:", e); }
}