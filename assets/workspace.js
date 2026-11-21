/* Agent Workspace page: live command console, materials-database walkthrough,
 * command pipeline and figure gallery. Every figure was rendered by the current
 * TEDEX code from public demo data (assets/workspace/live/). Log lines are trimmed
 * from the real command output. */
(() => {
  "use strict";
  const page = document.getElementById("agent-workspace");
  if (!page) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FIG = "assets/workspace/live/";
  const TE = "data/demo/thermoelectric_property/{1,2,3,4,5}.csv";
  const CU2SE = "data/demo/spb_fitting/Cu2Se";

  /* ---------- Demo catalogue ---------- */
  const demos = [
    {
      id: "zt", chip: "zT curves", group: "te",
      cmd: `python main.py plot-te ${TE} --zt --legend --ylim 0 1.2 --xlim 280 600 --no-show`,
      log: [["", "TE selection: thermoelectric_property"], ["ok", "total 5 samples, now plotting"], ["done", "saved outputs/figures/inter-batch/thermoelectric_property/zt.svg"]],
      figs: [{ src: "te-zt.svg", title: "zT versus temperature", kicker: "plot-te", alt: "zT versus temperature for five demo samples" }],
    },
    {
      id: "seebeck", chip: "Seebeck", group: "te",
      cmd: `python main.py plot-te ${TE} --seebeck --legend --ylim -400 400 --xlim 280 600 --no-show`,
      log: [["", "TE selection: thermoelectric_property"], ["ok", "total 5 samples, now plotting"], ["done", "saved outputs/figures/inter-batch/thermoelectric_property/seebeck.svg"]],
      figs: [{ src: "te-seebeck.svg", title: "Seebeck coefficient, p- and n-type", kicker: "plot-te", alt: "Seebeck coefficient versus temperature, positive and negative curves" }],
    },
    {
      id: "sigma", chip: "Conductivity", group: "te",
      cmd: `python main.py plot-te ${TE} --sigma --ylim 0 1600 --xlim 280 600 --no-show`,
      log: [["", "TE selection: thermoelectric_property"], ["ok", "total 5 samples, now plotting"], ["done", "saved outputs/figures/inter-batch/thermoelectric_property/conductivity.svg"]],
      figs: [{ src: "te-conductivity.svg", title: "Electrical conductivity", kicker: "plot-te", alt: "Electrical conductivity versus temperature for five demo samples" }],
    },
    {
      id: "xrd", chip: "XRD, two PDF cards", group: "xrd",
      cmd: 'python main.py plot-xrd data/demo/xrd --pdf-card "data/pdf_card/CuInTe2 PDF#97-023-8958.txt" --pdf-card "data/pdf_card/Sb2Te3 PDF#97-067-0037.txt" --no-show',
      log: [["", "Bottom PDF standard: CuInTe2 PDF#97-023-8958"], ["", "Top PDF standard: Sb2Te3 PDF#97-067-0037"], ["", "Output group: xrd_5patterns · Layout: stack"], ["done", "saved normalized: xrd_5patterns/xrd.svg"]],
      figs: [{ src: "xrd-two-card.svg", title: "Stacked XRD between two reference cards", kicker: "plot-xrd", alt: "Five stacked XRD patterns with one PDF card below and one above" }],
    },
    {
      id: "dual", chip: "Dual axis", group: "flex",
      cmd: "python main.py flexible --recipe configs/plot_recipes/dual_axis/composition_vs_carrier_mobility_dual.json data/demo/composition_Hall/nu_muh.csv --x x --y concentration --y mobility --yscale log --right-yscale log --no-show",
      log: [["", "recipe: composition_vs_carrier_mobility_dual"], ["ok", "2 series on left/right log axes"], ["done", "saved data/demo/composition_Hall/figures/concentration-mobility.svg"]],
      figs: [{ src: "flex-dual-axis.svg", title: "Carrier concentration and mobility", kicker: "flexible · dual axis", alt: "Carrier concentration and Hall mobility versus composition on two log axes" }],
    },
    {
      id: "bar", chip: "Grouped bars", group: "flex",
      cmd: "python main.py flexible --recipe configs/plot_recipes/bar/grouped_bar.json \"data/demo/sound velocity/sound vvelocity.csv\" --x x --y vl --y vs --y va --ylim 0 5000 --no-show",
      log: [["", "recipe: grouped_bar"], ["ok", "3 series × 6 materials"], ["done", "saved data/demo/sound velocity/figures/sound-velocity.svg"]],
      figs: [{ src: "flex-grouped-bar.svg", title: "Sound velocity comparison", kicker: "flexible · grouped bar", alt: "Grouped bar chart of longitudinal, shear and average sound velocity" }],
    },
    {
      id: "mass", chip: "SPB effective mass", group: "spb",
      cmd: `python main.py spb effective-mass ${CU2SE}/Cu2Se-series.csv --group-by curve_id --params ${CU2SE}/Cu2Se_params.csv --legend inside --ylim 0 400 --no-show`,
      log: [["ok", "300 K  m*/me = 2.3"], ["ok", "750 K  m*/me = 3.2"], ["", "Summary by group: results/spb_fitting/effective_mass_fit/fit_summary_by_group.csv"], ["done", "Plot: results/spb_fitting/effective_mass_fit/pisarenko_fit.svg"]],
      figs: [{ src: "spb-mass-series.svg", title: "Pisarenko fit at two temperatures", kicker: "spb effective-mass", alt: "Seebeck versus Hall carrier concentration with SPB fits at 300 and 750 K" }],
    },
    {
      id: "perf", chip: "SPB PF + zT", group: "spb",
      cmd: `python main.py spb performance ${CU2SE}/Cu2Se-300K.csv --kL 0.3 --xlim 5e19 5e21 --no-show`,
      log: [["", "Curve: results/spb_fitting/performance_fit/performance_curve.csv"], ["done", "PF plot: results/spb_fitting/performance_fit/pf_fit.svg"], ["done", "ZT plot: results/spb_fitting/performance_fit/zt_fit.svg"]],
      figs: [
        { src: "spb-pf.svg", title: "Power factor versus n<sub>H</sub>", kicker: "spb performance", alt: "SPB power-factor fit versus carrier concentration" },
        { src: "spb-zt.svg", title: "Predicted zT versus n<sub>H</sub>", kicker: "spb performance", alt: "SPB zT prediction versus carrier concentration" },
      ],
    },
    {
      id: "cond", chip: "SPB vs conductivity", group: "spb",
      cmd: "python main.py spb conductivity data/demo/spb_fitting/Cu2SSeTe/900K.csv --T 900 --kL 0.3 --ylim pf 0 15 --no-show",
      log: [["done", "SEEBECK plot: results/spb_fitting/conductivity_fit/conductivity_seebeck_fit.svg"], ["done", "PF plot: results/spb_fitting/conductivity_fit/conductivity_pf_fit.svg"], ["done", "ZT plot: results/spb_fitting/conductivity_fit/conductivity_zt_fit.svg"]],
      figs: [
        { src: "spb-sigma-seebeck.svg", title: "Seebeck versus conductivity", kicker: "spb conductivity", alt: "SPB Seebeck fit against electrical conductivity" },
        { src: "spb-sigma-pf.svg", title: "Power factor versus conductivity", kicker: "spb conductivity", alt: "SPB power-factor fit against electrical conductivity" },
        { src: "spb-sigma-zt.svg", title: "zT versus conductivity", kicker: "spb conductivity", alt: "SPB zT fit against electrical conductivity" },
      ],
    },
  ];

  const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Console ---------- */
  const consoleEl = page.querySelector("[data-ws-console]");
  const term = page.querySelector("[data-ws-term]");
  const history = page.querySelector("[data-ws-history]");
  const typed = page.querySelector("[data-ws-typed]");
  const stage = page.querySelector("[data-ws-stage]");
  const empty = page.querySelector("[data-ws-empty]");
  const chipBox = page.querySelector("[data-ws-chips]");
  const pauseBtn = page.querySelector("[data-ws-pause]");

  // Pixel lab cat under the terminal (assets/lab-cat.js).
  const labCat = window.LabCat ? window.LabCat.mount(page.querySelector(".ws-term")) : { set() {} };

  let runToken = 0;
  let current = -1;
  let autoplay = !reduceMotion;
  let visible = false;
  let running = false;
  let autoTimer = null;

  const chips = demos.map((demo, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ws-chip";
    b.dataset.group = demo.group;
    b.textContent = demo.chip;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => { setAutoplay(false); run(i); });
    chipBox.appendChild(b);
    return b;
  });

  function setAutoplay(on) {
    autoplay = on;
    pauseBtn.textContent = on ? "Pause" : "Auto-play";
    pauseBtn.setAttribute("aria-pressed", String(!on));
    clearTimeout(autoTimer);
    if (on && !running && visible) autoTimer = setTimeout(() => run((current + 1) % demos.length), 900);
  }
  pauseBtn.addEventListener("click", () => setAutoplay(!autoplay));

  function addLine(html, cls = "") {
    const line = document.createElement("div");
    line.className = `ws-term-line ${cls}`.trim();
    line.innerHTML = html;
    history.appendChild(line);
    // Keep the scrollback short: the last two runs.
    const runs = history.querySelectorAll(".ws-term-cmd");
    if (runs.length > 2) {
      while (history.firstChild && history.firstChild !== runs[runs.length - 2]) history.removeChild(history.firstChild);
    }
    term.scrollTop = term.scrollHeight;
    return line;
  }

  function colorCommand(cmd) {
    return escapeHtml(cmd)
      .replace(/^python main\.py (\S+)( (?:effective-mass|performance|conductivity))?/, (m, c, sub) =>
        `<span class="ws-t-bin">python main.py</span> <span class="ws-t-sub">${c}${sub || ""}</span>`)
      .replace(/(\s)(--?[a-z][\w-]*)/g, '$1<span class="ws-t-flag">$2</span>');
  }

  function buildSet(demo) {
    const set = document.createElement("div");
    set.className = `ws-fig-set is-${demo.figs.length}`;
    demo.figs.forEach((f) => {
      const fig = document.createElement("figure");
      fig.className = "ws-fig";
      fig.innerHTML = `<img src="${FIG}${f.src}" alt="${f.alt}" width="640" height="480" /><figcaption><span>${f.kicker}</span>${f.title}</figcaption>`;
      set.appendChild(fig);
    });
    return set;
  }

  async function swapFigures(demo, token) {
    const old = stage.querySelector(".ws-fig-set");
    const set = buildSet(demo);
    // Wait for images so they float out fully drawn.
    await Promise.all(Array.from(set.querySelectorAll("img")).map((img) => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
    if (token !== runToken) return;
    if (old) {
      if (reduceMotion) old.remove();
      else old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-18px) scale(0.97)" }], { duration: 260, easing: "ease-in", fill: "forwards" }).finished.then(() => old.remove());
    }
    empty.hidden = true;
    stage.classList.remove("is-busy");
    stage.appendChild(set);
    if (reduceMotion) return;
    Array.from(set.children).forEach((fig, i) => {
      fig.animate([
        { opacity: 0, transform: "translate(-34%, 14%) scale(0.55) rotate(-4deg)", filter: "blur(6px)" },
        { opacity: 1, transform: "translate(2%, -2%) scale(1.02) rotate(0.6deg)", filter: "blur(0)", offset: 0.72 },
        { opacity: 1, transform: "none", filter: "blur(0)" },
      ], { duration: 1000, delay: 160 + i * 240, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    });
  }

  async function run(index) {
    const token = ++runToken;
    clearTimeout(autoTimer);
    running = true;
    current = index;
    const demo = demos[index];
    chips.forEach((c, i) => { c.classList.toggle("is-active", i === index); c.setAttribute("aria-pressed", String(i === index)); });

    typed.textContent = "";
    consoleEl.classList.add("is-typing");
    labCat.set("coding", demo.chip);
    if (reduceMotion) {
      typed.textContent = demo.cmd;
    } else {
      for (let i = 0; i < demo.cmd.length; i++) {
        if (token !== runToken) return;
        typed.textContent = demo.cmd.slice(0, i + 1);
        const ch = demo.cmd[i];
        await sleep(ch === " " ? 64 : 20 + Math.random() * 26);
        term.scrollTop = term.scrollHeight;
      }
      await sleep(520);
    }
    if (token !== runToken) return;
    consoleEl.classList.remove("is-typing");
    addLine(`<span class="ws-ps" aria-hidden="true">$</span>${colorCommand(demo.cmd)}`, "ws-term-cmd");
    typed.textContent = "";
    stage.classList.add("is-busy");
    labCat.set("synth", demo.chip);

    for (const [kind, text] of demo.log) {
      if (!reduceMotion) await sleep(kind === "done" ? 460 : 320);
      if (token !== runToken) return;
      const mark = kind === "ok" ? '<span class="ws-t-ok">✓</span> ' : kind === "done" ? '<span class="ws-t-done">→</span> ' : "  ";
      addLine(mark + escapeHtml(text), "ws-term-out");
    }
    await swapFigures(demo, token);
    if (token !== runToken) return;
    labCat.set("done", demo.chip);
    running = false;
    if (autoplay && visible) autoTimer = setTimeout(() => run((current + 1) % demos.length), 7000);
  }

  // Play only while the console is on screen (and the Workspace view is open).
  const consoleObserver = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && current === -1) run(0);
    else if (visible && autoplay && !running) { clearTimeout(autoTimer); autoTimer = setTimeout(() => run((current + 1) % demos.length), 1600); }
    else if (!visible) clearTimeout(autoTimer);
  }, { threshold: 0.35 });
  consoleObserver.observe(consoleEl);
  if (reduceMotion) setAutoplay(false);

  /* ---------- Syntax highlighting (tiny, purpose-built) ---------- */
  const RULES = {
    py: /(#.*$)|(r?"(?:[^"\\]|\\.)*")|\b(def|for|in|if|not|or|and|continue|return|import|from|None|True|False)\b|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/gm,
    json: /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:e-?\d+)?)/g,
  };

  function highlightLine(line, lang) {
    if (lang === "md") {
      if (/^#{1,6}\s/.test(line)) return `<span class="tk-h">${escapeHtml(line)}</span>`;
      if (/^<!--/.test(line)) return `<span class="tk-c">${escapeHtml(line)}</span>`;
      return escapeHtml(line)
        .replace(/`([^`]+)`/g, '<span class="tk-s">`$1`</span>')
        .replace(/\|/g, '<span class="tk-p">|</span>')
        .replace(/^(- )(Raw|Processed):/, '$1<span class="tk-k">$2</span>:');
    }
    const re = RULES[lang];
    let out = "";
    let last = 0;
    line.replace(re, (m, ...g) => {
      const at = g[g.length - 2];
      out += escapeHtml(line.slice(last, at));
      last = at + m.length;
      if (lang === "py") {
        const [c, s, k, n, f] = g;
        if (c) out += `<span class="tk-c">${escapeHtml(c)}</span>`;
        else if (s) out += `<span class="tk-s">${escapeHtml(s)}</span>`;
        else if (k) out += `<span class="tk-k">${k}</span>`;
        else if (n) out += `<span class="tk-n">${n}</span>`;
        else if (f) out += `<span class="tk-f">${f}</span>`;
      } else {
        const [key, colon, s, lit, n] = g;
        if (key) out += `<span class="tk-key">${escapeHtml(key)}</span>${colon}`;
        else if (s) out += `<span class="tk-s">${escapeHtml(s)}</span>`;
        else if (lit) out += `<span class="tk-k">${lit}</span>`;
        else if (n) out += `<span class="tk-n">${n}</span>`;
      }
      return m;
    });
    return out + escapeHtml(line.slice(last));
  }

  function parseRanges(spec) {
    const set = new Set();
    (spec || "").split(",").filter(Boolean).forEach((part) => {
      const [a, b] = part.split("-").map(Number);
      for (let n = a; n <= (b || a); n++) set.add(n);
    });
    return set;
  }

  const codes = Array.from(page.querySelectorAll(".ws-code"));
  codes.forEach((pre) => {
    const code = pre.querySelector("code");
    const hl = parseRanges(pre.dataset.hl);
    const lines = code.textContent.split("\n");
    code.innerHTML = lines.map((l, i) =>
      `<span class="ws-ln${hl.has(i + 1) ? " is-hl" : ""}" style="--i:${i}">${highlightLine(l, pre.dataset.lang) || " "}</span>`).join("");
  });

  /* ---------- Database walkthrough ---------- */
  const notes = [
    "Excerpt, trimmed for width. Excel lock files (~$…) are skipped.",
    "Excerpt. Missing batches are created the same way and marked “fill manually”.",
    "Illustrative record. The Raw/Processed lines are read-only; the importer ignores them.",
    "The same record after import. The round trip is covered by tests/test_lab_markdown_roundtrip.py.",
    "Excerpt. The map holds 20 header spellings; derived columns use the SPB helpers.",
    "Real record from a literature workbook of 31 GeSe-based samples.",
    "Real values from the same sample, rounded for display.",
  ];
  const steps = Array.from(page.querySelectorAll(".ws-db-step"));
  const tabBox = page.querySelector("[data-ws-tabs]");
  const note = page.querySelector("[data-ws-note]");
  let activeStep = -1;

  const tabs = codes.map((pre, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ws-code-tab";
    b.setAttribute("role", "tab");
    b.id = `ws-code-tab-${i}`;
    pre.setAttribute("role", "tabpanel");
    pre.setAttribute("aria-labelledby", b.id);
    pre.tabIndex = 0;
    const file = pre.dataset.file;
    b.innerHTML = `<span>${String(i + 1).padStart(2, "0")}</span>${file.split("/").pop()}`;
    b.title = file;
    b.addEventListener("click", () => setStep(i, { fromTab: true }));
    tabBox.appendChild(b);
    return b;
  });

  function setStep(i, opts = {}) {
    if (i === activeStep) return;
    activeStep = i;
    steps.forEach((s, n) => s.classList.toggle("is-active", n === i));
    tabs.forEach((t, n) => { t.classList.toggle("is-active", n === i); t.setAttribute("aria-selected", String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    codes.forEach((c, n) => { c.classList.toggle("is-active", n === i); c.hidden = n !== i; });
    note.innerHTML = `<code>${codes[i].dataset.file}</code> · ${escapeHtml(notes[i] || "")}`;
    if (opts.fromTab) tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    else tabs[i].parentElement.scrollTo({ left: tabs[i].offsetLeft - 24, behavior: reduceMotion ? "auto" : "smooth" });
  }
  steps.forEach((s, i) => s.addEventListener("click", () => setStep(i)));
  tabBox.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (activeStep + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setStep(n, { fromTab: true });
    tabs[n].focus();
  });
  setStep(0);

  // On wide screens the code panel is sticky and follows the step in the middle of the viewport.
  const wide = window.matchMedia("(min-width: 981px)");
  const stepObserver = new IntersectionObserver((entries) => {
    if (!wide.matches) return;
    entries.forEach((e) => { if (e.isIntersecting) setStep(steps.indexOf(e.target)); });
  }, { rootMargin: "-42% 0px -52% 0px" });
  steps.forEach((s) => stepObserver.observe(s));

  /* ---------- Gallery ---------- */
  const gallery = page.querySelector("[data-ws-gallery]");
  const galleryCards = [];
  demos.forEach((demo, di) => {
    demo.figs.forEach((f) => {
      const card = document.createElement("figure");
      card.className = "ws-gcard";
      card.dataset.group = demo.group;
      card.innerHTML = `
        <div class="ws-gcard-img"><img src="${FIG}${f.src}" alt="${f.alt}" loading="lazy" width="640" height="480" /></div>
        <figcaption>
          <span class="ws-gcard-kicker">${f.kicker}</span>
          <h4>${f.title}</h4>
          <code class="ws-gcard-cmd">${colorCommand(demo.cmd)}</code>
          <button type="button" class="ws-gcard-run">Run in console <span aria-hidden="true">↑</span></button>
        </figcaption>`;
      card.querySelector(".ws-gcard-run").addEventListener("click", () => {
        setAutoplay(false);
        consoleEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        run(di);
      });
      gallery.appendChild(card);
      galleryCards.push(card);
    });
  });

  const filterBtns = Array.from(page.querySelectorAll("[data-ws-filter] button"));
  filterBtns.forEach((btn) => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
    galleryCards.forEach((c) => { c.hidden = f !== "all" && c.dataset.group !== f; });
  }));

  /* ---------- Scroll reveals ---------- */
  const revealTargets = page.querySelectorAll(".ws-section-head, .ws-db-map, .ws-pipe-track, .ws-eng-card, .ws-eng-figure, .ws-gcard");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => { el.classList.add("ws-reveal"); revealObserver.observe(el); });
  }
})();
