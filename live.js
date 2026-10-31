/* live.js: loads live-data.json (a file in this repo) so deadlines and announcements can change without touching code.
   Honest scope: this is not real-time server data. It updates when the maintainer edits live-data.json and Pages republishes.
   States: loading, updated, saved copy (offline/error), unavailable, empty. Invalid records are dropped, never guessed. */
(function () {
  "use strict";
  const P = window.VerifiedPack; if (!P) return;
  const KEY = "cx_live", FILE = "live-data.json", TIMEOUT = 6000;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const http = (u) => /^https?:\/\//i.test(u || "");
  const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "") && !isNaN(new Date(d + "T00:00:00Z"));
  const fmt = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  const sec = document.createElement("section");
  sec.className = "wrap live"; sec.id = "liveUpdates"; sec.setAttribute("aria-label", "Live updates");
  sec.innerHTML = '<p id="liveStatus" class="chip loading" role="status">Checking for updates…</p><div id="announce" class="grid"></div>';
  const anchor = document.querySelector("#deadlines"); if (anchor) anchor.before(sec); else return;
  const status = sec.querySelector("#liveStatus"), box = sec.querySelector("#announce");
  const setStatus = (cls, html) => { status.className = "chip " + cls; status.innerHTML = html; };

  function validate(data) {
    const out = { updated: isDate(data && data.updated) ? data.updated : null, recruitment: [], announcements: [], dropped: 0 };
    ((data && data.recruitment) || []).forEach((r) => {
      const ok = r && typeof r.club_id === "string" && isDate(r.deadline_date) && isDate(r.checked_on) && http(r.evidence_url) &&
        (r.deadline_time == null || /^([01]\d|2[0-3]):[0-5]\d$/.test(r.deadline_time));
      if (ok) out.recruitment.push({ club_id: r.club_id, deadline_date: r.deadline_date, deadline_time: r.deadline_time || null, precision: r.deadline_time ? "date_time" : "date_only", evidence_url: r.evidence_url, checked_on: r.checked_on, source_type: r.source_type === "official_notice" ? "official_notice" : "public_post" });
      else out.dropped++;
    });
    ((data && data.announcements) || []).slice(0, 10).forEach((a) => {
      if (a && typeof a.id === "string" && typeof a.title === "string" && typeof a.text === "string" && isDate(a.date)) out.announcements.push({ id: a.id, title: a.title.slice(0, 120), text: a.text.slice(0, 400), date: a.date, source_url: http(a.source_url) ? a.source_url : "" });
      else out.dropped++;
    });
    out.announcements.sort((x, y) => y.date.localeCompare(x.date));
    return out;
  }
  function apply(v) {
    v.recruitment.forEach((r) => { if (!P.recruitment.some((x) => x.club_id === r.club_id && x.deadline_date === r.deadline_date)) P.recruitment.push(r); });
    box.innerHTML = v.announcements.length ? v.announcements.map((a) => `<article class="card"><span class="badge a">${esc(fmt(a.date))}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p>${a.source_url ? `<p class="muted"><a href="${esc(a.source_url)}" target="_blank" rel="noopener noreferrer">source</a></p>` : ""}</article>`).join("") : '<div class="empty">No announcements right now.</div>';
    if (window.CampusTracker) window.CampusTracker.refresh();
  }
  function run() {
    setStatus("loading", "Checking for updates…");
    const ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl && setTimeout(() => ctl.abort(), TIMEOUT);
    fetch(FILE, { cache: "no-store", signal: ctl ? ctl.signal : undefined })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((data) => {
        const v = validate(data); apply(v);
        try { localStorage.setItem(KEY, JSON.stringify({ data, at: Date.now() })); } catch (e) { /* storage blocked */ }
        setStatus("ok", `Live data updated ${v.updated ? esc(fmt(v.updated)) : "(date not stated)"}${v.dropped ? ` · ${v.dropped} invalid record(s) ignored` : ""}`);
      })
      .catch(() => {
        let saved = null; try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
        if (saved && saved.data) { const v = validate(saved.data); apply(v); setStatus("warn", `Couldn’t reach live updates. Showing the last saved copy${v.updated ? " (" + esc(fmt(v.updated)) + ")" : ""}. <button type="button" class="btn small ghost" id="liveRetry">Try again</button>`); }
        else { apply(validate({})); setStatus("warn", 'Live updates unavailable. Showing built-in data. <button type="button" class="btn small ghost" id="liveRetry">Try again</button>'); }
      })
      .finally(() => { if (timer) clearTimeout(timer); });
  }
  sec.addEventListener("click", (e) => { if (e.target.closest("#liveRetry")) run(); });
  window.CampusLive = { validate };
  run();
})();
