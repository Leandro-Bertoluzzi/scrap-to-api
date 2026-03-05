'use strict';

/**
 * Port: Seasonal Anime Repository
 *
 * Defines the contract for listing seasonal anime.
 * Infrastructure adapters must extend this class and implement all methods.
 */
class ISeasonalAnimeRepository {
    /**
     * Lists seasonal anime.
     * @param {string|null} year
     * @param {string|null} season - 'summer' | 'fall' | 'winter' | 'spring'
     * @param {string|null} category - 'tv' | 'tv_new' | 'tv_continuing' | 'ova' | 'movie' | 'special' | 'ona'
     * @returns {Promise<import('../models/SeasonalAnime').SeasonalAnime[]>}
     * @throws {import('../errors/NotFoundError')} When the seasonal page is not found or out of range.
     */
    async seasonalAnime(year, season, category) {
        throw new Error('ISeasonalAnimeRepository.seasonalAnime() not implemented');
    }
}

module.exports = ISeasonalAnimeRepository;
