const scraper = require('../engines/ScrapingEngine');
const CodeforcesError = require('../errors/CodeforcesError');

let username = null;
let cookies = null;

const CODEFORCES_LOGIN_PAGE_URL = 'https://codeforces.com/enter';
const USERNAME_SELECTOR = '#handleOrEmail';
const PASSWORD_SELECTOR = '#password';
const REMEMBER_SELECTOR = '#remember';
const LOGIN_FORM_SELECTOR = '#enterForm';
const LOGIN_ERROR_SELECTOR = '#enterForm > table > tbody > tr.subscription-row > td:nth-child(2) > div > span';

const isSignedIn = async () => {
    let signedIn = false;
    const page = await scraper.getNewPage(cookies);
    try {
        const response = await page.goto(CODEFORCES_LOGIN_PAGE_URL);
        if (!response.url().includes(CODEFORCES_LOGIN_PAGE_URL))
            signedIn = true;
        return signedIn;
    }
    finally {
        scraper.closePage(page);
    }
}

const openSessionForUser = async (user, pass) => {
    return new Promise(async (resolve, reject) => {
        const page = await scraper.getNewPage();
        await page.goto(CODEFORCES_LOGIN_PAGE_URL);

        page.on('requestfinished', async (request) => {
            if (page.url() === 'https://codeforces.com/') {
                username = user;
                cookies = await page.cookies();
                scraper.closePage(page);
                resolve();
            }
        });

        await page.$eval(USERNAME_SELECTOR, (el, user) => el.value = user, user);
        await page.$eval(PASSWORD_SELECTOR, (el, pass) => el.value = pass, pass);
        await page.$eval(REMEMBER_SELECTOR, check => check.click());
        await page.$eval(LOGIN_FORM_SELECTOR, form => form.submit());

        try {
            await page.waitForSelector(LOGIN_ERROR_SELECTOR);
            const err_text = await page.$eval(LOGIN_ERROR_SELECTOR, el => el.textContent);
            scraper.closePage(page);
            reject(new CodeforcesError(err_text));
        }
        catch (e) {
            reject(e);
        }
    });
}

const closeRunningSession = async () => {
    scraper.endInstance();
    username = null;
    cookies = null;
}

const parseUrl = (url) => {
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

    throw new Error('invalid problem url!');
}

const isValidProblemUrl = (url) => {
    try {
        parseUrl(url)
        return true;
    }
    catch (e) {
        return false;
    }
}

const getSubmitUrl = async (url) => {
    let urlInfo = parseUrl(url);
    return `https://codeforces.com/${urlInfo.type}/${urlInfo.id}/submit/${urlInfo.letter}`;
}

const LANGUAGE_DROPDOWN_SELECTOR = '#pageContent > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > select';
const SOURCE_CODE_SELECTOR = '#sourceCodeTextarea';
const EDITOR_TOGGLE_SELECTOR = '#toggleEditorCheckbox';
const SUBMIT_FORM_SELECTOR = '#pageContent > form';
const SUBMIT_ERROR_SELECTOR = '#pageContent > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > span';

const submitProblem = async (url, languageId, sourceCode) => {
    return new Promise(async (resolve, reject) => {
        const page = await scraper.getNewPage(cookies, true);
        url = await getSubmitUrl(url);
        try {
            try {
                await page.goto(url);
            }
            catch (e) {
                scraper.closePage(page);
                reject(e);
                return;
            }

            await scraper.listenForStatus(
                page,
                url,
                [302, 200],
                [() => {
                    scraper.closePage(page);
                    resolve();
                }, async (response) => {
                    // Check if submission is rejected due to repeated source code
                    try {
                        await page.setContent(await response.text());
                        const err_text = await page.$eval(SUBMIT_ERROR_SELECTOR, el => el.textContent);
                        scraper.closePage(page);
                        reject(new CodeforcesError(err_text));
                    }
                    catch (e) {
                        scraper.closePage(page);
                        reject(e);
                    }
                }]
            );

            await page.waitForSelector(SUBMIT_FORM_SELECTOR);
            await page.$eval(EDITOR_TOGGLE_SELECTOR, check => check.click());
            await page.select(LANGUAGE_DROPDOWN_SELECTOR, languageId);
            await page.$eval(SOURCE_CODE_SELECTOR, (el, sourceCode) => el.value = sourceCode, sourceCode);
            await page.$eval(SUBMIT_FORM_SELECTOR, form => form.submit());
        }
        catch (e) {
            scraper.closePage(page);
            reject(e);
        }
    });
}

const PROBLEM_IO_SELECTOR = '#submittedProblemFiles';
const PROBLEM_LIMITS_SELECTOR = '#submittedProblemLimits';
const getProblemLimitsAndIO = async (url) => {
    const page = await scraper.getNewPage(cookies);
    url = await getSubmitUrl(url);
    try {
        await page.goto(url);
        const io = await page.$eval(PROBLEM_IO_SELECTOR, el => el.innerText);
        const limits = await page.$eval(PROBLEM_LIMITS_SELECTOR, el => el.innerText);
        return { io, limits };
    }
    catch (e) {
        scraper.closePage(page);
        throw e;
    }
}

const getAvailableLanguages = async (url) => {
    try {
        return await require('../engines/FilesEngine').loadLanguages();
    }
    catch (e) {
        if (!url)
            url = 'https://codeforces.com/contest/1332/problem/F'
        const page = await scraper.getNewPage(cookies);
        try {
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
        catch (e) {
            scraper.closePage(page);
            throw e;
        }
    }
}

const getUserSubmissions = async () => {
    return new Promise(async (resolve, reject) => {
        const url = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=30`;
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
                    resolve(`[${problem[0].contestId}] ${problem[0].index} - ${problem[0].name}`);
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

const PROBLEM_STATEMENT_SELECTOR = '#pageContent > div.problemindexholder';
const COPY_BUTTONS_SELECTOR = '.input-output-copier';
const ATTACHMENTS_TABLE_SELECTOR = '#pageContent > div.datatable > div:nth-child(6) > table';
const getProblemStatement = async (url) => {
    const page = await scraper.getNewPage();
    const response = await page.goto(url);
    await page.setContent(await response.text());
    try {
        if (response.url().includes('attachments')) {
            const englishPdfLink = await page.$eval(ATTACHMENTS_TABLE_SELECTOR, (table) => {
                for (var i = 0, row; row = table.rows[i]; i++)
                    if (row.cells[1].innerText.includes('English'))
                        return row.cells[2].querySelector('a').href;
            });
            return { type: 'PDF', englishPdfLink };
        }
        else {
            const statement = await page.$eval(PROBLEM_STATEMENT_SELECTOR, (el, sel) => {
                var copyButtons = el.querySelectorAll(sel);
                for (var i = 0; i < copyButtons.length; i++) {
                    copyButtons[i].parentNode.removeChild(copyButtons[i]);
                }
                return el.innerHTML;
            }, COPY_BUTTONS_SELECTOR);

            scraper.closePage(page);
            return { type: 'HTML', statement };
        }
    }
    catch (e) {
        scraper.closePage(page);
        throw e;
    }
}

module.exports = {
    isSignedIn,
    openSessionForUser,
    closeRunningSession,
    submitProblem,
    getAvailableLanguages,
    getProblemLimitsAndIO,
    getUserSubmissions,
    getProblemName,
    getProblemStatement,
    isValidProblemUrl
};
