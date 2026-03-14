document.getElementById('game-container').innerHTML = games.map(game => {
    let thumb = "image_256996.png"; // Fallback filename
    const n = game.name.toLowerCase();
    
    // Map the keywords to your filenames
    if (n.includes("tapping")) {
        thumb = "image_247137.png";
    } else if (n.includes("yeet") || n.includes("brainrot")) {
        thumb = "image_2fc6fc.png";
    } else if (n.includes("pet")) {
        thumb = "Pet Collectors Thumbnail (2).png";
    }

    return `
        <div class="game-card-luca">
            <div class="luca-thumb-wrapper">
                <img class="luca-thumb" src="./images/${thumb}" onerror="this.src='./images/image_256996.png'">
                <div class="playing-badge">
                    <span class="badge-dot"></span>
                    ${(game.playing || 0).toLocaleString()} playing
                </div>
            </div>
            <div style="padding:15px;">
                <h3 style="margin:0; font-size:0.9rem;">${game.name}</h3>
                <p style="color:var(--text-dim); font-size:0.75rem; margin-top:5px;">
                    ${(game.visits || 0).toLocaleString()} Visits
                </p>
            </div>
        </div>`;
}).join('');