# DR 0001: Proxy API via Web Scraping

## Status

Accepted

## Date

2026-03-04

## Context and Problem

Consumers need structured, machine-readable access to [MyAnimeList](https://myanimelist.net) (MAL) data — specifically anime search results and seasonal anime listings. MAL does not provide a freely accessible public API, which means any programmatic consumer must either rely on a third-party service or retrieve data directly from the MAL website.

The goal is to expose clean JSON endpoints that abstract away the HTML structure of MAL and can be consumed by any HTTP client.

## Options Considered

1. **MAL Official OAuth API**: MyAnimeList provides an official API, but it requires user registration, OAuth 2.0 credentials, and imposes rate limits and scope restrictions that do not cover all data points of interest (e.g., full seasonal listings with category breakdown).
    - Pros: Officially supported, stable contract, no HTML parsing.
    - Cons: Requires API key registration, restrictive rate limits, limited scope, subject to policy changes.

2. **Jikan (community REST API)**: Jikan is an open-source, unofficial REST API that wraps MAL. It can be [self-hosted](https://github.com/jikan-me/jikan) or consumed from the public instance.
    - Pros: No scraping required on our side, familiar REST interface, actively maintained by the community, self-hosting eliminates external availability concerns.
    - Cons: Still an intermediary layer (depends on Jikan keeping up with MAL changes), limited ability to customize the response shape, operational overhead if self-hosted.

3. **Own web scraping with Puppeteer**: Run a headless Chromium browser server-side to navigate MAL pages, extract DOM content, and map it to domain models.
    - Pros: Full control over which data is extracted and how it is shaped, no dependency on external APIs at runtime, works even on pages that require JavaScript rendering, response shape can be evolved independently.
    - Cons: Fragile to MAL HTML/CSS changes, requires running a Chromium process (higher memory and CPU footprint), no official support contract, maintenance overhead when MAL redesigns pages.

## Decision

Build a proxy HTTP API (`scrap-to-api`) that scrapes MyAnimeList using Puppeteer running a headless Chromium instance. The API exposes structured JSON endpoints for search and seasonal anime listings. A single browser instance is kept alive for the lifetime of the process and a new page is opened per request, navigated to the corresponding MAL URL, and closed after data extraction.

This option was chosen primarily as a learning exercise: building a proxy API from scratch is a practical opportunity to explore web scraping, headless browsers, and API design hands-on. Beyond the educational motivation, it also offers full control over the data shape, eliminates runtime dependency on third-party services, and allows the API to serve data from pages that require JavaScript rendering — something a simple HTTP fetch cannot do reliably on MAL.

## Consequences

- **[+]** No dependency on external APIs or services at runtime; the API works as long as MAL is reachable.
- **[+]** Full control over the response payload shape; consumers get exactly what the domain models expose.
- **[+]** Supports JavaScript-rendered pages naturally, since Chromium executes the page like a real browser.
- **[+]** No API key registration or OAuth flow needed to operate.
- **[-]** Fragile to changes in MAL's HTML structure or CSS class names; any redesign may break selectors.
- **[-]** Running a headless Chromium process is significantly heavier than a plain HTTP request, requiring adequate memory and CPU — addressed by containerising the app with Docker.
- **[-]** No official support or deprecation notice; breaking changes on the MAL side are discovered reactively.
- **[-]** Page-by-page scraping introduces latency inherent to browser navigation and DOM rendering.

## [optional] Next Steps

- Add integration tests with static HTML fixtures for each scraped page type, so selector breakage is caught before deployment.
- Monitor MAL HTML structure periodically; consider adding a canary test that flags unexpected DOM changes.
- Evaluate caching scraped responses to reduce load on MAL and improve API response times.
