import { scrapeConcours } from '../src/lib/scraper';

async function main() {
    console.log('Starting scraper verification...');
    try {
        const data = await scrapeConcours();
        console.log(`Scraper returned ${data.length} items.`);
        if (data.length > 0) {
            console.log('First item sample:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('WARNING: No items found. Selector might be incorrect.');
        }
    } catch (error) {
        console.error('Scraper failed:', error);
    }
}

main();
