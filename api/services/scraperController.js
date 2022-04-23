const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, tag){
	let browser;
	let data = [];
	try{
		browser = await browserInstance;
		data = await pageScraper.scraper(browser, tag);
		console.log(data);
		await browser.close();
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
		throw err;
	}
	return data;
}

module.exports = (browserInstance, tag) => scrapeAll(browserInstance, tag)