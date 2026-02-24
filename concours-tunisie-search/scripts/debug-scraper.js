const https = require('http'); // http since the site is http
const fs = require('fs');

const CONCOURS_URL = 'http://www.concours.gov.tn/INDEX.PHP?id=140';

console.log('Fetching HTML...');

const req = https.get(CONCOURS_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('HTML length:', data.length);
        fs.writeFileSync('temp_concours.html', data);
        console.log('Saved HTML to temp_concours.html');
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});
