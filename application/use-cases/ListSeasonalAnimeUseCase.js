'use strict';

/**
 * Application use case: List Seasonal Anime
 *
 * Orchestrates a seasonal anime listing against the scraper repository.
 */
class ListSeasonalAnimeUseCase {
    /** @param {import('../../domain/ports/ISeasonalAnimeRepository')} seasonalAnimeRepository */
    constructor(seasonalAnimeRepository) {
        this.scraperRepository = seasonalAnimeRepository;
    }

    /**
     * @param {string|null} year
     * @param {string|null} season - 'summer' | 'fall' | 'winter' | 'spring'
     * @param {string|null} category - 'tv' | 'ova' | 'movie' | 'special' | 'ona'
     * @returns {Promise<import('../../domain/models/SeasonalAnime').SeasonalAnime[]>}
     */
    async execute(year, season, category) {
        return this.scraperRepository.seasonalAnime(year, season, category);
    }
}

module.exports = ListSeasonalAnimeUseCase;
