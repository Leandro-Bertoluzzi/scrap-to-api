const scraperObject = {
	url: 'https://myanimelist.net',
	PAGE_SIZE_SEARCH: 50,
	async search(browser, type, searchQuery, currentPage){
		let page = await browser.newPage();
		let url = `${this.url}/${type}.php?q=${searchQuery}&show=${currentPage * this.PAGE_SIZE_SEARCH}`;
		console.log(`Navigating to ${url}"...`);
		let gotoResult = await page.goto(url);
		if (gotoResult.status() === 404) {
			console.error('404 status code found in result');
			throw new Error('404: Page not found');
		}
		// Wait for the required DOM to be rendered
		let parent = (type === 'anime' || type === 'manga') ? 'div#content > div > table' : 'div#content > table';
		await page.waitForSelector(parent);
		// Get the details of each entry
		let selector = parent + ' tr';
		let result = await page.$$eval(selector, text => {
			// Extract the text from each element
			text = text.map(el => el.innerText.trim());
			return text;
		});
		await page.close();

		// We remove the table headers (first element in array)
		if(type === 'anime' || type === 'manga')
			result.shift();
		return result;
	}
}

module.exports = scraperObject;