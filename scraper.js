const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeCinesub() {
    console.log("සිනෙසබ් අඩවියට සම්බන්ධ වෙමින් පවතී...");
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto('https://cinesub.lk/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 5000));

        const movies = await page.evaluate(() => {
            let movieData = [];
            let items = document.querySelectorAll('article, .result-item, .post-column'); 
            
            items.forEach(item => {
                let titleElement = item.querySelector('h2, h3, .entry-title a');
                let title = titleElement ? titleElement.innerText.trim() : 'No Title';

                let imgElement = item.querySelector('img');
                let image = imgElement ? imgElement.getAttribute('src') : 'No Image';

                let linkElement = item.querySelector('a');
                let link = linkElement ? linkElement.getAttribute('href') : '#';

                if (title !== 'No Title' && link !== '#') {
                    movieData.push({ title, image, link });
                }
            });
            return movieData;
        });

        fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2));
        console.log("දත්ත සාර්ථකව movies.json එකට සේව් කරන ලදී!");

    } catch (error) {
        console.error("දෝෂයක් සිදු විය:", error.message);
    } finally {
        await browser.close();
    }
}

scrapeCinesub();
