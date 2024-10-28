import { USER_ID, USER_PASSWORD, WEB_SITES } from '@/app/constants';
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

      const content = await page.content();

      return { name, url, content };
    })
  );

  await browser.close();

  return NextResponse.json({ data: websiteContents });
}
