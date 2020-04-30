const { ipcMain } = require('electron');
const codeforces = require('../services/CodeforcesService');
const CodeforcesError = require('../errors/CodeforcesError')

ipcMain.on('sign-in', async (event, userData) => {
    try {
        await codeforces.openSessionForUser(userData.handleOrEmail, userData.password);
        event.sender.send('sign-in-successful');
    }
    catch (e) {
        let message = e.message;
        if (!(e instanceof CodeforcesError))
            message = 'Failed to sign in, try again in a moment.'
        event.sender.send('sign-in-failed', message);
    }
});

ipcMain.on('session-health-check', async (event) => {
    try {
        if ((await codeforces.isSignedIn()) !== true)
            event.sender.send('session-expired');
    }
    catch (e) {
        event.sender.send('session-expired');
    }
});

ipcMain.on('validate-problem-url', async (event, url) => {
    event.sender.send('validate-problem-url-feedback', codeforces.isValidProblemUrl(url));
});

ipcMain.on('get-problem-name', async (event, url) => {
    try {
        event.sender.send('problem-name', await codeforces.getProblemName(url));
    }
    catch (e) {
        event.sender.send('problem-name');
    }
});

ipcMain.on('get-available-languages', async (event, problemURL) => {
    try {
        event.sender.send('available-languages', await codeforces.getAvailableLanguages(problemURL));
    }
    catch (e) {
        event.sender.send('available-languages', e.message);
    }
});

ipcMain.on('submit-problem', async (event, { currentProblemURL, selectedSubmitLanguage, userSourceCode }) => {
    try {
        await codeforces.submitProblem(currentProblemURL, selectedSubmitLanguage, userSourceCode);
        event.sender.send('submit-response', { success: true });
    }
    catch (e) {
        let message = e.message;
        if (!(e instanceof CodeforcesError))
            message = 'Failed to submit! Make sure that Codeforces is up and try again.'
        event.sender.send('submit-response', { success: false, message });
    }
});

ipcMain.on('get-user-submissions', async (event) => {
    try {
        event.sender.send('user-submissions', await codeforces.getUserSubmissions());
    }
    catch (e) {
        event.sender.send('user-submissions');
    }
});

ipcMain.on('get-problem-statement', async (event, problemURL) => {
    try {
        event.sender.send('problem-statement', await codeforces.getProblemStatement(problemURL));
    }
    catch (e) {
        event.sender.send('problem-statement');
    }
});
