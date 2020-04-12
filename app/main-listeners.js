const { ipcMain } = require('electron');
const codeforces = require('./services/CodeforcesService');

// ipcMain Listeners
ipcMain.on('sign-in', async (event, userData) => {
    try {
        const signInState = await codeforces.openSessionForUser(userData.handleOrEmail, userData.password);
        if (signInState === true)
            event.sender.send('sign-in-successful');
        else {
            const message = (signInState === false) ? 'Failed to sign in, try again in a moment.' : signInState;
            event.sender.send('sign-in-failed', message);
        }
    }
    catch (e) {
        event.sender.send('sign-in-failed', 'Failed to sign in, try again in a moment.');
    }
});

ipcMain.on('get-problem-name', async (event, url) => {
    try {
        event.sender.send('problem-name', await codeforces.getProblemName(url));
    }
    catch (e) {
        event.sender.send('problem-name');
    }
});

ipcMain.on('get-available-languages', async (event) => {
    try {
        event.sender.send('available-languages', await codeforces.getAvailableLanguages());
    }
    catch (e) {
        event.sender.send('available-languages');
    }
});

ipcMain.on('submit-problem', async (event, { problemURL, selectedLanguage, sourceCode }) => {
    try {
        let submitStatus = await codeforces.submitProblem(problemURL, selectedLanguage, sourceCode);
        if (submitStatus === true) {
            event.sender.send('submit-feedback');
        }
        else if (submitStatus === false)
            event.sender.send('submit-feedback', 'Failed to submit, try again in a moment!');
        else
            event.sender.send('submit-feedback', submitStatus);
    }
    catch (e) {
        console.log(e);
        event.sender.send('submit-feedback', JSON.stringify(e, null, 4));
    }
});