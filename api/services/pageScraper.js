const BASE_URL = 'https://myanimelist.net';
const PAGE_SIZE_SEARCH = 50;

const scraperObject = {
    async search(browser, type, searchQuery, currentPage) {
        const page = await browser.newPage();
        const offset = currentPage * PAGE_SIZE_SEARCH;
        const url = `${BASE_URL}/${type}.php?q=${searchQuery}&show=${offset}`;
        console.log(`Navigating to ${url}"...`);
        const gotoResult = await page.goto(url);
        if (gotoResult.status() === 404) {
            console.error('404 status code found in result');
            throw new Error('404: Page not found');
        }

        // Wait for the required DOM to be rendered
        const parent =
            type === 'anime' || type === 'manga'
                ? 'div#content > div > table'
                : 'div#content > table';
        await page.waitForSelector(parent);
        // Get the details of each entry
        const selector = `${parent} tr`;
        const result = await page.$$eval(selector, (text) => {
            // Extract the text from each element
            text = text.map((el) => el.innerText.trim());
            return text;
        });

        await page.close();

        // We remove the table headers (first element in array)
        if (type === 'anime' || type === 'manga') {
            result.shift();
        }
        return result;
    },

    async seasonalAnime(browser, year = null, season = null, category = null) {
        const page = await browser.newPage();
        const url =
            year && season
                ? `${BASE_URL}/anime/season/${year}/${season}`
                : `${BASE_URL}/anime/season`;
        console.log(`Navigating to ${url}"...`);
        const gotoResult = await page.goto(url);
        if (gotoResult.status() === 404) {
            console.error('404 status code found in result');
            throw new Error('404: Page not found');
        }

        let categoryFilter = '';
        const categoryToClassMapping = {
            tv: '.js-seasonal-anime-list-key-1',
            ova: '.js-seasonal-anime-list-key-2',
            movie: '.js-seasonal-anime-list-key-3',
            special: '.js-seasonal-anime-list-key-4',
            ona: '.js-seasonal-anime-list-key-5',
        };
        if (category) {
            categoryFilter = categoryToClassMapping[category];
        }

        // Search for elements, filtering by category
        const parent = `div#content > div > div.seasonal-anime-list${categoryFilter}`;
        await page.waitForSelector(parent);
        const selector = `${parent} div.seasonal-anime`;
        const result = await page.$$eval(selector, (text) => {
            // Extract the text from each element
            text = text.map((el) => el.innerText.trim());
            return text;
        });

        await page.close();

        return result;
    },
};

module.exports = scraperObject;
