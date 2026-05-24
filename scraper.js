const fs = require('fs');

async function getCinesubData() {
    console.log("සිනෙසබ් නිල දත්ත පද්ධතියට සම්බන්ධ වෙමින් පවතී...");
    try {
        // සිනෙසබ් අඩවියේ නිල WordPress REST API එකෙන් කෙලින්ම ෆිල්ම්ස් ලබාගැනීම
        const response = await fetch('https://cinesub.lk/wp-json/wp/v2/posts?per_page=20&_embed');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        let movieData = [];

        posts.forEach(post => {
            // ෆිල්ම් එකේ නම
            let title = post.title.rendered;
            
            // ෆිල්ම් එකේ ලින්ක් එක
            let link = post.link;
            
            // ෆිල්ම් පෝස්ටර් එක (Featured Image)
            let image = "No Image";
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia']) {
                image = post._embedded['wp:featuredmedia'].source_url;
            }

            movieData.push({
                title: title,
                image: image,
                link: link
              });
        });

        // දත්ත ටික ෆයිල් එකට ලිවීම
        fs.writeFileSync('movies.json', JSON.stringify(movieData, null, 2));
        console.log(`සාර්ථකයි! චිත්‍රපට ${movieData.length} ක දත්ත සුරකින ලදී.`);

    } catch (error) {
        console.error("දත්ත ලබාගැනීමේදී දෝෂයක් සිදු විය:", error.message);
        fs.writeFileSync('movies.json', JSON.stringify([]));
    }
}

getCinesubData();
