'use strict';

/**
 * Application use case: Search
 *
 * Orchestrates a search query against the scraper repository.
 */
class SearchUseCase {
    /** @param {import('../../domain/ports/ISearchRepository')} searchRepository */
    constructor(searchRepository) {
        this.scraperRepository = searchRepository;
    }

    /**
     * @param {string} type - 'anime' | 'manga' | 'character' | 'people'
     * @param {string} query - search text
     * @param {number} page - zero-based page index
     * @returns {Promise<(import('../../domain/models/SearchAnimeResult').SearchAnimeResult | import('../../domain/models/SearchMangaResult').SearchMangaResult | import('../../domain/models/SearchCharacterResult').SearchCharacterResult | import('../../domain/models/SearchPeopleResult').SearchPeopleResult)[]>}
     */
    async execute(type, query, page) {
        return this.scraperRepository.search(type, query, page);
    }
}

module.exports = SearchUseCase;
