import { WEB_SITES } from '@/app/constants';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  const browser = await puppeteer.launch();
  const websiteContents = await Promise.all(
    WEB_SITES.map(async ({ name, url }) => {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      const content = await page.content();

      return { name, url, content };
    })
  );

  await browser.close();

  return NextResponse.json({ data: websiteContents });
}
