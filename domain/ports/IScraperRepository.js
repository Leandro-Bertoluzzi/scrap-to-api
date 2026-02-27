'use strict';

/**
 * Port: Scraper Repository
 *
 * Defines the contract for fetching anime/manga data from an external source.
 * Infrastructure adapters must extend this class and implement all methods.
 */
class IScraperRepository {
    /**
     * Searches for entries of the given type.
     * @param {string} type - e.g. 'anime', 'manga', 'character', 'people'
     * @param {string} query - search text
     * @param {number} page - zero-based page index
     * @returns {Promise<import('../models/SearchResult').SearchResult[]>}
     */
    async search(type, query, page) {
        throw new Error('IScraperRepository.search() not implemented');
    }

    /**
     * Lists seasonal anime.
     * @param {string|null} year
     * @param {string|null} season - 'summer' | 'fall' | 'winter' | 'spring'
     * @param {string|null} category - 'tv' | 'ova' | 'movie' | 'special' | 'ona'
     * @returns {Promise<import('../models/SeasonalAnime').SeasonalAnime[]>}
     */
    async seasonalAnime(year, season, category) {
        throw new Error('IScraperRepository.seasonalAnime() not implemented');
    }
}

module.exports = IScraperRepository;
