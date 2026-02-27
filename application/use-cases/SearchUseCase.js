'use strict';

/**
 * Application use case: Search
 *
 * Orchestrates a search query against the scraper repository.
 */
class SearchUseCase {
    /** @param {import('../../domain/ports/IScraperRepository')} scraperRepository */
    constructor(scraperRepository) {
        this.scraperRepository = scraperRepository;
    }

    /**
     * @param {string} type - 'anime' | 'manga' | 'character' | 'people'
     * @param {string} query - search text
     * @param {number} page - zero-based page index
     * @returns {Promise<string[]>}
     */
    async execute(type, query, page) {
        return this.scraperRepository.search(type, query, page);
    }
}

module.exports = SearchUseCase;
