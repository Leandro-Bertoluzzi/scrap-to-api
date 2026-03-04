# DR 0002: Hexagonal Architecture (Ports & Adapters)

## Status

Accepted

## Date

2026-03-04

## Context and Problem

The application needs to combine at least two distinct technical concerns: serving an HTTP API and scraping web pages with a headless browser. Without an explicit structural guideline, business logic (what data to retrieve and how to shape it) tends to become entangled with infrastructure details (Express routing, Puppeteer calls), making the code hard to test in isolation and difficult to evolve independently.

A structural decision was needed to keep these concerns separate, enable unit testing without real network or browser dependencies, and provide a clear model for adding new adapters or use cases in the future.

## Options Considered

1. **Flat / script-per-endpoint structure**: Each route handler directly calls Puppeteer, parses the DOM, and returns the response — no layering.
    - Pros: Minimal boilerplate, fast to write initially.
    - Cons: Business logic and infrastructure are coupled; unit testing requires mocking Puppeteer internals; impossible to swap the scraping engine without touching every handler.

2. **Layered MVC**: Controllers, services, and data-access layers following a typical web framework pattern.
    - Pros: Familiar pattern, well-documented conventions.
    - Cons: "Service" layer still tends to import infrastructure directly; dependency direction is implicit (controllers depend on services, services depend on "repositories" that are concrete classes, not abstractions). Testing services still requires stubbing concrete classes.

3. **Hexagonal Architecture (Ports & Adapters)**: The domain defines pure models and abstract port interfaces. Application use cases depend only on those ports. Infrastructure provides concrete adapter implementations. A composition root wires everything together.
    - Pros: Dependency direction is explicit and enforced by convention; use cases are testable with any fake adapter; adapters are swappable without changing application logic; clear place for each type of code.
    - Cons: More files and indirection than a flat structure; requires discipline to keep the domain free of infrastructure imports; may feel like over-engineering for a small project.

## Decision

Adopt Hexagonal Architecture organised in three layers:

- **`domain/`** — pure domain models (factory functions) and port interfaces (abstract base classes that throw `not implemented`). No infrastructure imports allowed here.
  - Models: `createSearchResult`, `createSeasonalAnime`
  - Ports: `IBrowser`, `IPage`, `ISearchRepository`, `ISeasonalAnimeRepository`

- **`application/`** — use cases that receive port implementations via constructor injection and orchestrate domain operations.
  - `SearchUseCase` — delegates to `ISearchRepository.search()`
  - `ListSeasonalAnimeUseCase` — delegates to `ISeasonalAnimeRepository.seasonalAnime()`

- **`infrastructure/`** — concrete adapter implementations of the ports, plus the HTTP layer.
  - Scraping adapters: `PuppeteerBrowser` (implements `IBrowser`), `PuppeteerPage` (implements `IPage`), `MALScraper` (implements both `ISearchRepository` and `ISeasonalAnimeRepository`)
  - HTTP adapters: Express server factory and route factories that receive use cases via injection

- **`index.js`** (composition root) — the single place where all concrete implementations are instantiated and injected; owns the process lifecycle (startup, graceful shutdown).

`MALScraper` intentionally implements two repository ports (`ISearchRepository` and `ISeasonalAnimeRepository`) in a single class, as both share the same browser instance, base URL, and page-size configuration. This is a deliberate, accepted trade-off rather than an oversight.

## Consequences

- **[+]** Use cases and domain logic are fully unit-testable using fake adapters without launching a real browser or making network requests.
- **[+]** The scraping engine (Puppeteer) can be replaced or augmented without modifying application or domain code.
- **[+]** The HTTP framework (Express) can be replaced without touching use cases or domain logic.
- **[+]** Dependency direction is unambiguous: `infrastructure` → `application` → `domain`; the domain never imports from outer layers.
- **[+]** Clear and predictable location for each type of code, reducing cognitive overhead when navigating the codebase.
- **[-]** More boilerplate than a flat structure: port interfaces, factory functions, and route factories add files that would not exist in a simpler design.
- **[-]** `MALScraper` implementing two ports in one class is a minor deviation from strict single-responsibility; requires team awareness to avoid accumulating additional responsibilities over time.
- **[-]** Discipline is required to keep the domain layer free of infrastructure imports; there is no compile-time enforcement of this rule in plain JavaScript.

## [optional] Next Steps

- Consider adding an ESLint rule (e.g., `import/no-restricted-paths`) to statically enforce that `domain/` does not import from `infrastructure/` or `application/`.
- As new data endpoints are added (e.g., top lists, recommendations, reviews), follow the same pattern: new port in `domain/ports/`, new use case in `application/use-cases/`, new method in `MALScraper` (or a separate adapter if concerns diverge).
