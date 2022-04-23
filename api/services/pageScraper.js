const scraperObject = {
	url: 'http://books.toscrape.com',
	async scraper(browser, tag){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url);
		// Wait for the required DOM to be rendered
		await page.waitForSelector('.page_inner');
		// Get the link to all the required books
		let urls = await page.$$eval(tag, links => {
			// Extract the links from the data
			links = links.map(el => el.innerText)
			return links;
		});
		await page.close();
		return urls;
	}
}

module.exports = scraperObject;