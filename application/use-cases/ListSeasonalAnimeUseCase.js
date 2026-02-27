'use strict';

/**
 * Application use case: List Seasonal Anime
 *
 * Orchestrates a seasonal anime listing against the scraper repository.
 */
class ListSeasonalAnimeUseCase {
    /** @param {import('../../domain/ports/IScraperRepository')} scraperRepository */
    constructor(scraperRepository) {
        this.scraperRepository = scraperRepository;
    }

    /**
     * @param {string|null} year
     * @param {string|null} season - 'summer' | 'fall' | 'winter' | 'spring'
     * @param {string|null} category - 'tv' | 'ova' | 'movie' | 'special' | 'ona'
     * @returns {Promise<string[]>}
     */
    async execute(year, season, category) {
        return this.scraperRepository.seasonalAnime(year, season, category);
    }
}

module.exports = ListSeasonalAnimeUseCase;
