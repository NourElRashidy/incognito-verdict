const { ipcMain } = require('electron');
const { getImagesWindow } = require('../engines/ImagesEngine');

ipcMain.on('get-images-window', async (event, submissionIds) => {
    try {
        event.sender.send('images-window', await getImagesWindow(submissionIds));
    }
    catch (e) {
        event.sender.send('images-window');
    }
});
