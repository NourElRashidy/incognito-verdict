const puppeteer = require('puppeteer');

let browser = null;
let page = null;

async function startBrowser() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setViewport({ width: 1366, height: 768 });
}

async function closeBrowser() {
    await browser.close();
    browser = null;
    page = null;
}

const CODEFORCES_LOGIN_PAGE_URL = 'https://codeforces.com/enter';
const USERNAME_SELECTOR = '#handleOrEmail';
const PASSWORD_SELECTOR = '#password';
const REMEMBER_SELECTOR = '#remember';
const LOGIN_BUTTON_SELECTOR = '#enterForm > table > tbody > tr:nth-child(4) > td > div:nth-child(1) > input';

const isLoggedIn = async () => {
    if (browser === null || page === null)
        return false;

    await page.goto(CODEFORCES_LOGIN_PAGE_URL);
    return !page.url().includes(CODEFORCES_LOGIN_PAGE_URL);
}

const openSessionForUser = async (user, pass) => {
    await startBrowser();
    await page.goto(CODEFORCES_LOGIN_PAGE_URL);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(user);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(pass);
    await page.click(REMEMBER_SELECTOR);
    await page.click(LOGIN_BUTTON_SELECTOR);
    await page.waitForNavigation();
    return isLoggedIn();
}

const closeRunningSession = async () => {
    if (browser === null)
        return;
    await closeBrowser();
}

const LANGUAGE_DROPDOWN_SELECTOR = '#pageContent > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > select';
const SOURCE_CODE_SELECTOR = '#editor > div.ace_scroller > div > div.ace_layer.ace_text-layer > div';
const SUBMIT_BUTTON = '#pageContent > form > table > tbody > tr:nth-child(6) > td > div > div > input';

const submitProblem = async (contestId, problemId, languageId, sourceCode) => {
    console.log('Submitting...');
    try {
        await page.goto(`https://codeforces.com/gym/${contestId}/submit/${problemId}`);
        await page.select(LANGUAGE_DROPDOWN_SELECTOR, languageId);
        await page.click(SOURCE_CODE_SELECTOR);
        await page.keyboard.type(sourceCode);
        await page.click(SUBMIT_BUTTON);
    }
    catch (e) {
        throw new Error('Failed to submit!\n' + e);
    }

    if (page.url().includes('/my')) {
        console.log('submitted successfully!');
        return;
    }

    // Check if submission is rejected due to repeated submissions
    try {
        let element = await page.$('#pageContent > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > span');
        const err_text = await page.evaluate(element => element.textContent, element);
        throw new Error(err_text);
    }
    catch (e) {
        throw new Error('Failed to submit!\n' + e);
    }
}

const getAvailableLanguages = async (contestId) => {
    try {
        await page.goto(`https://codeforces.com/gym/${contestId}/submit`);
        const languages = await page.evaluate(optionSelector => {
            return Array.from(document.querySelectorAll(optionSelector))
                .filter(o => o.value)
                .map(o => {
                    return {
                        name: o.text,
                        value: o.value
                    };
                });
        }, `${LANGUAGE_DROPDOWN_SELECTOR} > option`);
        return languages;
    }
    catch (e) {
        throw new Error('Failed to retrieve languages!\n' + e);
    }
}

module.exports = {
    openSessionForUser,
    closeRunningSession,
    submitProblem,
    getAvailableLanguages
};
