const FilesEngine = require('../engines/FilesEngine');
const { fetchimagesGallery } = require('../services/ImgurService');
const { randomIntInRange } = require('../services/Utils');

let imagesGallery = null;
let imagesWindow = new Map();

const loadImagesGallery = async () => {
    imagesGallery = await fetchimagesGallery();
};

const assignImage = async (submissionId) => {
    if (!imagesGallery)
        await module.exports.initialize();

    let newImageIndex = randomIntInRange(0, imagesGallery.length - 1);
    while ([...imagesWindow.values()].includes(imagesGallery[newImageIndex]))
        newImageIndex = randomIntInRange(0, imagesGallery.length - 1);

    imagesWindow.set(submissionId, imagesGallery[newImageIndex]);
};

const cacheImagesWindow = () => {
    FilesEngine.saveImagesWindow([...imagesWindow]);
};

const loadCachedImagesWindow = async () => {
    try {
        imagesWindow = new Map(await FilesEngine.loadImagesWindow());
    }
    catch (e) { }
};

const rollImagesWindow = async (submissionId) => {
    await assignImage(submissionId);
    if (imagesWindow.size > 90)
        imagesWindow.delete(Math.min(...imagesWindow.keys()));
    cacheImagesWindow();
}

module.exports = {
    initialize: async () => {
        await loadCachedImagesWindow();
        await loadImagesGallery();
    },
    getImagesWindow: async (submissionIds) => {
        let window = {};
        for (let submissionId of submissionIds) {
            if (!imagesWindow.has(submissionId))
                await rollImagesWindow(submissionId);
            window[submissionId] = imagesWindow.get(submissionId);
        }
        return window;
    },
};
