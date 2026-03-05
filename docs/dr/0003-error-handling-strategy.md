# DR 0003: Error Handling Strategy

## Status

Accepted

## Date

2026-03-04

## Context and Problem

The application acts as a proxy API that scrapes MyAnimeList via Puppeteer. Prior to this decision, all errors thrown by the repository adapters were plain `Error` instances with a string message. The HTTP route handlers caught every error and unconditionally returned `400 Bad Request`, regardless of whether the error represented a missing resource, a bad upstream response, or an unexpected runtime failure. Additionally, each route duplicated the catch logic.

This meant:

-   A page that genuinely does not exist on MAL returned `400` instead of `404`.
-   An unexpected scraping failure (e.g. network timeout) returned `400` instead of `502`.
-   A programming bug returned `400` instead of `500`.
-   Error-to-HTTP translation logic was scattered across route handlers with no single source of truth.

## Options Considered

1. **Map error by message string in route handlers**: Check `error.message` against known strings in each route and return the appropriate status code.

    - Pros: No new classes required.
    - Cons: Fragile (message changes break the mapping), logic duplicated per route, no type safety.

2. **Typed domain error classes + Express error middleware**: Create specific error classes in `domain/errors/` (`NotFoundError`, `UpstreamError`). Repository adapters throw typed errors. A single Express error handler in `server.js` maps class → HTTP status code.

    - Pros: Single responsibility for the HTTP mapping, type-safe, extensible, clean route handlers.
    - Cons: Adds two new files; requires updating all throw sites.

3. **Global `uncaughtException` / `unhandledRejection` handlers**: Catch all unhandled errors at the process level.
    - Pros: Catches everything.
    - Cons: Not idiomatic for Express; does not solve the semantic mapping problem; difficult to send an HTTP response from a process-level handler.

## Decision

Adopt **option 2**: typed domain error classes with a central Express error middleware.

Two error classes are introduced in `domain/errors/`:

| Class                 | Meaning                                                                                    | HTTP status               |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------------------- |
| `NotFoundError`       | The requested resource does not exist on MAL (404 upstream, or redirect to a generic page) | 404 Not Found             |
| `UpstreamError`       | MAL or Puppeteer failed unexpectedly (timeouts, unexpected selectors, etc.)                | 502 Bad Gateway           |
| _(any other `Error`)_ | Unexpected bug in this codebase                                                            | 500 Internal Server Error |

The translation from error class to HTTP status lives exclusively in the Express error middleware registered in `server.js`. Route handlers simply call `next(error)` from their catch blocks.

## Consequences

-   **[+]** Each HTTP status code is now semantically correct — consumers can distinguish "not found" from "server problem" from "gateway problem".
-   **[+]** Single point of maintenance for the error → HTTP code map.
-   **[+]** Route handlers are simpler: no more manual `res.status(...).json(...)` inside catch blocks.
-   **[+]** `UpstreamError` is available for future use when timeout/selector error handling is added.
-   **[-]** All existing `throw new Error(...)` sites in repository adapters must be updated to use typed errors; easy to forget in future adapters if no linting rule enforces it.

## Next Steps

-   Add an ESLint rule (or a test assertion) to prevent plain `new Error()` throws inside `infrastructure/scraping/` adapters.
-   When Puppeteer timeout or "element not found" handling is implemented, wrap those in `UpstreamError`.
