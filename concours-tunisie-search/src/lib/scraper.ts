import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export interface Concours {
  id: string;
  reference: string;
  ministry: string; // Or "Company" for STEG/SONEDE
  title: string;
  dateDeadline: string;
  link: string;
  source: 'Concours.gov' | 'STEG' | 'SONEDE';
}

interface Scraper {
  scrape(): Promise<Concours[]>;
}

class ConcoursGovScraper implements Scraper {
  private static URL = 'https://www.concours.gov.tn/P1/index5.aspx';

  async scrape(): Promise<Concours[]> {
    try {
      const response = await axios.get(ConcoursGovScraper.URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      const html = response.data;
      const $ = cheerio.load(html);
      const concoursList: Concours[] = [];

      const rows = $('#GVConcoursPublic tr');

      rows.each((index: number, element: any) => {
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
              link: ConcoursGovScraper.URL,
              source: 'Concours.gov'
            });
          }
        }
      });

      return concoursList;
    } catch (error) {
      console.error('ConcoursGovScraper error:', error);
      return [];
    }
  }
}

class SonedeScraper implements Scraper {
  private static URL = 'https://concours.sonede.com.tn/';

  async scrape(): Promise<Concours[]> {
    try {
      const response = await axios.get(SonedeScraper.URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      const $ = cheerio.load(response.data);
      const concoursList: Concours[] = [];

      $('table tr').each((i: number, row: any) => {
        const cells = $(row).find('td');
        if (cells.length < 2) return;

        const category = $(cells[0]).text().trim();
        const count = $(cells[1]).text().trim();
        const type = $(cells[2]).text().trim(); // e.g. "bal milfat"

        // Filter out headers/empty rows by checking for numeric content in count or specific keywords
        if (category && count && /^\d+$/.test(count)) {
          concoursList.push({
            id: `sonede-${i}`,
            reference: `SONEDE-${new Date().getFullYear()}`,
            ministry: 'SONEDE',
            title: `Concours ${category} (${count} postes)`,
            dateDeadline: 'Voir site',
            link: SonedeScraper.URL,
            source: 'SONEDE'
          });
        }
      });

      return concoursList;
    } catch (error) {
      console.error('SonedeScraper error:', error);
      return [];
    }
  }
}

class StegScraper implements Scraper {
  async scrape(): Promise<Concours[]> {
    // STEG site is currently seemingly unavailable or handled differently.
    // Returning empty list for now to avoid errors.
    return [];
  }
}

export async function scrapeConcours(): Promise<Concours[]> {
  const scrapers: Scraper[] = [
    new ConcoursGovScraper(),
    new StegScraper(),
    new SonedeScraper()
  ];

  const results = await Promise.all(scrapers.map(s => s.scrape()));
  return results.flat();
}
