const puppeteer = require('puppeteer');

let browser = null;
let page = null;

async function startBrowser() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setViewport({ width: 1366, height: 768 });
}

module.exports = {
    getInstance: async () => {
        if (!page)
            await startBrowser();
        return page;
    },
    endInstance: async () => {
        await browser.close();
        browser = null;
        page = null;
    },
    isUp: async () => {
        return browser && page;
    }
};