var fs = require('fs');

const DATA_DIRECTORY = './data';
const CACHED_LANGUAGES_PATH = '/meta/cached-langs.json';

const writeToFile = (content, filePath) => {
    fs.writeFileSync(DATA_DIRECTORY + filePath, content, function (err) {
        if (err) {
            throw err;
        }
        console.log('The file was saved!');
    });
};

const createFile = (filePath) => {
    fs.open(DATA_DIRECTORY + filePath, 'w', function (err, file) {
        if (err) throw err;
    });
}

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
        return JSON.parse(await readfromFile(CACHED_LANGUAGES_PATH));
    },
    saveLanguages: async (langs) => {
        writeToFile(JSON.stringify(langs), CACHED_LANGUAGES_PATH);
    }
};