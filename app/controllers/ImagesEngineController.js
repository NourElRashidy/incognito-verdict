const { ipcMain } = require('electron');
const { getImagesWindow, shiftImagesWindow } = require('../engines/ImagesEngine');

ipcMain.on('get-images-window', async (event, size) => {
    try {
        event.sender.send('images-window', await getImagesWindow(size));
    }
    catch (e) {
        event.sender.send('images-window');
    }
});

ipcMain.on('shift-images-window', _ => {
    shiftImagesWindow();
});
