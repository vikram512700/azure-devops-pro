/**
 * LinkedIn JD Crawler
 * Crawls Hyderabad Azure DevOps / Cloud Engineer jobs
 * Rate-limited: 50 jobs/day max, 3-5 sec delay between requests
 * Run via: npx ts-node crawlers/linkedin/crawler.ts
 */

import { chromium, Browser, Page } from 'playwright';
import { normalizeJob, extractSkills } from '../shared/job-normalizer';
import { saveJobToDb } from '../shared/db-writer';
import { RateLimiter } from '../shared/rate-limiter';

const SEARCH_QUERIES = [
  'Azure DevOps Engineer Hyderabad',
  'Cloud Engineer Azure AKS Hyderabad',
  'Platform Engineer Azure Kubernetes Hyderabad',
  'SRE Azure Hyderabad',
  'DevOps Terraform AKS Hyderabad',
];

const MAX_JOBS_PER_RUN = 50;
const DELAY_MS = { min: 3000, max: 6000 };

interface RawLinkedInJob {
  title: string;
  company: string;
  location: string;
  postedAt: string;
  url: string;
  description: string;
}

async function crawlLinkedIn(): Promise<void> {
  const limiter = new RateLimiter(MAX_JOBS_PER_RUN);
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });

    for (const query of SEARCH_QUERIES) {
      if (limiter.isExhausted()) {
        console.log(`[LinkedIn] Daily limit reached (${MAX_JOBS_PER_RUN}). Stopping.`);
        break;
      }

      const page = await context.newPage();
      const jobs = await scrapeSearchPage(page, query, limiter);

      for (const job of jobs) {
        const normalized = await normalizeJob(job, 'linkedin');
        const withSkills = await extractSkills(normalized);
        await saveJobToDb(withSkills);
        limiter.increment();

        await randomDelay(DELAY_MS.min, DELAY_MS.max);
      }

      await page.close();
      console.log(`[LinkedIn] Query "${query}" → ${jobs.length} jobs scraped`);
    }
  } catch (err) {
    console.error('[LinkedIn] Crawler error:', err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

async function scrapeSearchPage(
  page: Page,
  query: string,
  limiter: RateLimiter,
): Promise<RawLinkedInJob[]> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=Hyderabad%2C+Telangana%2C+India&f_TPR=r86400&sortBy=DD`;

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.jobs-search__results-list', { timeout: 10000 }).catch(() => null);

  const jobs: RawLinkedInJob[] = [];
  const jobCards = await page.$$('.base-card');

  for (const card of jobCards) {
    if (limiter.isExhausted()) break;

    try {
      const title = await card.$eval('.base-search-card__title', (el) => el.textContent?.trim() ?? '');
      const company = await card.$eval('.base-search-card__subtitle', (el) => el.textContent?.trim() ?? '');
      const location = await card.$eval('.job-search-card__location', (el) => el.textContent?.trim() ?? '');
      const postedAt = await card.$eval('time', (el) => el.getAttribute('datetime') ?? '');
      const jobUrl = await card.$eval('a.base-card__full-link', (el) => (el as HTMLAnchorElement).href);

      // Click to load description
      await card.click();
      await page.waitForSelector('.show-more-less-html__markup', { timeout: 5000 }).catch(() => null);
      const description = await page
        .$eval('.show-more-less-html__markup', (el) => el.textContent?.trim() ?? '')
        .catch(() => '');

      jobs.push({ title, company, location, postedAt, url: jobUrl, description });
      await randomDelay(1500, 3000);
    } catch {
      // Skip malformed cards
    }
  }

  return jobs;
}

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run
crawlLinkedIn()
  .then(() => {
    console.log('[LinkedIn] Crawler completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[LinkedIn] Crawler failed:', err);
    process.exit(1);
  });
