const puppeteer = require('puppeteer');

let browser = null;

async function startBrowser() {
    browser = await puppeteer.launch();
}

module.exports = {
    getNewPage: async (cookies) => {
        if (!browser)
            await startBrowser();
        let page = await browser.newPage();
        if (cookies)
            await page.setCookie(...cookies);
        page.setViewport({ width: 1366, height: 768 });
        return page;
    },
    closePage: async (page) => {
        try {
            await page.close();
        }
        catch (e) {

        }
    },
    endInstance: async () => {
        if (!browser)
            return;
        await browser.close();
        browser = null;
    },
    isUp: async () => {
        return browser;
    }
};