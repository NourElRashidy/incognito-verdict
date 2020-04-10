const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');

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

module.exports = {
    openSessionForUser
};
