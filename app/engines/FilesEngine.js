var fs = require('fs');

const DATA_DIRECTORY = './data';
const CACHED_LANGUAGES_PATH = '/meta/cached-langs.json';
const CACHED_IMAGES_WINDOW_PATH = '/meta/cached-imgs-window.json';

const writeToFile = (content, filePath) => {
    fs.writeFileSync(DATA_DIRECTORY + filePath, content, function (err) {
        if (err) {
            throw err;
        }
    });
};

const readfromFile = (filePath) => {
    try {
        return fs.readFileSync(DATA_DIRECTORY + filePath);
    }
    catch (e) {
        throw ('File doesn\'t exist');
    }
}

module.exports = {
    loadLanguages: async () => {
        return JSON.parse(readfromFile(CACHED_LANGUAGES_PATH));
    },
    saveLanguages: async (langs) => {
        writeToFile(JSON.stringify(langs), CACHED_LANGUAGES_PATH);
    },
    loadImagesWindow: async () => {
        return JSON.parse(readfromFile(CACHED_IMAGES_WINDOW_PATH));
    },
    saveImagesWindow: async (imagesWindow) => {
        writeToFile(JSON.stringify(imagesWindow), CACHED_IMAGES_WINDOW_PATH);
    },
};
