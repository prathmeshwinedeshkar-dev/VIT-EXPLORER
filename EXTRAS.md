# The three extras, audited

## 1. Vibe-check quiz (`features.quiz`)
- **What/why:** three questions suggest up to three clubs, so a first-year knows where to start.
- **Files:** `index.html` (`#vibe`, `#quizBox`), `script.js` (`QUIZ`, `renderQuiz`, quiz click handler), `style.css` (`.quiz`).
- **Data flow:** each answer carries category tags -> tags are collected in `picks` -> each club scores the number of its own categories that appear in `picks` (membership, not frequency) -> clubs with score > 0 are sorted by score (ties keep list order) -> top 3 shown with the normal club card.
- **Not:** AI, personalised ML, or a validated test. The result screen says so.
- **Limits:** coarse (tags only); ties follow list order; unverified clubs can appear (they carry the Unverified badge).
- **Failure cases:** if no club matches, a fallback message appears.
- **Demo:** tap three answers; open a suggested club's details.
- **Disable:** `features.quiz: false` (section, nav link and hero wording removed; tested).
- **Interview line:** "It is a simple rule-based matcher. Answers map to category tags and I rank clubs by how many tags they share. I say plainly on screen that it isn't a validated assessment."

## 2. Installable / offline (PWA) (`features.pwa`)
- **What/why:** lets students add the site to a phone and reopen pages without connectivity.
- **Files:** `manifest.json`, `icon.svg`, `icon-192.png`, `icon-512.png`, `sw.js`, registration in `script.js`.
- **Data flow:** `sw.js` is **network-first**: online requests fetch fresh files and store a copy in the cache; offline requests return the last cached copy, or `index.html` as a shell.
- **Limits:** needs HTTPS or localhost (not `file://`); the first visit must be online; only files visited or pre-cached are available offline; install prompts are browser-dependent (iOS uses "Add to Home Screen"). Updates arrive on the next online load; bump `CACHE` in `sw.js` to purge old caches.
- **Tested:** the fetch strategy in a sandbox with mocked cache/network (online, offline-cached, offline-uncached, cross-origin). **Not tested:** real browser install, Lighthouse, offline behaviour on a device.
- **Demo:** open the live site, load once, switch on airplane mode, reload.
- **Disable:** `features.pwa: false` (manifest link removed; any existing service worker is unregistered).
- **Interview line:** "A service worker caches files as you browse. It tries the network first so students never see stale data, and falls back to the cache offline."

## 3. Data import (`features.import`, OFF by default)
- **What/why:** lets a maintainer add club/event/resource/place records from a JSON file without editing code. It changes only that browser, so it does not benefit other students; hence off.
- **Files:** `index.html` (`#importPanel`), `script.js` (`clean`, import handler), `localStorage` key `cx_import`.
- **Data flow:** file -> checks (.json, <= 200 KB) -> parse -> `clean()` (needs string `id` and `name`; max 200 items; strings capped; evidence fields `verified/source/statusLabel/leadership/evidence/recruit/note` stripped; `imported:true` forced) -> duplicates of existing ids skipped -> stored if total <= 300 KB -> merged and rendered with "Imported on this device" + "Unverified" badges.
- **Safety:** all text is HTML-escaped on render and links must be http(s); imported records can never be verified or override a verified record.
- **Limits:** per-browser only; no schema versioning; removing data = "Remove imported data" button.
- **Failure cases handled:** wrong extension, oversize, malformed JSON, duplicates, invalid items, corrupted stored data.
- **Demo:** set the flag to `true`, upload a small JSON, see the labelled card.
- **Interview line:** "I built it defensively, but I turned it off because it only affects one browser. Everything imported is labelled and can't claim verification."
