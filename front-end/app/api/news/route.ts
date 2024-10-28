import {
  USER_ID,
  USER_PASSWORD,
  VACANCY_EXCLUDE_KEYWORDS,
  VACANCY_KEYWORDS,
  WEB_SITES,
} from '@/app/constants';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const websiteContents = await Promise.all(
    WEB_SITES.map(async ({ name, url }) => {
      const page = await browser.newPage();

      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      await page.goto(url, { waitUntil: 'networkidle0' });

      if (name.includes('삼각지역')) {
        await Promise.all([
          page.waitForSelector("input[name='member_id']"),
          page.waitForSelector("input[name='member_password']"),
        ]);

        await page.type('input[name="member_id"]', USER_ID);
        await page.type('input[name="member_password"]', USER_PASSWORD);

        await page.keyboard.press('Enter');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.goto(url, { waitUntil: 'networkidle0' });
      }

      // 페이지에서 anchor 요소 추출
      const anchorElements = await page.evaluate(() =>
        Array.from(document.querySelectorAll('td a, li a'))
          .filter(
            (anchor) => !anchor.closest('header') && !anchor.closest('nav')
          )
          .map((anchor) => anchor.textContent?.trim())
      );

      // 페이지에서 원하는 키워드 포함한 텍스트 추출
      const newsItems = anchorElements.filter(
        (text) =>
          text &&
          VACANCY_KEYWORDS.some((keyword) => text.includes(keyword)) &&
          !VACANCY_EXCLUDE_KEYWORDS.some((keyword) => text.includes(keyword))
      );

      return { name, url, news: newsItems };
    })
  );

  await browser.close();

  return NextResponse.json({ data: websiteContents });
}
