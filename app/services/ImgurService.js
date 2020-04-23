const scraper = require('../engines/ScrapingEngine');
const { clientId, albumHash } = require('../configs/imgurConfigs');

module.exports = {
    fetchAllImages: async () => {
        const url = `https://api.imgur.com/3/album/${albumHash}/images`;
        const page = await scraper.getNewPage();

        try {
            await page.setExtraHTTPHeaders({ Authorization: `Client-ID ${clientId}` });
            let response = await page.goto(url);
            const allImages = (await response.json()).data.map(i => i.link);
            scraper.closePage(page);
            return allImages;
        }
        catch (e) {
            scraper.closePage(page);
            throw e;
        }
    }
};