"use strict";
/* Smoke tests: run the real site in jsdom with the clock fixed to 30 Oct 2026 12:00 IST.
   Run with: npm test. Does not test real browsers, layout, Lighthouse or screen readers. */
const fs = require("fs"), path = require("path");
const { JSDOM, VirtualConsole, ResourceLoader } = require("jsdom");
const root = path.join(__dirname, "..") + path.sep;
class Loader extends ResourceLoader {
  constructor(over = {}) { super(); this.over = over; }
  fetch(u) {
    try {
      const name = decodeURIComponent(new URL(u).pathname).replace(/^\//, "") || "index.html";
      let buf = fs.readFileSync(root + name);
      if (this.over[name]) buf = Buffer.from(this.over[name](buf.toString("utf8")));
      return Promise.resolve(buf);
    } catch (e) { return Promise.reject(e); }
  }
}
let pass = 0, fail = 0;
const t = (n, c) => { c ? pass++ : fail++; console.log((c ? "PASS " : "FAIL ") + n); };

function boot(setup, over = {}) {
  return new Promise((resolve) => {
    const errs = [], vc = new VirtualConsole();
    vc.on("jsdomError", (e) => errs.push(e.message)); vc.on("error", (e) => errs.push(String(e)));
    const dom = new JSDOM(fs.readFileSync(root + "index.html", "utf8"), {
      url: "http://localhost/index.html", runScripts: "dangerously", resources: new Loader(over), virtualConsole: vc, pretendToBeVisual: true,
      beforeParse(w) {
        w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
        w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event("close")); };
        const R = w.Date, f = new R("2026-10-30T12:00:00+05:30").getTime();
        w.Date = class extends R { constructor(...a) { a.length ? super(...a) : super(f); } static now() { return f; } };
        w.Element.prototype.scrollIntoView = () => {};
        if (setup) setup(w);
      }
    });
    dom.window.addEventListener("load", () => setTimeout(() => resolve({ w: dom.window, errs }), 300));
  });
}
const H = (w) => ({ $: (s) => w.document.querySelector(s), $$: (s) => [...w.document.querySelectorAll(s)], ev: (el, type) => el.dispatchEvent(new w.Event(type, { bubbles: true })) });

(async () => {
  /* ---- normal run ---- */
  const { w, errs } = await boot(); const { $, $$, ev } = H(w), D = w.CampusData;
  t("no script errors (" + errs.length + ")", errs.length === 0);
  t("club cards = data length", $$("#clubGrid .card").length === D.clubs.length);
  const s = $("#search"); s.value = "robotics"; ev(s, "input"); const n = $$("#clubGrid .card").length;
  t("search 'robotics' filters (" + n + ")", n > 0 && n < D.clubs.length);
  s.value = "zzzqq"; ev(s, "input"); t("no-results state shown", $("#noResults").hidden === false); s.value = ""; ev(s, "input");
  const vo = $("#verifiedOnly"); vo.checked = true; ev(vo, "change");
  t("verified-only shows only verified clubs", $$("#clubGrid .card").length === D.clubs.filter((c) => c.verified).length);
  vo.checked = false; ev(vo, "change");
  t("no empty links", $$("a[href]").every((a) => a.getAttribute("href") !== ""));
  t("external links have rel=noopener", $$("a[target=_blank]").every((a) => /noopener/.test(a.rel)));
  const ids = $$("[id]").map((e) => e.id); t("no duplicate ids", ids.length === new Set(ids).size);
  t("all form fields labelled", $$("input,select,textarea").every((e) => e.closest("label") || e.getAttribute("aria-label") || (e.id && $(`label[for=${e.id}]`))));
  t("every button has a type", $$("button").every((b) => b.getAttribute("type")));
  t("deadline banner says none open", /No verified upcoming/.test($("#deadlineBanner").textContent));
  t("no deadline card marked Open", !$$("#deadlineGrid .badge").some((b) => b.textContent === "Open"));
  t("FY calendar shows honest empty state", /not verified/.test($("#calGrid").textContent) && $$("#calGrid .card").length === 0);
  const c = $("#cohort"); c.value = "SY"; ev(c, "change");
  t("SY shows 7 events", $$("#calGrid .card").length === 7); t("SY has tentative tag", /Tentative/.test($("#calGrid").textContent));
  c.value = "Direct Second Year SEDA"; ev(c, "change");
  t("SEDA has its own dates (no SY '6 Jul')", $$("#calGrid .card").length > 0 && !/6 Jul/.test($("#calGrid").textContent));
  const sm = $("#sem"); sm.value = "II"; ev(sm, "change"); t("Semester II shows empty state", $$("#calGrid .card").length === 0); sm.value = "I"; ev(sm, "change");
  t("form says it is local-only", /saves to this device only/i.test($("#regForm").textContent));
  t("no placeholder links", $$("a[href]").every((a) => !/your-/.test(a.href)));
  const rf = $("#regForm"); Object.entries({ name: "A", prn: "12345678", email: "bad", phone: "9999999999", branch: "IT", why: "x" }).forEach(([k, v]) => (rf.elements[k].value = v));
  ev(rf, "submit"); t("invalid email rejected", /valid email/.test($("#regMsg").textContent));
  rf.elements.email.value = "a@b.co"; ev(rf, "submit");
  t("valid registration shown", $$("#regBox .card").length === 1);
  t("registration persisted to localStorage", JSON.parse(w.localStorage.getItem("cx_regs") || "[]").length === 1);
  $("[data-act=save]").click(); t("plan counter updates", $("#planCount").textContent === "1");
  const p = JSON.parse(w.localStorage.getItem("cx_plan") || "{}"); t("plan persisted", (p.clubs || []).length + (p.events || []).length + (p.resources || []).length === 1);
  t("events flagged unverified", $$("#eventGrid .card").every((e) => /nverified/.test(e.textContent)));
  t("resource cards never label the home page 'Open Resource'", !$$("#resGrid .card a.btn").some((a) => a.textContent === "Open Resource" && a.href.replace(/\/$/, "") === "https://www.vit.edu"));
  t("hero tiles show live club count", new RegExp(String(D.clubs.length)).test($(".bento").textContent));
  t("noscript fallback present", !!$("noscript"));

  /* ---- corrupted storage + malformed import must not break the page ---- */
  const bad = await boot((win) => {
    win.localStorage.setItem("cx_plan", '{"clubs":"oops","events":[1,"e1"]}');
    win.localStorage.setItem("cx_regs", '{"a":1}');
    win.localStorage.setItem("cx_import", '{"clubs":[{"id":"x"},{"id":"imp1","name":"Imported Club"}],"events":"nope"}');
  }, { "data.js": (x) => x.replace("import: false", "import: true") });
  const B = H(bad.w), BD = bad.w.CampusData;
  t("corrupted storage: no script errors", bad.errs.length === 0);
  t("corrupted storage: plan normalised", B.$("#planCount").textContent === "0");
  t("malformed import item dropped, valid one kept", !BD.clubs.some((x) => x.id === "x") && BD.clubs.some((x) => x.name === "Imported Club"));
  B.$("[data-act=save]").click(); t("corrupted storage: saving still works", B.$("#planCount").textContent === "1");
  const off2 = await boot((win) => win.localStorage.setItem("cx_import", '{"clubs":[{"id":"imp1","name":"Imported Club"}]}'));
  t("import off: stored imports are ignored", off2.errs.length === 0 && !off2.w.CampusData.clubs.some((x) => x.id === "imp1"));

  /* ---- v5 additions: default flags, GDG evidence, anchors ---- */
  t("every in-page anchor resolves to an element", $$('a[href^="#"]').every((a) => a.getAttribute("href") === "#" || $(a.getAttribute("href"))));
  t("default flags: quiz on, import panel absent, manifest linked", !!$("#vibe") && !$("#importPanel") && !!$("#manifestLink"));
  const gdg = D.clubs.find((x) => x.id === "gdg-vit");
  t("GDG uses the official chapter name (VIT Pune, not VIIT/University)", gdg.name === "GDG on Campus Vishwakarma Institute of Technology - Pune, India");
  t("GDG has chapter-page evidence and verified date", gdg.verified === "2026-10-31" && /gdg\.community\.dev\/gdg-on-campus-vishwakarma-institute-of-technology-pune-india/.test(gdg.source));
  t("GDG organizers listed with tenure unknown (null)", gdg.leadership.length === 3 && gdg.leadership.every((l) => l.tenure === null));
  const gcard = $$("#clubGrid .card").find((c) => /GDG on Campus Vishwakarma Institute of Technology/.test(c.textContent));
  t("GDG card: 'not published' recruitment, tenure caveat, Instagram link", /Recruitment dates not published/.test(gcard.textContent) && /tenure not stated/.test(gcard.textContent) && !!gcard.querySelector('a[href="https://instagram.com/gdg.vitpune"]'));
  t("GDG has no deadline record (not shown as open or closed)", !(w.VerifiedPack.recruitment || []).some((r) => r.club_id === "gdg"));
  t("unverified club says recruitment unknown", /Recruitment: unknown/.test($$("#clubGrid .card").find((c) => /Unverified/.test(c.textContent)).textContent));
  t("quiz result states it is not a validated assessment", (() => { for (let i = 0; i < 3; i++) $("[data-quiz]").click(); return /Not a validated assessment/.test($("#quizBox").textContent); })());

  /* ---- import ON: hostile file must not become verified ---- */
  const imp = await boot(null, { "data.js": (x) => x.replace("import: false", "import: true") });
  const I = H(imp.w); t("import on: no errors, panel present", imp.errs.length === 0 && !!I.$("#importPanel"));
  const up = (name, text, size) => { const f = new imp.w.File([text], name, { type: "application/json" }); if (size) Object.defineProperty(f, "size", { value: size }); Object.defineProperty(I.$("#importFile"), "files", { value: [f], configurable: true }); I.ev(I.$("#importFile"), "change"); return new Promise((r) => setTimeout(r, 100)); };
  await up("x.json", JSON.stringify({ clubs: [{ id: "evil", name: "Evil Club", verified: "2026-10-31", source: "https://evil.test", statusLabel: "Listed on official page", leadership: [{ name: "Fake", role: "Lead" }], website: "javascript:alert(1)", description: "<img src=x onerror=alert(1)>" }, { id: "gdg-vit", name: "Dup" }, { id: 5 }] }));
  const ev1 = imp.w.CampusData.clubs.find((x) => x.id === "evil");
  t("import: evidence fields stripped, never verified", ev1 && !ev1.verified && !ev1.source && !ev1.statusLabel && !ev1.leadership && ev1.imported === true);
  t("import: duplicate id and invalid item skipped", imp.w.CampusData.clubs.find((x) => x.id === "gdg-vit").name !== "Dup" && /skipped 2/.test(I.$("#importMsg").textContent));
  const ecard = I.$$("#clubGrid .card").find((c) => /Evil Club/.test(c.textContent));
  t("import: card labelled Imported + Unverified; unsafe markup/URL inert", /Imported on this device/.test(ecard.textContent) && /Unverified/.test(ecard.textContent) && !ecard.querySelector("img,script") && !ecard.querySelector('a[href^="javascript"]'));
  await up("big.json", "{}", 300 * 1024); t("import: oversized file rejected", /too large/.test(I.$("#importMsg").textContent));
  await up("bad.txt", "{}"); t("import: non-.json rejected", /\.json/.test(I.$("#importMsg").textContent));
  await up("bad.json", "[1,2"); t("import: malformed JSON handled", /not valid JSON/.test(I.$("#importMsg").textContent));
  t("import: persisted without verification", JSON.parse(imp.w.localStorage.getItem("cx_import")).clubs[0].verified === undefined);

  /* ---- all extras OFF: navigation and page must still work ---- */
  const off = await boot(null, { "data.js": (x) => x.replace("{ quiz: true, pwa: true, import: false }", "{ quiz: false, pwa: false, import: false }") });
  const O = H(off.w); t("extras off: no errors", off.errs.length === 0);
  t("extras off: quiz/import/manifest removed", !O.$("#vibe") && !O.$("#importPanel") && !O.$("#manifestLink") && !O.$('.nav nav a[href="#vibe"]'));
  t("extras off: hero CTA points at clubs; anchors all resolve", O.$(".cta .primary").getAttribute("href") === "#clubs" && O.$$('a[href^="#"]').every((a) => a.getAttribute("href") === "#" || O.$(a.getAttribute("href"))));
  t("extras off: clubs still render and search works", O.$$("#clubGrid .card").length === off.w.CampusData.clubs.length);

  /* ---- service worker strategy (run in a sandbox with mocked caches/fetch) ---- */
  const vm = require("vm"); const L = {}, store = new Map(); let online = true;
  const ctx = { self: { addEventListener: (n, f) => (L[n] = f), skipWaiting() {}, clients: { claim() {} } }, location: { origin: "http://x" }, URL, Promise,
    caches: { open: async () => ({ addAll: async () => {}, put: async (r, c) => store.set(r.url, c) }), match: async (r) => store.get(r.url || r) || (r === "index.html" ? { body: "shell" } : undefined), keys: async () => [], delete: async () => true },
    fetch: async (r) => { if (!online) throw new Error("offline"); return { ok: true, body: "net:" + r.url, clone() { return this; } }; } };
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(root + "sw.js", "utf8"), ctx);
  const hit = (url) => new Promise((res) => L.fetch({ request: { method: "GET", url }, respondWith: (p) => res(p) }));
  const r1 = await hit("http://x/data.js"); await new Promise((r) => setTimeout(r, 20));
  t("sw: online request served from network and cached", r1.body === "net:http://x/data.js" && store.has("http://x/data.js"));
  online = false; const r2 = await hit("http://x/data.js"); t("sw: offline falls back to last cached copy", r2.body === "net:http://x/data.js");
  const r3 = await hit("http://x/never-seen.js"); t("sw: offline + uncached falls back to app shell", r3.body === "shell");
  t("sw: ignores cross-origin requests", await Promise.race([hit("http://other/x.js").then(() => false), new Promise((r) => setTimeout(() => r(true), 30))]));

  console.log(`\n${pass} passed, ${fail} failed`); process.exitCode = fail ? 1 : 0; process.exit();
})();
