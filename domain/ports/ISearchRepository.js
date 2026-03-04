'use strict';

/**
 * Port: Search Repository
 *
 * Defines the contract for searching anime/manga/characters/people.
 * Infrastructure adapters must extend this class and implement all methods.
 */
class ISearchRepository {
    /**
     * Searches for entries of the given type.
     * @param {string} type - e.g. 'anime', 'manga', 'character', 'people'
     * @param {string} query - search text
     * @param {number} page - zero-based page index
     * @returns {Promise<(import('../models/SearchAnimeResult').SearchAnimeResult | import('../models/SearchMangaResult').SearchMangaResult)[]>}
     */
    async search(type, query, page) {
        throw new Error('ISearchRepository.search() not implemented');
    }
}

module.exports = ISearchRepository;
