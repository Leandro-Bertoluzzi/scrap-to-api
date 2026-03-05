const NotFoundError = require('../../../domain/errors/NotFoundError');
const UpstreamError = require('../../../domain/errors/UpstreamError');

/**
 * Express middleware to handle errors thrown by route handlers.
 * Translates domain errors into appropriate HTTP responses.
 *
 * @param {Error} err - The error thrown by a route handler.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }
    if (err instanceof UpstreamError) {
        return res.status(502).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
