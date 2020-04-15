const scraper = require('../engines/ScrapingEngine');


let username = null;
let cookies = null;

const CODEFORCES_LOGIN_PAGE_URL = 'https://codeforces.com/enter';
const USERNAME_SELECTOR = '#handleOrEmail';
const PASSWORD_SELECTOR = '#password';
const REMEMBER_SELECTOR = '#remember';
const LOGIN_BUTTON_SELECTOR = '#enterForm > table > tbody > tr:nth-child(4) > td > div:nth-child(1) > input';
const LOGIN_ERROR_SELECTOR = '#enterForm > table > tbody > tr.subscription-row > td:nth-child(2) > div > span';

const isLoggedIn = async () => {
    const page = await scraper.getNewPage(cookies);
    try {
        const element = await page.$(LOGIN_ERROR_SELECTOR);
        const err_text = await page.evaluate(element => element.textContent, element);
        scraper.closePage(page);
        return err_text;
    }
    catch (e) {
        await page.goto(CODEFORCES_LOGIN_PAGE_URL);
        let loggedIn = false;
        if (!page.url().includes(CODEFORCES_LOGIN_PAGE_URL))
            loggedIn = true;
        scraper.closePage(page);
        return loggedIn;
    }
}

const openSessionForUser = async (user, pass) => {
    username = user;
    const page = await scraper.getNewPage();
    await page.goto(CODEFORCES_LOGIN_PAGE_URL);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(user);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(pass);
    await page.click(REMEMBER_SELECTOR);
    await page.click(LOGIN_BUTTON_SELECTOR);
    await page.waitForNavigation();
    cookies = await page.cookies();
    return isLoggedIn();
}

const closeRunningSession = async () => {
    scraper.endInstance();
    username = null;
    cookies = null;
}

const parseUrl = async (url) => {
    let urlInfo = url.match('https://codeforces.com/problemset/problem/(.*)/(.*)');
    if (urlInfo)
        return {
            type: 'contest',
            id: urlInfo[1],
            letter: urlInfo[2]
        };

    urlInfo = url.match('https://codeforces.com/contest/(.*)/problem/(.*)');
    if (urlInfo)
        return {
            type: 'contest',
            id: urlInfo[1],
            letter: urlInfo[2]
        };

    urlInfo = url.match('https://codeforces.com/gym/(.*)/problem/(.*)');
    if (urlInfo)
        return {
            type: 'gym',
            id: urlInfo[1],
            letter: urlInfo[2]
        };

    throw ('invalid problem url!');
}

const getSubmitUrl = async (url) => {
    let urlInfo = await parseUrl(url);
    return `https://codeforces.com/${urlInfo.type}/${urlInfo.id}/submit/${urlInfo.letter}`;
}

const LANGUAGE_DROPDOWN_SELECTOR = '#pageContent > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > select';
const SOURCE_CODE_SELECTOR = '#sourceCodeTextarea';
const EDITOR_TOGGLE_SELECTOR = '#toggleEditorCheckbox';
const SUBMIT_BUTTON_SELECTOR = '#pageContent > form > table > tbody > tr:nth-child(6) > td > div > div > input';
const SUBMIT_ERROR_SELECTOR = '#pageContent > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > span';

const submitProblem = async (url, languageId, sourceCode) => {
    const page = await scraper.getNewPage(cookies);
    try {
        try {
            await page.goto(await getSubmitUrl(url));
        }
        catch (e) {
            scraper.closePage(page);
            return e;
        }
        await page.select(LANGUAGE_DROPDOWN_SELECTOR, languageId);
        await page.$eval(EDITOR_TOGGLE_SELECTOR, check => { check.click() });
        await page.click(SOURCE_CODE_SELECTOR);
        await page.keyboard.type(sourceCode);
        await page.click(SUBMIT_BUTTON_SELECTOR);
    }
    catch (e) {
        scraper.closePage(page);
        throw new Error('Failed to submit!\n' + e);
    }

    if (page.url().includes('/my')) {
        console.log('Submitted successfuly...');
        scraper.closePage(page);
        return true;
    }

    // Check if submission is rejected due to repeated submissions
    try {
        let element = await page.$(SUBMIT_ERROR_SELECTOR);
        const err_text = await page.evaluate(element => element.textContent, element);
        scraper.closePage(page);
        return err_text;
    }
    catch (e) {
        scraper.closePage(page);
        return false;
    }
}

const getAvailableLanguages = async (url) => {
    try {
        try {
            return await require('../engines/FilesEngine').loadLanguages();
        }
        catch (e) {
            if (!url)
                url = 'https://codeforces.com/contest/1332/problem/F'
            const page = await scraper.getNewPage(cookies);
            await page.goto(url);
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
            require('../engines/FilesEngine').saveLanguages(languages);
            scraper.closePage(page);
            return languages;
        }
    }
    catch (e) {
        scraper.closePage(page);
        throw new Error('Failed to retrieve languages!\n' + e);
    }
}

const getUserSubmissions = async () => {
    return new Promise(async (resolve, reject) => {
        const url = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=50`;
        const page = await scraper.getNewPage();
        page.on('response', async response => {
            if (response.url() === url) {
                try {
                    const submissions = (await response.json()).result;
                    scraper.closePage(page);
                    resolve(submissions);
                }
                catch (e) {
                    scraper.closePage(page);
                    reject(e);
                }
            }
        });
        try {
            await page.goto(url);
        }
        catch (e) {
            scraper.closePage(page);
            reject(e);
        }
    });
}

const getProblemName = async (url) => {
    return new Promise(async (resolve, reject) => {
        const urlInfo = await parseUrl(url);
        url = `https://codeforces.com/api/contest.standings?contestId=${urlInfo.id}&from=1&count=1`;
        const page = await scraper.getNewPage();
        page.on('response', async response => {
            if (response.url() === url) {
                try {
                    const problem = (await response.json()).result.problems.filter(p => p.index === urlInfo.letter);
                    scraper.closePage(page);
                    resolve(`${problem[0].contestId} | ${problem[0].index} - ${problem[0].name}`);
                }
                catch (e) {
                    scraper.closePage(page);
                    reject(e);
                }
            }
        });
        try {
            await page.goto(url);
        }
        catch (e) {
            scraper.closePage(page);
            reject(e);
        }
    });
}

module.exports = {
    openSessionForUser,
    closeRunningSession,
    submitProblem,
    getAvailableLanguages,
    getUserSubmissions,
    getProblemName
};
