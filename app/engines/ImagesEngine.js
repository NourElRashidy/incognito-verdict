const { fetchAllImages } = require('../services/ImgurService');
const { randomIntInRange } = require('../services/Utils');

let allImages = null;
let imagesWindow = [];

module.exports = {
    loadAllImages: async () => {
        try {
            allImages = await fetchAllImages();
        }
        catch (e) {
            throw e;
        }
    },
    shiftImagesWindow: async () => {
        if (!allImages) {
            try {
                await module.exports.loadAllImages();
            }
            catch (e) {
                throw e;
            }
        }

        imagesWindow.unshift(allImages[randomIntInRange(0, allImages.length - 1)]);
        imagesWindow.length = Math.min(imagesWindow.length, 100);
    },
    getImagesWindow: async (size) => {
        while (size > imagesWindow.length) {
            await module.exports.shiftImagesWindow();
        }
        return imagesWindow.slice(0, size);
    }
};