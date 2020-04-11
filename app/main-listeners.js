const { ipcMain } = require('electron');
const codeforces = require('./services/CodeforcesService');

// ipcMain Listeners
ipcMain.on('sign-in', async (event, userData) => {
    const signInState = await codeforces.openSessionForUser(userData.handleOrEmail, userData.password);
    if (signInState === true)
        event.sender.send('sign-in-successful');
    else {
        const message = (signInState === false) ? 'Failed to sign in, try again in a moment.' : signInState;
        event.sender.send('sign-in-failed', message);
    }
});