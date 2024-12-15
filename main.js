import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

async function testing(){
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://discord.com/channels/@me');

    // Take a screenshot and save it as 'screenshot.png'
    await page.screenshot({ path: 'screenshot.png' });
    
    console.log('Screenshot saved as screenshot.png');

    await browser.close();
}