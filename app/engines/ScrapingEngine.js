const puppeteer = require('puppeteer');

let browser = null;

async function startBrowser() {
    browser = await puppeteer.launch();
}

module.exports = {
    getNewPage: async (cookies, fullLoad) => {
        if (!browser)
            await startBrowser();
        let page = await browser.newPage();
        if (cookies)
            await page.setCookie(...cookies);
        page.setViewport({ width: 1366, height: 4000 });
        if (!fullLoad) {
            await page.setRequestInterception(true);
            page.on('request', req => {
                if (req.resourceType() == 'image' || req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
                    req.abort();
                }
                else {
                    req.continue();
                }
            });
        }
        return page;
    },
    listenForStatus: async (page, url, statusList, callbackList) => {
        if (statusList.length != callbackList.length)
            throw new Error('Callbacks list doesn\'t match the length of status listeners.');
        page.on('response', async response => {
            if (!response.url().includes(url))
                return;
            for (let i = 0; i < statusList.length; i++) {
                if (response.status() === statusList[i])
                    callbackList[i](response);
            }
        });
    },
    closePage: async (page) => {
        try {
            page.close();
        }
        catch (e) { }
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
