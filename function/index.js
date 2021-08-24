const { webkit, chromium, firefox } = require('playwright');

const { writeFile, fstat, symlinkSync, mkdirSync, unlinkSync, rmdirSync } = require('fs');
const { promisify } = require('util');
//const { Builder, By, Key, promise, until } = require('selenium-webdriver');
//const firefox = require('selenium-webdriver/firefox');
const { v4: uuidv4 } = require('uuid');

getCustomExecutablePath = (expectedPath) => {
    const suffix = expectedPath.split('/.cache/ms-playwright/')[1];
    return  `/home/pwuser/.cache/ms-playwright/${suffix}`;
}

exports.handler = async (event, context) => {

/*
    const tempdirname = "/tmp/"+uuidv4();
//mkdirSync(tempdirname)
    //symlinkSync(tempdirname, "/dev/shm")

//ln -s /tmp /dev/shm
    promise.USE_PROMISE_MANAGER = false;
    
    var firefoxOptions = new firefox.Options();
firefoxOptions.setBinary('/function/firefox/firefox');
firefoxOptions.headless();
    
    const driver = new Builder()
.forBrowser('firefox')
.setFirefoxOptions(firefoxOptions)
.build();



    await driver.get('https://developer.mozilla.org/');
    const ps = await driver.getPageSource()
    console.log(ps);
    
    await driver.quit();

//unlinkSync("/dev/shm")
//rmdirSync(tempdirname, {recursive:true})
*/
    
    let browserName = event.browser || 'firefox';
    const extraLaunchArgs = event.browserArgs || [];
    const browserTypes = {
        'webkit': webkit,
        'chromium': chromium,
        'firefox': firefox,
    };
    const browserLaunchArgs = {
        'webkit': [],
        'chromium': [
            '--single-process',
        ],
        'firefox': ['-console'],
    }
    let browser = null;
    if (Object.keys(browserTypes).indexOf(browserName) < 0) {
        console.log(`Browser '${browserName}' not supported, using chromium`);
        browserName = 'chromium';
    }
    try {
        process.env.MOZ_LOG="all:5"
        process.env.NSPR_LOG_MODULES="all:5"
        process.env.RUST_LOG="debug"
        process.env.DEBUG="pw:api"
        console.log(`Starting browser: ${browserName}`);
        browser = await browserTypes[browserName].launch({
            executablePath: "/ms-playwright/firefox-1271/firefox/firefox",
            
            args: browserLaunchArgs[browserName].concat(extraLaunchArgs),
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('http://google.com/');
        console.log(`Page title: ${await page.title()}`);
        console.log(await page.content())
    } catch (error) {
        console.log(`error${error}`);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
}