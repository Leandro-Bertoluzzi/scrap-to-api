require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_HOST: process.env.HOST || '0.0.0.0',
    API_PORT: process.env.PORT || 8000,
    MAL_BASE_URL: process.env.MAL_BASE_URL || 'https://myanimelist.net',
};
