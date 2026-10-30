/* tracker.js — recruitment deadlines + academic calendar, built only from VerifiedPack. All times Asia/Kolkata. */
(function () {
  "use strict";
  const P = window.VerifiedPack, D = window.CampusData; if (!P || !D) return;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const safe = (u) => (/^https?:\/\//i.test(u || "") ? u : "");
  const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD in IST
  const dn = (d) => { const [y, m, x] = d.split("-").map(Number); return Date.UTC(y, m - 1, x) / 864e5; };
  const fmt = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const src = (u, t) => (safe(u) ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>` : "no source link");
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

  function recruitment() {
    let open = 0;
    $("#deadlineGrid").innerHTML = P.recruitment.map((r) => {
      const club = D.clubs.find((c) => c.verifiedId === r.club_id) || {};
      let closed, line;
      if (r.deadline_time) {
        const ms = new Date(`${r.deadline_date}T${r.deadline_time}:00+05:30`) - Date.now();
        closed = ms <= 0;
        if (!closed) { const h = Math.floor(ms / 36e5); line = `${plural(Math.floor(h / 24), "day")} ${h % 24}h ${Math.floor((ms % 36e5) / 6e4)}m left (IST)`; }
      } else {
        const d = dn(r.deadline_date) - dn(today());
        closed = d < 0;
        if (!closed) line = (d === 0 ? "Deadline is today" : `${plural(d, "calendar day")} left`) + " · closing time not published";
      }
      if (!closed) open++;
      return `<article class="card"><div class="badges"><span class="badge ${closed ? "a" : ""}">${closed ? "Closed" : "Open"}</span><span class="badge">${r.precision === "date_only" ? "Date only" : "Date + time"}</span></div>
        <h3>${esc(club.name || r.club_id)}</h3><p>${fmt(r.deadline_date)}${r.deadline_time ? ", " + esc(r.deadline_time) + " IST" : " · closing time not published"}</p>
        ${line ? `<p><b>${esc(line)}</b></p>` : ""}<p class="muted">Public Instagram post (lower assurance than an official notice) · ${src(r.evidence_url, "source")} · checked ${fmt(r.checked_on)}</p></article>`;
    }).join("");
    $("#hOpen").textContent = open; $("#hToday").textContent = fmt(today());
    $("#deadlineBanner").innerHTML = open ? `${open} verified deadline(s) open.` : `No verified upcoming deadlines. The ${P.recruitment.length} recorded deadlines are all closed, and we do not guess next year’s dates. Watch the notice board and club Instagram pages.`;
  }

  function calendar() {
    const c = $("#cohort").value, sem = $("#sem").value, t = today();
    const ev = P.academic.filter((e) => e.cohort === c && e.semester === sem).sort((a, b) => a.start_date.localeCompare(b.start_date));
    const box = $("#calGrid");
    if (!ev.length) {
      const g = c === "FY" && sem === "I" ? "https://www.vit.edu/wp-content/uploads/2026/09/FY-Academic-Calendar-2026-27.pdf" : "https://www.vit.edu/academics-calendar/";
      box.innerHTML = `<div class="empty">Dates for ${esc(c)}, semester ${esc(sem)} are not verified yet${c === "FY" && sem === "I" ? " (the official PDF could not be retrieved)" : ""}. Check the ${src(g, "official source")}. We never copy another cohort’s dates.</div>`;
      return;
    }
    box.innerHTML = ev.map((e) => {
      const range = e.start_date === e.end_date ? fmt(e.start_date) : `${fmt(e.start_date)} – ${fmt(e.end_date)}`;
      let st;
      if (dn(e.end_date) < dn(t)) st = "Done";
      else if (dn(e.start_date) <= dn(t)) st = "Happening now";
      else st = "In " + plural(dn(e.start_date) - dn(t), "day");
      return `<article class="card"><div class="badges"><span class="badge ${st === "Done" ? "" : "a"}">${st}</span>${e.start_date !== e.end_date ? '<span class="badge">Window</span>' : ""}${e.tentative ? '<span class="badge">Tentative</span>' : ""}</div>
        <h3>${esc(e.event)}</h3><p>${range}</p><p class="muted">${src(e.source_url, "source")} · checked ${fmt(e.checked_on)}</p></article>`;
    }).join("");
  }

  const GAP = { unverified_pdf_fetch_failed: "Official PDF could not be retrieved", not_verified: "Not verified", not_accessed_no_exports_supplied: "Not accessed (no exports supplied)", incomplete_inventory: "Inventory incomplete" };
  $("#gapList").innerHTML = P.gaps.map((g) => `<li>${esc(g.item)} — ${esc(GAP[g.status] || g.status)}${g.source_url ? " · " + src(g.source_url, "source") : ""}</li>`).join("");
  $("#cohort").addEventListener("change", calendar); $("#sem").addEventListener("change", calendar);
  recruitment(); calendar(); setInterval(recruitment, 60000);
})();
