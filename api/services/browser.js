const puppeteer = require('puppeteer');

async function startBrowser(){
	let browser;
	try {
	    console.log("Opening the browser......");
	    browser = await puppeteer.launch({
	        headless: true,
			executablePath: 'google-chrome-stable',	// Uncomment if using inside docker container
	        args: [
				"--disable-gpu",
				"--disable-dev-shm-usage",
				"--disable-setuid-sandbox",
				"--no-sandbox"
			],
	        'ignoreHTTPSErrors': true
	    });
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
		throw err;
	}
	return browser;
}

module.exports = () => startBrowser();