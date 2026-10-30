# Scope: what the brief required vs what was added

## The brief (GDG VIT Pune, Web Development, First Year: "Interactive Campus Explorer")
Objective: a responsive website that helps students explore campus clubs, events or student resources. Four requirements:

| # | Requirement | Where it is implemented |
|---|---|---|
| 1 | Visually appealing, responsive page showing information as cards or sections | `index.html` sections; card templates in `script.js` (`clubCard`, `eventCard`, `resCard`); `style.css` |
| 2 | JavaScript search or filtering | `script.js`: `matches()` (live text search + category chips + "Verified details only") and `eventMatches()` (event filter panel) |
| 3 | At least one interactive feature (expandable details, category filters, or a validated form) | All three: `<details>` "More details" on cards, category chips, and the registration form with validation (`#regForm` handler) |
| 4 | Works on mobile and desktop | `style.css` media queries at 480/768/1024/1440 px. Reviewed in code; not tested on real devices |

## Deliberate enhancements (enabled; each explainable)
- **Verification labels, evidence links and the "Verified details only" filter.** Students can tell checked facts from guesses.
- **Recruitment deadlines (`tracker.js`).** Asia/Kolkata countdown only from verified, explicit deadlines; closed items never show as open.
- **Academic calendar (`tracker.js`).** FY/SY/TY/Final/Direct Second Year kept separate; exams shown as windows.
- **My Campus Plan** (localStorage). Students keep a shortlist of clubs, events and resources.
- **Light/dark theme, "/" search shortcut.** Small usability aids.
- **Vibe-check quiz** (`features.quiz`, on). Helps a first-year who does not know which club to open first. Rule-based.
- **Installable / offline support** (`features.pwa`, on). Previously visited pages keep working without a connection.

## Disabled by default
- **Data import** (`features.import`, off). It only changes the visitor's own browser, so it does not help other students. Code is hardened and tested but switched off. See `docs/EXTRAS.md`.

## Incomplete / unverified (shown honestly in the UI)
- Only some clubs have source evidence; the rest show "Unverified".
- All events are unverified (organisers/dates are general guidance).
- FY calendar dates are not verified; Semester II is not verified.
- Recruitment dates exist only for the three recorded closed deadlines; GDG VIT Pune has none published.
- Testimonials are fictional and labelled as such.

## How to switch things off
Edit `config.features` in `data.js`:
`features: { quiz: true, pwa: true, import: false }`. Setting a flag to `false` removes that feature's section, nav link and hero wording; the rest of the site keeps working (tested).
