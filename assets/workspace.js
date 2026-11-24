/* Agent Workspace page: live console (command mode and agent mode), materials-database
 * walkthrough, command pipeline, agent roles and figure gallery. Every figure was rendered
 * by the current TEDEX code from public demo data (assets/workspace/live/). Log lines are
 * trimmed from the real command output. Agent transcripts follow the role definitions in
 * TEDEX's .claude/agents/ and the `python main.py --json` output contract. */
(() => {
  "use strict";
  const page = document.getElementById("agent-workspace");
  if (!page) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FIG = "assets/workspace/live/";
  const TE = "data/demo/thermoelectric_property/{1,2,3,4,5}.csv";
  const CU2SE = "data/demo/spb_fitting/Cu2Se";

  /* ---------- Command catalogue ---------- */
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
  const byId = (id) => demos.find((d) => d.id === id);
  const asJson = (id) => byId(id).cmd.replace(/^python main\.py /, "python main.py --json ");

  /* ---------- Agent catalogue ----------
   * Roles mirror TEDEX's .claude/agents/: te-analyst is the only writer of data/lab/ and
   * processed data, te-plotter makes figures, te-assessor judges results. Every role runs
   * `python main.py --json <command>` and reads the files it wrote from the JSON `outputs`. */
  const ROLES = {
    lead: { name: "lead", idle: "routes requests by role", writes: "Claude Code session" },
    analyst: { name: "te-analyst", idle: "analyze · spb · sync", writes: "data/lab/ · processed" },
    plotter: { name: "te-plotter", idle: "plot-te · plot-xrd · flexible", writes: "figures" },
    assessor: { name: "te-assessor", idle: "assess · bayes · agent", writes: "results/" },
  };
  const STATE_LABEL = {
    idle: "idle", listening: "reading", delegating: "delegating", assigned: "assigned",
    running: "running", asking: "needs you", handoff: "handed back", done: "done",
  };
  const TE_OUT = "outputs/figures/inter-batch/thermoelectric_property/";
  const SPB_OUT = "results/spb_fitting/effective_mass_fit/";
  const TS = "20261123_101502";
  const ASSESS = `results/assessments/assessment_DEMO-01_DEMO-02_${TS}`;
  const BAYES = `results/bayesian_predictions/bayesian_prediction_lab_ZT_max_${TS}`;

  // Placeholder batch, consistent with the DEMO-01-B record in the database section.
  const META = {
    batch: "DEMO-01",
    cols: [
      { key: "sample_composition", src: "workbook" },
      { key: "cp_value", src: "workbook" },
      { key: "density", src: "your values" },
      { key: "sample_name", src: "confirmed" },
    ],
    rows: [
      { id: "A", sample_composition: "Cu2Se0.98S0.02", cp_value: "0.40", density: "6.75", sample_name: "S_alloy_0.02" },
      { id: "B", sample_composition: "Cu2Se0.96S0.04", cp_value: "0.39", density: "6.71", sample_name: "S_alloy_0.04" },
      { id: "C", sample_composition: "Cu2Se0.94S0.06", cp_value: "0.39", density: "6.66", sample_name: "S_alloy_0.06" },
    ],
  };

  const agentDemos = [
    {
      id: "a-plot", chip: "Plot the TE summary", roles: ["plotter"], done: "Figures ready",
      prompt: "Plot zT, Seebeck and conductivity for the five demo samples, 280 to 600 K.",
      steps: [
        { t: "lead", text: "Figures from processed data → te-plotter", assign: ["plotter"] },
        { t: "cmd", role: "plotter", cmd: asJson("zt") },
        { t: "json", role: "plotter", outputs: [["figure", `${TE_OUT}zt.svg`]] },
        { t: "cmd", role: "plotter", cmd: asJson("seebeck") },
        { t: "json", role: "plotter", outputs: [["figure", `${TE_OUT}seebeck.svg`]] },
        { t: "cmd", role: "plotter", cmd: asJson("sigma") },
        { t: "json", role: "plotter", outputs: [["figure", `${TE_OUT}conductivity.svg`]] },
        { t: "report", role: "plotter", text: "3 runs, all exit 0 · 3 figures · nothing for you to decide" },
        { t: "lead", final: true, text: "Done: one figure per property, same five samples and axes." },
      ],
      figs: [...byId("zt").figs, ...byId("seebeck").figs, ...byId("sigma").figs],
    },
    {
      id: "a-parallel", chip: "SPB fit + XRD, in parallel", roles: ["analyst", "plotter"], done: "Figures ready",
      prompt: "Fit the Cu2Se effective mass at 300 K and 750 K, and draw the XRD stack between both PDF cards.",
      steps: [
        { t: "lead", text: "Two independent jobs, run in parallel: SPB fit → te-analyst · XRD figure → te-plotter", assign: ["analyst", "plotter"] },
        { t: "cmd", role: "analyst", cmd: asJson("mass") },
        { t: "cmd", role: "plotter", cmd: asJson("xrd") },
        { t: "log", role: "plotter", text: "Bottom PDF standard: CuInTe2 PDF#97-023-8958" },
        { t: "log", role: "analyst", mark: "ok", text: "300 K  m*/me = 2.3" },
        { t: "log", role: "plotter", text: "Top PDF standard: Sb2Te3 PDF#97-067-0037" },
        { t: "log", role: "analyst", mark: "ok", text: "750 K  m*/me = 3.2" },
        { t: "json", role: "plotter", outputs: [["figure", "data/demo/xrd/figures/xrd_5patterns/xrd.svg"]] },
        { t: "report", role: "plotter", text: "exit 0 · 1 figure" },
        { t: "json", role: "analyst", outputs: [["table", `${SPB_OUT}fit_summary_by_group.csv`], ["figure", `${SPB_OUT}pisarenko_fit.svg`]] },
        { t: "report", role: "analyst", text: "exit 0 · m*/me = 2.3 at 300 K, 3.2 at 750 K" },
        { t: "lead", final: true, text: "Both finished. The fitted m*/me rises from 2.3 at 300 K to 3.2 at 750 K." },
      ],
      figs: [...byId("mass").figs, ...byId("xrd").figs],
    },
    {
      id: "a-meta", chip: "Fill lab metadata, then process", roles: ["analyst"], done: "Metadata filled", live: "meta",
      prompt: "DEMO-01 is in data/raw. Cp and compositions are in the lab workbook; densities in order: 6.75, 6.71, 6.66. Then process it.",
      steps: [
        { t: "lead", text: "Lab metadata and processing → te-analyst, the only writer of data/lab/", assign: ["analyst"] },
        { t: "cmd", role: "analyst", cmd: "python main.py --json sync metadata", lock: true },
        { t: "log", role: "analyst", text: "DEMO-01: 3 samples (A, B, C) · ZEM + LFA found" },
        { t: "json", role: "analyst", outputs: [["json", "data/lab/samples.json"], ["json", "data/lab/batches.json"]], unlock: true },
        { t: "cmd", role: "analyst", cmd: "python main.py --json sync workbook DEMO-01 --dry-run" },
        { t: "log", role: "analyst", text: "A  Cu2Se0.98S0.02  cp 0.40 J/g/K  Dulong-Petit ok" },
        { t: "log", role: "analyst", text: "B  Cu2Se0.96S0.04  cp 0.39 J/g/K  Dulong-Petit ok" },
        { t: "log", role: "analyst", text: "C  Cu2Se0.94S0.06  cp 0.39 J/g/K  Dulong-Petit ok" },
        { t: "json", role: "analyst", outputs: [], note: "dry run, nothing written" },
        { t: "cmd", role: "analyst", cmd: "python main.py --json sync workbook DEMO-01", lock: true },
        { t: "json", role: "analyst", outputs: [["json", "data/lab/samples.json"], ["markdown", "data/lab/lab_metadata.md"]], unlock: true, fill: ["sample_composition", "cp_value"] },
        { t: "cmd", role: "analyst", cmd: "python main.py --json sync fill DEMO-01 density 6.75 6.71 6.66", lock: true },
        { t: "log", role: "analyst", text: "A → 6.75 · B → 6.71 · C → 6.66 (sample order)" },
        { t: "json", role: "analyst", outputs: [["json", "data/lab/samples.json"], ["markdown", "data/lab/lab_metadata.md"]], unlock: true, fill: ["density"] },
        {
          t: "ask", role: "analyst",
          text: "Legend labels are a judgment call. From the compositions I'd write S_alloy_0.02, S_alloy_0.04, S_alloy_0.06, with optimization_type alloy and S on the Se site. Write them?",
          yes: "Write them", no: "I'll edit the ledger",
          yesSay: "Yes, write them.", noSay: "Leave the labels to me.",
          noSteps: [
            { t: "report", role: "analyst", text: "Labels left blank in data/lab/lab_metadata.md. After editing, run sync markdown import, then analyze DEMO-01." },
            { t: "lead", final: true, text: "Paused for your labels. Cp, composition and density are filled." },
          ],
          noDone: "Waiting for your labels",
        },
        { t: "cmd", role: "analyst", cmd: "python main.py --json sync fill DEMO-01 sample_name S_alloy_0.02 S_alloy_0.04 S_alloy_0.06", lock: true },
        { t: "json", role: "analyst", outputs: [["json", "data/lab/samples.json"], ["markdown", "data/lab/lab_metadata.md"]], unlock: true, fill: ["sample_name"] },
        { t: "log", role: "analyst", text: "optimization_type and modifier_* written the same way" },
        { t: "cmd", role: "analyst", cmd: "python main.py --json analyze DEMO-01", lock: true },
        { t: "log", role: "analyst", text: "metadata synced · lock released while processing", unlock: true },
        { t: "log", role: "analyst", mark: "ok", text: "3 samples processed · features extracted" },
        { t: "json", role: "analyst", count: 7, outputs: [["table", "data/processed/DEMO-01-processed/DEMO-01-{A,B,C}.csv"], ["json", "data/processed/DEMO-01-processed/extracted_features.json"], ["figure", "TE summary figures (3)"]] },
        { t: "report", role: "analyst", text: "8 runs, all exit 0 · DEMO-01 ready to plot or assess" },
        { t: "lead", final: true, text: "DEMO-01 is filled and processed." },
      ],
    },
    {
      id: "a-assess", chip: "Compare batches, suggest next", roles: ["assessor", "analyst"], done: "Report ready", result: "report",
      prompt: "How does DEMO-01 compare with DEMO-02? Suggest the next composition.",
      steps: [
        { t: "lead", text: "Judging results → te-assessor", assign: ["assessor"] },
        { t: "log", role: "assessor", text: "DEMO-02 has no extracted_features.json" },
        { t: "report", role: "assessor", handoff: true, text: "DEMO-02 needs analyze first. That is te-analyst's job, so I'm handing it back." },
        { t: "lead", text: "Handoff: analyze DEMO-02 → te-analyst", assign: ["analyst"] },
        { t: "cmd", role: "analyst", cmd: "python main.py --json analyze DEMO-02", lock: true },
        { t: "log", role: "analyst", text: "metadata synced · lock released while processing", unlock: true },
        { t: "log", role: "analyst", mark: "ok", text: "3 samples processed · features extracted" },
        { t: "json", role: "analyst", count: 4, outputs: [["table", "data/processed/DEMO-02-processed/DEMO-02-{A,B,C}.csv"], ["json", "data/processed/DEMO-02-processed/extracted_features.json"]] },
        { t: "report", role: "analyst", text: "exit 0 · DEMO-02 ready" },
        { t: "cmd", role: "assessor", cmd: "python main.py --json assess DEMO-01 DEMO-02" },
        { t: "json", role: "assessor", outputs: [["json", `${ASSESS}.json`], ["markdown", `${ASSESS}.md`], ["markdown", `${ASSESS}.prompt.md`]] },
        { t: "cmd", role: "assessor", cmd: "python main.py --json bayes --source lab --target ZT_max" },
        { t: "json", role: "assessor", outputs: [["table", BAYES.replace("prediction_", "candidates_") + ".csv"], ["json", `${BAYES}.json`], ["markdown", `${BAYES}.md`]] },
        { t: "skip", role: "assessor", text: "agent not run: it sends features to an external, paid LLM API, and this request didn't ask for one" },
        { t: "report", role: "assessor", text: "Tool numbers kept apart from my reading; every claim carries an evidence label" },
        { t: "lead", final: true, text: "Report ready. Suggested next: Cu2Se0.95S0.05, with κ and n_H measurements to confirm it." },
      ],
    },
  ];

  const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Console ---------- */
  const consoleEl = page.querySelector("[data-ws-console]");
  const term = page.querySelector("[data-ws-term]");
  const history = page.querySelector("[data-ws-history]");
  const typed = page.querySelector("[data-ws-typed]");
  const inputPs = page.querySelector(".ws-term-input .ws-ps");
  const termTitle = page.querySelector("[data-ws-term-title]");
  const stage = page.querySelector("[data-ws-stage]");
  const empty = page.querySelector("[data-ws-empty]");
  const chipBox = page.querySelector("[data-ws-chips]");
  const pauseBtn = page.querySelector("[data-ws-pause]");
  const board = page.querySelector("[data-ws-board]");
  const modeBtns = Array.from(page.querySelectorAll("[data-ws-mode] button"));
  const modeDesc = page.querySelector("[data-ws-mode-desc]");
  const agentNote = page.querySelector("[data-ws-agent-note]");

  // Pixel lab cat under the terminal (assets/lab-cat.js).
  const labCat = window.LabCat ? window.LabCat.mount(page.querySelector(".ws-term")) : { set() {} };

  const MODES = {
    cli: {
      desc: "Pick a command. The console types it, the tool logs, and the figure lands.",
      title: "te-analysis-workspace", ps: "$", empty: "Figures land here.", chips: "Choose a command to run",
    },
    agent: {
      desc: 'Ask in plain language. A lead agent routes the work to three role agents, which run the same commands with <code>--json</code>. <a href="#agent-workspace" data-ws-jump="ws-agents">How it works</a>',
      title: "claude · te-analysis-workspace", ps: "›", empty: "Files the agents write land here.", chips: "Choose a request for the agents",
    },
  };

  let mode = "cli";
  let runToken = 0;
  let current = -1;
  let autoplay = !reduceMotion;
  let visible = false;
  let running = false;
  let autoTimer = null;
  let chips = [];
  let pendingAsk = null;
  const catalogue = () => (mode === "agent" ? agentDemos : demos);

  function buildChips() {
    chipBox.innerHTML = "";
    chipBox.setAttribute("aria-label", MODES[mode].chips);
    chips = catalogue().map((demo, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ws-chip";
      if (mode === "agent") {
        b.classList.add("ws-chip-agent");
        b.innerHTML = `<span class="ws-chip-dots" aria-hidden="true">${demo.roles.map((r) => `<i data-role="${r}"></i>`).join("")}</span>${escapeHtml(demo.chip)}`;
      } else {
        b.dataset.group = demo.group;
        b.textContent = demo.chip;
      }
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => { setAutoplay(false); run(i); });
      chipBox.appendChild(b);
      return b;
    });
  }

  function setAutoplay(on) {
    autoplay = on;
    pauseBtn.textContent = on ? "Pause" : "Auto-play";
    pauseBtn.setAttribute("aria-pressed", String(!on));
    clearTimeout(autoTimer);
    if (pendingAsk) pendingAsk.arm(on);
    if (on && !running && visible) autoTimer = setTimeout(next, 900);
  }
  pauseBtn.addEventListener("click", () => setAutoplay(!autoplay));
  const next = () => run((current + 1) % catalogue().length);

  function addLine(html, cls = "", role = "") {
    const line = document.createElement("div");
    line.className = `ws-term-line ${cls}`.trim();
    if (role) line.dataset.role = role;
    line.innerHTML = html;
    history.appendChild(line);
    // Keep the scrollback short: the last two command runs, or the current agent request.
    const runs = history.querySelectorAll(".ws-term-cmd");
    const keep = mode === "agent" ? 1 : 2;
    if (runs.length > keep) {
      while (history.firstChild && history.firstChild !== runs[runs.length - keep]) history.removeChild(history.firstChild);
    }
    term.scrollTop = term.scrollHeight;
    return line;
  }

  function colorCommand(cmd) {
    return escapeHtml(cmd)
      .replace(/^python main\.py( --json)? (\S+)( (?:effective-mass|performance|conductivity|metadata|markdown|workbook|fill))?/, (m, json, c, sub) =>
        `<span class="ws-t-bin">python main.py</span>${json ? ' <span class="ws-t-flag">--json</span>' : ""} <span class="ws-t-sub">${c}${sub || ""}</span>`)
      .replace(/(\s)(--?[a-z][\w-]*)/g, '$1<span class="ws-t-flag">$2</span>');
  }

  function buildSet(figs) {
    const set = document.createElement("div");
    set.className = `ws-fig-set is-${figs.length}`;
    figs.forEach((f) => {
      const fig = document.createElement("figure");
      fig.className = "ws-fig";
      fig.innerHTML = `<img src="${FIG}${f.src}" alt="${f.alt}" width="640" height="480" /><figcaption><span>${f.kicker}</span>${f.title}</figcaption>`;
      set.appendChild(fig);
    });
    return set;
  }

  async function swapStage(set, token) {
    const old = stage.querySelector(".ws-fig-set");
    // Wait for images so they float out fully drawn.
    await Promise.all(Array.from(set.querySelectorAll("img")).map((img) => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
    if (token !== runToken) return;
    if (old) {
      if (reduceMotion) old.remove();
      else old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-18px) scale(0.97)" }], { duration: 260, easing: "ease-in", fill: "forwards" }).finished.then(() => old.remove());
    }
    empty.hidden = true;
    stage.classList.remove("is-busy", "is-stale");
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

  function clearStage() {
    stage.querySelectorAll(".ws-fig-set").forEach((s) => s.remove());
    stage.classList.remove("is-busy", "is-stale");
    empty.textContent = MODES[mode].empty;
    empty.hidden = false;
  }

  async function typeInto(text, token, fast) {
    if (reduceMotion) { typed.textContent = text; return; }
    for (let i = 0; i < text.length; i++) {
      if (token !== runToken) return;
      typed.textContent = text.slice(0, i + 1);
      const ch = text[i];
      await sleep(fast ? (ch === " " ? 40 : 14 + Math.random() * 18) : (ch === " " ? 64 : 20 + Math.random() * 26));
      term.scrollTop = term.scrollHeight;
    }
    await sleep(fast ? 380 : 520);
  }

  async function runCli(index, token) {
    const demo = demos[index];
    typed.textContent = "";
    consoleEl.classList.add("is-typing");
    labCat.set("coding", demo.chip);
    await typeInto(demo.cmd, token, false);
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
    await swapStage(buildSet(demo.figs), token);
    if (token !== runToken) return;
    labCat.set("done", demo.chip);
  }

  /* ---------- Agent board ---------- */
  const LOCK_SVG = '<svg class="ws-lock" viewBox="0 0 12 14" aria-hidden="true" focusable="false"><path d="M3.5 6V4.2a2.5 2.5 0 0 1 5 0V6" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="1.5" y="6" width="9" height="7" rx="1.5" fill="currentColor"/></svg>';
  const cards = {};
  Object.entries(ROLES).forEach(([key, r]) => {
    const card = document.createElement("article");
    card.className = "ws-role";
    card.dataset.role = key;
    card.innerHTML = `
      <header><span class="ws-role-dot" aria-hidden="true"></span><b>${r.name}</b><span class="ws-role-state"></span></header>
      <p class="ws-role-now"></p>
      <footer><span class="ws-role-writes">${key === "analyst" ? LOCK_SVG : ""}<span>${r.writes}</span></span><span class="ws-role-files"></span></footer>`;
    board.appendChild(card);
    cards[key] = {
      card,
      state: card.querySelector(".ws-role-state"),
      now: card.querySelector(".ws-role-now"),
      writes: card.querySelector(".ws-role-writes > span"),
      files: card.querySelector(".ws-role-files"),
      count: 0,
    };
  });

  function setRole(key, state, now) {
    const c = cards[key];
    c.card.dataset.state = state;
    c.state.textContent = STATE_LABEL[state];
    if (now !== undefined) { c.now.textContent = now; c.now.title = now; }
  }
  function addFiles(key, n) {
    const c = cards[key];
    c.count += n;
    if (key !== "lead") c.files.textContent = `${c.count} file${c.count === 1 ? "" : "s"}`;
    if (n && !reduceMotion) c.files.animate([{ transform: "scale(1.25)" }, { transform: "none" }], { duration: 320, easing: "ease-out" });
  }
  function setLock(held) {
    cards.analyst.card.classList.toggle("is-locked", held);
    cards.analyst.writes.textContent = held ? "holds the data/lab/ lock" : ROLES.analyst.writes;
  }
  function resetBoard() {
    Object.entries(cards).forEach(([key, c]) => {
      c.count = 0;
      c.files.textContent = key === "lead" ? "writes nothing" : "0 files";
      setRole(key, "idle", ROLES[key].idle);
    });
    setLock(false);
  }
  resetBoard();

  /* ---------- Agent runs ---------- */
  const roleTag = (key) => `<span class="ws-a-tag" data-role="${key}">${ROLES[key].name}</span>`;
  const STEP_DELAY = { lead: 760, cmd: 560, log: 380, json: 520, report: 560, skip: 620, ask: 620 };

  function buildMeta() {
    const set = document.createElement("div");
    set.className = "ws-fig-set is-1";
    const head = META.cols.map((c) => `<th scope="col">${c.key}<small>${c.src}</small></th>`).join("");
    const rows = META.rows.map((row) =>
      `<tr><th scope="row">${row.id}</th>${META.cols.map((c) => `<td data-key="${c.key}" data-value="${row[c.key]}">—</td>`).join("")}</tr>`).join("");
    set.innerHTML = `<figure class="ws-fig ws-artifact ws-meta">
      <div class="ws-artifact-head"><span>data/lab/lab_metadata.md · ${META.batch}</span><em>placeholder batch</em></div>
      <div class="ws-meta-scroll"><table><thead><tr><th scope="col">id</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
      <figcaption><span>sync workbook · sync fill</span>Each field changes only through a command, never by hand</figcaption>
    </figure>`;
    return set;
  }
  function fillMeta(keys) {
    keys.forEach((key, k) => stage.querySelectorAll(`.ws-meta td[data-key="${key}"]`).forEach((td, i) => {
      setTimeout(() => { td.textContent = td.dataset.value; td.classList.add("is-new"); }, reduceMotion ? 0 : 120 + i * 150 + k * 90);
    }));
  }

  function buildReport() {
    const set = document.createElement("div");
    set.className = "ws-fig-set is-1";
    set.innerHTML = `<figure class="ws-fig ws-artifact ws-report">
      <div class="ws-artifact-head"><span>assessment_DEMO-01_DEMO-02 · excerpt</span><em>illustrative</em></div>
      <h5>Computed by the tools</h5>
      <ul>
        <li><i data-ev="lab">lab_data</i>Highest <i>zT</i><sub>max</sub>: DEMO-01-B, 0.62 at 573 K, of six samples.</li>
        <li><i data-ev="lab">lab_data</i>κ<sub>L</sub> falls with S content in DEMO-01; DEMO-02 shows no clear trend.</li>
        <li><i data-ev="lab">lab_data</i>Bayes ranks Cu<sub>2</sub>Se<sub>0.95</sub>S<sub>0.05</sub> first for <i>zT</i><sub>max</sub>.</li>
      </ul>
      <h5>Interpretation</h5>
      <ul>
        <li><i data-ev="hyp">hypothesis</i>Densities agree within 1.4%, so pressing alone does not explain the σ spread; S on the Se site likely adds point-defect phonon scattering.</li>
      </ul>
      <h5>Next experiment</h5>
      <ul>
        <li><i data-ev="next">to confirm</i>Cu<sub>2</sub>Se<sub>0.95</sub>S<sub>0.05</sub>: measure κ by LFA and n<sub>H</sub> by Hall; drop it if κ<sub>L</sub> is not below DEMO-01-B.</li>
      </ul>
      <p class="ws-report-foot">Limits: six lab samples; the Gaussian-process ranking extrapolates beyond x = 0.06.</p>
    </figure>`;
    return set;
  }

  function ask(step, token) {
    return new Promise((resolve) => {
      const box = addLine(
        `<span class="ws-a-ask-q">${roleTag(step.role)}${escapeHtml(step.text)}</span><span class="ws-a-ask-actions"><button type="button">${escapeHtml(step.yes)}</button><button type="button">${escapeHtml(step.no)}</button></span>`,
        "ws-a-line ws-a-ask", step.role);
      const btns = Array.from(box.querySelectorAll("button"));
      let timer = null;
      let poll = null;
      const finish = (i) => {
        clearTimeout(timer);
        clearInterval(poll);
        pendingAsk = null;
        box.classList.remove("is-auto");
        btns.forEach((b, n) => { b.disabled = true; b.classList.toggle("is-chosen", n === i); });
        resolve(i);
      };
      btns.forEach((b, i) => b.addEventListener("click", () => finish(i)));
      // On auto-play the first answer is chosen after a pause; otherwise it waits for a click.
      pendingAsk = {
        arm(on) {
          clearTimeout(timer);
          box.classList.toggle("is-auto", on);
          if (on) timer = setTimeout(() => finish(0), 4200);
        },
      };
      pendingAsk.arm(autoplay);
      poll = setInterval(() => { if (token !== runToken) finish(-1); }, 150);
    });
  }

  // Plays a list of steps; resolves "ok", "declined" or "aborted".
  async function playSteps(steps, token) {
    for (const step of steps) {
      if (token !== runToken) return "aborted";
      if (!reduceMotion) await sleep(STEP_DELAY[step.t] || 420);
      if (token !== runToken) return "aborted";
      const r = step.role;
      if (step.t === "lead") {
        setRole("lead", step.final ? "done" : "delegating", step.text);
        addLine(`${roleTag("lead")}${escapeHtml(step.text)}`, "ws-a-line ws-a-lead", "lead");
        (step.assign || []).forEach((k) => setRole(k, "assigned", "picked up from the lead"));
      } else if (step.t === "cmd") {
        setRole(r, "running", step.cmd.replace(/^python main\.py --json /, ""));
        if (step.lock) setLock(true);
        addLine(`${roleTag(r)}<span class="ws-ps" aria-hidden="true">$</span>${colorCommand(step.cmd)}`, "ws-a-line ws-a-cmd", r);
        labCat.set("synth", ROLES[r].name, "Agents working");
      } else if (step.t === "log") {
        const mark = step.mark === "ok" ? '<span class="ws-t-ok">✓</span> ' : "  ";
        addLine(mark + escapeHtml(step.text), "ws-a-line ws-a-out", r);
        if (step.unlock) setLock(false);
      } else if (step.t === "json") {
        const n = step.outputs.length;
        const what = n ? `${step.count || n} file${(step.count || n) === 1 ? "" : "s"} in outputs` : step.note;
        addLine(`<span class="ws-t-done">←</span> ok · exit 0 · ${escapeHtml(what)}`, "ws-a-line ws-a-json", r);
        step.outputs.forEach(([kind, path]) => addLine(`<span class="ws-a-kind">${kind}</span><span class="ws-a-path">${escapeHtml(path)}</span>`, "ws-a-line ws-a-file", r));
        addFiles(r, step.count || n);
        if (step.unlock) setLock(false);
        if (step.fill) fillMeta(step.fill);
      } else if (step.t === "ask") {
        setRole(r, "asking", "waiting for your answer");
        labCat.set("idle", "", "Waiting for your answer");
        const answer = await ask(step, token);
        if (answer < 0 || token !== runToken) return "aborted";
        addLine(`<span class="ws-ps" aria-hidden="true">›</span>${escapeHtml(answer === 0 ? step.yesSay : step.noSay)}`, "ws-a-user ws-a-reply");
        if (answer === 1) {
          setRole(r, "running", "writing up what is left for you");
          const result = await playSteps(step.noSteps, token);
          return result === "aborted" ? result : "declined";
        }
        setRole(r, "running", "writing the confirmed labels");
        labCat.set("synth", ROLES[r].name, "Agents working");
      } else if (step.t === "skip") {
        addLine(`<span class="ws-a-skip">⊘</span> ${escapeHtml(step.text)}`, "ws-a-line ws-a-out ws-a-skipline", r);
      } else if (step.t === "report") {
        setRole(r, step.handoff ? "handoff" : "done", step.text);
        addLine(`<span class="ws-t-ok">✓</span> ${escapeHtml(step.text)}`, "ws-a-line ws-a-report", r);
      }
    }
    return "ok";
  }

  async function runAgent(index, token) {
    const demo = agentDemos[index];
    resetBoard();
    if (stage.querySelector(".ws-fig-set")) stage.classList.add("is-stale");
    typed.textContent = "";
    consoleEl.classList.add("is-typing");
    setRole("lead", "listening", "reading your request");
    labCat.set("coding", "", "Reading the request");
    await typeInto(demo.prompt, token, true);
    if (token !== runToken) return;
    consoleEl.classList.remove("is-typing");
    addLine(`<span class="ws-ps" aria-hidden="true">›</span><span class="ws-a-prompt">${escapeHtml(demo.prompt)}</span>`, "ws-term-cmd ws-a-user");
    typed.textContent = "";
    labCat.set("synth", "lead", "Agents working");
    if (demo.live === "meta") {
      await swapStage(buildMeta(), token);
      if (token !== runToken) return;
    }
    stage.classList.add("is-busy");

    const result = await playSteps(demo.steps, token);
    if (result === "aborted" || token !== runToken) return;
    if (demo.figs) await swapStage(buildSet(demo.figs), token);
    else if (demo.result === "report") await swapStage(buildReport(), token);
    else stage.classList.remove("is-busy");
    if (token !== runToken) return;
    const declined = result === "declined";
    labCat.set(declined ? "idle" : "done", "", declined ? demo.steps.find((s) => s.t === "ask").noDone : demo.done);
  }

  async function run(index) {
    const token = ++runToken;
    clearTimeout(autoTimer);
    running = true;
    current = index;
    chips.forEach((c, i) => { c.classList.toggle("is-active", i === index); c.setAttribute("aria-pressed", String(i === index)); });
    if (mode === "agent") await runAgent(index, token);
    else await runCli(index, token);
    if (token !== runToken) return;
    running = false;
    if (autoplay && visible) autoTimer = setTimeout(next, mode === "agent" ? 9000 : 7000);
  }

  function setMode(nextMode) {
    if (nextMode === mode) return;
    mode = nextMode;
    runToken++;
    running = false;
    current = -1;
    clearTimeout(autoTimer);
    consoleEl.dataset.mode = mode;
    modeBtns.forEach((b) => { const on = b.dataset.mode === mode; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    board.hidden = mode !== "agent";
    agentNote.hidden = mode !== "agent";
    modeDesc.innerHTML = MODES[mode].desc;
    termTitle.textContent = MODES[mode].title;
    inputPs.textContent = MODES[mode].ps;
    history.innerHTML = "";
    typed.textContent = "";
    consoleEl.classList.remove("is-typing");
    clearStage();
    resetBoard();
    buildChips();
    labCat.set("idle");
  }

  modeBtns.forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.mode === mode) return;
    setMode(b.dataset.mode);
    run(0);
  }));
  modeDesc.addEventListener("click", (e) => {
    const link = e.target.closest("[data-ws-jump]");
    if (!link) return;
    e.preventDefault();
    document.getElementById(link.dataset.wsJump).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  modeDesc.innerHTML = MODES.cli.desc;
  empty.textContent = MODES.cli.empty;
  buildChips();

  // Play only while the console is on screen (and the Workspace view is open).
  const consoleObserver = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && current === -1) run(0);
    else if (visible && autoplay && !running) { clearTimeout(autoTimer); autoTimer = setTimeout(next, 1600); }
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

  page.querySelectorAll(".ws-code").forEach((pre) => {
    const code = pre.querySelector("code");
    const hl = parseRanges(pre.dataset.hl);
    const lines = code.textContent.split("\n");
    code.innerHTML = lines.map((l, i) =>
      `<span class="ws-ln${hl.has(i + 1) ? " is-hl" : ""}" style="--i:${i}">${highlightLine(l, pre.dataset.lang) || " "}</span>`).join("");
  });

  /* ---------- Database walkthrough ---------- */
  const codes = Array.from(page.querySelectorAll(".ws-db-panel .ws-code"));
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
        setMode("cli");
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
  const revealTargets = page.querySelectorAll(".ws-section-head, .ws-db-map, .ws-pipe-track, .ws-ag-map, .ws-ag-rules li, .ws-ag-panel, .ws-eng-card, .ws-eng-figure, .ws-gcard");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => { el.classList.add("ws-reveal"); revealObserver.observe(el); });
  }
})();
