/**
 * Naukri.com JD Crawler
 * Uses cheerio HTML scraping (no official API available for free tier)
 * Targets: Azure DevOps + Cloud Engineering roles, Hyderabad, 5-12 yrs
 * Run via: npx ts-node crawlers/naukri/crawler.ts
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeJob, extractSkills } from '../shared/job-normalizer';
import { saveJobToDb } from '../shared/db-writer';

const BASE_URL = 'https://www.naukri.com';

const SEARCH_CONFIGS = [
  { keyword: 'azure-devops-engineer', experience: '5-10', location: 'hyderabad' },
  { keyword: 'cloud-engineer-azure', experience: '5-10', location: 'hyderabad' },
  { keyword: 'platform-engineer-kubernetes', experience: '4-9', location: 'hyderabad' },
  { keyword: 'devops-engineer-terraform-aks', experience: '5-10', location: 'hyderabad' },
  { keyword: 'sre-azure-cloud', experience: '5-12', location: 'hyderabad' },
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
};

interface RawNaukriJob {
  title: string;
  company: string;
  experience: string;
  salary: string;
  location: string;
  skills: string[];
  postedAt: string;
  url: string;
  jobId: string;
}

async function crawlNaukri(): Promise<void> {
  let totalSaved = 0;

  for (const config of SEARCH_CONFIGS) {
    try {
      const jobs = await scrapeSearchResults(config);
      console.log(`[Naukri] "${config.keyword}" → ${jobs.length} results`);

      for (const job of jobs) {
        const normalized = await normalizeJob(job, 'naukri');
        const withSkills = await extractSkills(normalized);
        await saveJobToDb(withSkills);
        totalSaved++;
        await delay(2000 + Math.random() * 2000);
      }
    } catch (err) {
      console.error(`[Naukri] Error for query "${config.keyword}":`, err);
    }
  }

  console.log(`[Naukri] Done. Total saved: ${totalSaved}`);
}

async function scrapeSearchResults(config: {
  keyword: string;
  experience: string;
  location: string;
}): Promise<RawNaukriJob[]> {
  // Naukri URL pattern: /keyword-jobs-in-location?experience=5-10
  const url = `${BASE_URL}/${config.keyword}-jobs-in-${config.location}?experience=${config.experience}&jobAge=1`;

  const response = await axios.get(url, {
    headers: HEADERS,
    timeout: 15000,
  });

  const $ = cheerio.load(response.data);
  const jobs: RawNaukriJob[] = [];

  // Naukri renders job cards with these selectors (as of 2025)
  $('article.jobTuple').each((_, el) => {
    try {
      const title = $(el).find('.title').text().trim();
      const company = $(el).find('.companyInfo .subTitle').text().trim();
      const experience = $(el).find('.experience').text().trim();
      const salary = $(el).find('.salary').text().trim();
      const location = $(el).find('.location span').text().trim();
      const postedAt = $(el).find('.jobAge').text().trim();
      const relUrl = $(el).find('a.title').attr('href') ?? '';
      const url = relUrl.startsWith('http') ? relUrl : `${BASE_URL}${relUrl}`;
      const jobId = $(el).attr('data-job-id') ?? '';

      // Skills listed inline on card
      const skills: string[] = [];
      $(el)
        .find('.tags li')
        .each((_, tag) => {
          skills.push($(tag).text().trim());
        });

      if (title && company) {
        jobs.push({ title, company, experience, salary, location, skills, postedAt, url, jobId });
      }
    } catch {
      // Skip malformed cards
    }
  });

  // Also try Naukri's new JSON-LD structured data if available
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() ?? '{}');
      if (data['@type'] === 'JobPosting') {
        jobs.push({
          title: data.title ?? '',
          company: data.hiringOrganization?.name ?? '',
          experience: '',
          salary: data.baseSalary?.value?.value ?? '',
          location: data.jobLocation?.address?.addressLocality ?? '',
          skills: [],
          postedAt: data.datePosted ?? '',
          url: data.url ?? '',
          jobId: '',
        });
      }
    } catch {
      // Not valid JSON-LD
    }
  });

  return jobs;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

crawlNaukri()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[Naukri] Fatal error:', err);
    process.exit(1);
  });
