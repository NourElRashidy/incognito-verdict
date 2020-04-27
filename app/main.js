const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1040,
    height: 830,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    },
    resizable: true,
    minWidth: 600,
    minHeight: 685
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    require('./services/CodeforcesService').closeRunningSession();
    mainWindow = null;
  });
}

app.on('ready', function () {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    require('./services/CodeforcesService').closeRunningSession();
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

require('./controllers/CodeforcesController');
require('./controllers/ImagesEngineController');

require('./engines/ImagesEngine').loadAllImages();
