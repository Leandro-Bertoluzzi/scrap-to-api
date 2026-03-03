# Test Fixtures

HTML snapshots used by the integration test suite. Each file is a simplifiedversion of the real MAL page — only the `div#content` section with 2–3 real entries is needed.

## Files

| File                           | Origin URL                                            | Query / Season                        | Captured   |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------- | ---------- |
| `search-anime.html`            | `https://myanimelist.net/anime.php?q=claymore&show=0` | query: `claymore`                     | March 2026 |
| `search-manga.html`            | `https://myanimelist.net/manga.php?q=claymore&show=0` | query: `claymore`                     | March 2026 |
| `list-current-season.html`     | `https://myanimelist.net/anime/season`                | Winter 2026 (current at capture time) | March 2026 |
| `list-season-2024-spring.html` | `https://myanimelist.net/anime/season/2024/spring`    | Spring 2024                           | March 2026 |

## Content summary

### search-anime.html

**Description:** Results for query "claymore" (anime).
**Source URL:** `https://myanimelist.net/anime.php?q=claymore&show=0`

### search-manga.html

**Description:** Results for query "claymore" (manga).
**Source URL:** `https://myanimelist.net/manga.php?q=claymore&show=0`

### list-current-season.html

**Description:** Current (Winter 2026, at the time of capture) seasonal anime listing.
**Source URL:** `https://myanimelist.net/anime/season`

### list-season-2024-spring.html

**Description:** Spring 2024 seasonal anime listing.
**Source URL:** `https://myanimelist.net/anime/season/2024/spring`

## How to update or add a fixture

1. Navigate to the target MAL URL in your browser.
2. Wait for the page to fully load.
3. Save the page as **"Web Page, HTML Only"** (not "Complete").
4. Open the saved file and strip everything outside `<div id="content">…</div>`, keeping a minimal `<html><head>…</head><body>…</body></html>` wrapper.
5. Keep only 2–3 result entries (rows / cards) to keep the file small.
6. Place the file in `tests/fixtures/` and add a matching route in [`tests/integration/helpers/StaticServer.js`](../integration/helpers/StaticServer.js).
7. Update this README with the new entry.
