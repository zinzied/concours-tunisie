const axios = require('axios');
const cheerio = require('cheerio');

const CONCOURS_URL = 'https://www.concours.gov.tn/P1/index5.aspx';

async function scrapeConcours() {
    try {
        const response = await axios.get(CONCOURS_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const concoursList = [];

        // STEG Discovery
        const STEG_URL = 'https://www.steg.com.tn/fr/concours/avis_concours.php';
        try {
            console.log(`Fetching STEG: ${STEG_URL}...`);
            const response = await axios.get(STEG_URL, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
                validateStatus: () => true
            });
            console.log('STEG Status:', response.status);
        } catch (e) { console.error('STEG Error:', e.message); }

        // SONEDE Verification
        const SONEDE_URL = 'https://concours.sonede.com.tn/';
        try {
            console.log(`Fetching SONEDE: ${SONEDE_URL}...`);
            const response = await axios.get(SONEDE_URL, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
            });
            const $sonede = cheerio.load(response.data);
            $sonede('table tr').each((i, row) => {
                if (i < 5) {
                    const cells = $sonede(row).find('td').map((j, cell) => $sonede(cell).text().trim().replace(/\s+/g, ' ')).get();
                    console.log(`SONEDE Row ${i}: [${cells.join(' | ')}]`);
                }
            });
        } catch (e) { console.error('SONEDE Error:', e.message); }

        return [];

        const rows = $('#GVConcoursPublic tr');

        rows.each((index, element) => {
            const tds = $(element).find('td');
            if (tds.length === 0) return;

            if (tds.length >= 6) {
                const id = $(tds[0]).text().trim();
                const reference = $(tds[1]).text().trim();
                const ministry = $(tds[2]).text().trim();
                const title = $(tds[3]).text().trim();
                const dateDeadline = $(tds[5]).text().trim();

                if (title && ministry) {
                    concoursList.push({
                        id: id || Math.random().toString(36).substr(2, 9),
                        reference,
                        ministry,
                        title,
                        dateDeadline,
                        link: CONCOURS_URL
                    });
                }
            }
        });

        return concoursList;
    } catch (error) {
        console.error('Error scraping concours:', error);
        return [];
    }
}

async function main() {
    console.log('Starting scraper verification (JS)...');
    try {
        const data = await scrapeConcours();
        console.log(`Scraper returned ${data.length} items.`);
        if (data.length > 0) {
            console.log('First item sample:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('WARNING: No items found.');
        }
    } catch (error) {
        console.error('Scraper failed:', error);
    }
}

main();
