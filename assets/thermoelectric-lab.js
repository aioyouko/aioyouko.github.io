(() => {
  "use strict";
  const root = document.querySelector(".te-lab");
  const model = window.ThermoelectricModel;
  if (!root || !model) return;
  const $ = (id) => document.getElementById(id);
  const value = (id) => Number($(id).value);
  const put = (id, text) => { $(id).textContent = text; };
  const colors = { teal: "#08796c", copper: "#b06132", blue: "#517d99", gray: "#65716c", pale: "#edf2ee", purple: "#806082" };
  const defaults = { cop: { zt: 1, th: 300, delta: 30 }, power: { current: 3, delta: 30, k: 0.4 }, gen: { zt: 1, tc: 300, delta: 100 } };
  const format = (x, digits = 2) => Number(x).toFixed(digits);
  const percent = (x) => `${format(x * 100, 1)}%`;
  const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function updateLabels(group) {
    Object.keys(defaults[group]).forEach((key) => {
      const id = `tc-${group}-${key}`;
      const input = $(id);
      const digits = key === "current" || key === "k" ? 2 : key === "zt" ? 1 : 0;
      const label = `${format(input.value, digits)}${input.dataset.unit ? ` ${input.dataset.unit}` : ""}`;
      put(`${id}-value`, label);
      input.setAttribute("aria-valuetext", label);
    });
  }

  function niceAxis(low, high) {
    const raw = Math.max(high - low, 0.01) / 5;
    const order = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].find((x) => x * order >= raw) * order;
    return { min: Math.floor(low / step) * step, max: Math.ceil(high / step) * step, step };
  }

  // Small responsive SVG plotter. Paths are evaluated from the same model as the
  // readouts; null values create gaps rather than fictitious zero-performance lines.
  function plot(id, { xMax, xTicks, xLabel, yLabel, yLow = 0, yHigh, series, points = [], guides = [], bands = [], description }) {
    const svg = $(id);
    const width = Math.max(250, Math.round(svg.getBoundingClientRect().width) || 680);
    const height = width > 550 ? 350 : 300;
    const margin = { left: 52, right: 18, top: 28, bottom: 48 };
    const axis = niceAxis(yLow, yHigh);
    const x0 = margin.left, y0 = margin.top;
    const w = width - margin.left - margin.right, h = height - margin.top - margin.bottom;
    const x = (n) => x0 + n / xMax * w;
    const y = (n) => y0 + (axis.max - n) / (axis.max - axis.min) * h;
    const clip = `${id}-clip`;
    let out = `<title>${escape(svg.getAttribute("aria-label"))}</title><desc>${escape(description)}</desc><defs><clipPath id="${clip}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" /></clipPath></defs>`;
    out += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fffefa" />`;
    for (const band of bands) {
      const bx = x(band.x1 ?? 0), by = y(band.y2 ?? axis.max);
      out += `<rect x="${bx}" y="${by}" width="${x(band.x2 ?? xMax) - bx}" height="${y(band.y1 ?? axis.min) - by}" fill="${band.color || '#f1e8de'}" clip-path="url(#${clip})" />`;
    }
    for (let n = axis.min; n <= axis.max + axis.step / 2; n += axis.step) {
      const label = Math.abs(n) < 1e-9 ? "0" : Number(n.toFixed(3)).toString();
      out += `<line x1="${x0}" x2="${x0 + w}" y1="${y(n)}" y2="${y(n)}" stroke="${Math.abs(n) < 1e-9 ? '#b2bcb5' : '#e4e8e1'}"/><text x="${x0 - 10}" y="${y(n) + 4}" text-anchor="end">${label}</text>`;
    }
    for (const n of xTicks) out += `<line x1="${x(n)}" x2="${x(n)}" y1="${y0 + h}" y2="${y0 + h + 5}" stroke="#aab7ae"/><text x="${x(n)}" y="${y0 + h + 21}" text-anchor="middle">${n}</text>`;
    out += `<text x="${x0}" y="14" class="tc-axis-title">${escape(yLabel)}</text><text x="${x0 + w / 2}" y="${height - 5}" text-anchor="middle" class="tc-axis-title">${escape(xLabel)}</text>`;
    for (const guide of guides) {
      out += `<line x1="${x(guide.x)}" x2="${x(guide.x)}" y1="${y0}" y2="${y0 + h}" stroke="${guide.color}" stroke-dasharray="${guide.dash || '4 5'}" stroke-width="1.5" clip-path="url(#${clip})"/>`;
    }
    for (const s of series) {
      let d = "", active = false;
      for (let i = 0; i <= 400; i++) {
        const px = i / 400 * xMax, py = s.fn(px);
        if (py === null || !Number.isFinite(py)) { active = false; continue; }
        d += `${active ? "L" : "M"}${x(px).toFixed(2)},${y(py).toFixed(2)} `;
        active = true;
      }
      out += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.width || 2.8}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""} stroke-linecap="round" stroke-linejoin="round" clip-path="url(#${clip})"/>`;
    }
    for (const p of points) {
      if (p.y === null || !Number.isFinite(p.y)) continue;
      out += `<line x1="${x(p.x)}" x2="${x(p.x)}" y1="${y(p.y)}" y2="${y0 + h}" stroke="${p.color}" stroke-opacity=".4" stroke-dasharray="3 5"/><circle cx="${x(p.x)}" cy="${y(p.y)}" r="5.5" fill="${p.color}" stroke="#fffefa" stroke-width="2"/>`;
    }
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.aspectRatio = `${width} / ${height}`;
    svg.innerHTML = out;
  }

  function updateCOP() {
    updateLabels("cop");
    const zt = value("tc-cop-zt"), th = value("tc-cop-th"), delta = value("tc-cop-delta");
    const state = model.coolingLimit(zt, th, delta);
    put("tc-cop-result", state.feasible ? format(state.cop) : "No cooling");
    put("tc-cop-carnot", format(state.carnot));
    put("tc-cop-relative", state.feasible ? percent(state.cop / state.carnot) : "—");
    const caption = `Tₕ = ${th} K · T꜀ = ${state.tc} K · ΔT = ${delta} K. Positive cooling requires ZT̄ > ${format(state.threshold, 3)}.${state.feasible ? ` At ZT̄ = ${format(zt, 1)}, maximum COP = ${format(state.cop)}.` : " The selected ZT̄ cannot sustain this hot–cold temperature difference."}`;
    put("tc-cop-caption", caption);
    plot("tc-cop-chart", {
      xMax: 4, xTicks: [0, 1, 2, 3, 4], xLabel: "Device ZT̄", yLabel: "COP", yHigh: state.carnot * 1.07,
      bands: [{ x2: state.threshold }],
      series: [{ fn: (z) => model.coolingLimit(z, th, delta).cop, color: colors.teal }, { fn: () => state.carnot, color: colors.gray, dash: "7 6", width: 1.8 }],
      points: [{ x: zt, y: state.cop, color: colors.teal }], description: caption,
    });
  }

  function powerParameters() {
    return { alpha: 0.05, resistance: 2, conductance: value("tc-power-k"), th: 300, delta: value("tc-power-delta"), current: value("tc-power-current") };
  }

  function updatePower() {
    updateLabels("power");
    const p = powerParameters(), state = model.cooler(p);
    const terms = $("tc-power-terms").checked;
    $("tc-term-legend").hidden = !terms;
    $("tc-set-cop").disabled = state.iMaxCOP === null;
    put("tc-power-q", `${format(state.qc, 1)} W`);
    put("tc-power-input", `${format(state.input, 1)} W`);
    put("tc-power-cop", state.cop !== null ? format(state.cop) : state.input === 0 ? "Undefined" : "No cooling");
    for (const [name, amount] of Object.entries({ peltier: state.peltier, conduction: state.conduction, joule: state.joule, net: state.qc })) put(`tc-balance-${name}`, `${format(amount, 1)} W`);
    const copNote = state.iMaxCOP !== null ? `Max COP at ${format(state.iMaxCOP)} A; max Q꜀ at ${format(state.iMaxQ)} A.` : "No current produces positive cooling for these K and ΔT values.";
    put("tc-power-note", `${copNote} ${state.qc <= 0 ? "At the selected current, Q꜀ ≤ 0: there is no net cooling." : `The hot side rejects ${format(state.rejected, 1)} W, including the electrical input.`}`);
    const caption = `Illustrative module: α = 50 mV K⁻¹ · R = 2 Ω · Tₕ = 300 K. T꜀ = ${state.tc} K · calculated ZT̄ = ${format(state.zt, 2)}.`;
    put("tc-power-caption", caption);
    const at = (current) => model.cooler({ ...p, current });
    const last = at(12);
    const series = [];
    if (terms) series.push(
      { fn: (i) => at(i).peltier, color: colors.blue, dash: "7 4", width: 1.8 },
      { fn: (i) => -at(i).joule, color: colors.copper, dash: "3 4", width: 1.8 },
      { fn: (i) => -at(i).conduction, color: colors.gray, dash: "10 4 2 4", width: 1.8 },
    );
    series.push({ fn: (i) => at(i).qc, color: colors.teal, width: 3 });
    const guides = [{ x: state.iMaxQ, color: colors.copper, dash: "8 5" }];
    if (state.iMaxCOP !== null) guides.push({ x: state.iMaxCOP, color: colors.purple, dash: "3 4" });
    const low = Math.min(at(0).qc, last.qc, terms ? -last.joule : 0) * 1.06;
    plot("tc-power-chart", {
      xMax: 12, xTicks: [0, 3, 6, 9, 12], xLabel: "Current I (A)", yLabel: terms ? "Heat-flow contribution (W)" : "Net cooling Q꜀ (W)",
      yLow: low, yHigh: Math.max(10, terms ? last.peltier : state.qMax) * 1.12,
      series, guides, bands: [{ y1: niceAxis(low, Math.max(10, state.qMax) * 1.12).min, y2: 0, color: "#f3ede5" }],
      points: [{ x: p.current, y: state.qc, color: colors.teal }], description: `${caption} ${copNote} Selected current ${format(p.current)} A; Q c ${format(state.qc)} W; input ${format(state.input)} W.`,
    });
  }

  function updateGeneration() {
    updateLabels("gen");
    const zt = value("tc-gen-zt"), tc = value("tc-gen-tc"), delta = value("tc-gen-delta");
    const state = model.generation(zt, tc, delta);
    put("tc-gen-eta", percent(state.efficiency));
    put("tc-gen-carnot", percent(state.carnot));
    put("tc-gen-relative", state.relative === null ? "—" : percent(state.relative));
    put("tc-gen-th", `${state.th} K`);
    const leftCaption = `ΔT = ${delta} K · T꜀ = ${tc} K. Selected ZT̄ = ${format(zt, 1)}: ηₘₐₓ = ${percent(state.efficiency)}.`;
    const rightCaption = `ZT̄ = ${format(zt, 1)} · T꜀ = ${tc} K, held fixed across the sweep. Selected ΔT = ${delta} K.`;
    put("tc-gen-zt-caption", leftCaption);
    put("tc-gen-delta-caption", rightCaption);
    plot("tc-gen-zt-chart", {
      xMax: 4, xTicks: [0, 1, 2, 3, 4], xLabel: "Device ZT̄", yLabel: "Efficiency (%)", yHigh: Math.max(5, state.carnot * 107),
      series: [{ fn: (z) => model.generation(z, tc, delta).efficiency * 100, color: colors.teal }, { fn: () => state.carnot * 100, color: colors.gray, dash: "7 6", width: 1.8 }],
      points: [{ x: zt, y: state.efficiency * 100, color: colors.teal }], description: leftCaption,
    });
    plot("tc-gen-delta-chart", {
      xMax: 500, xTicks: [0, 100, 200, 300, 400, 500], xLabel: "Temperature difference ΔT (K)", yLabel: "Efficiency (%)", yHigh: model.generation(zt, tc, 500).carnot * 107,
      series: [{ fn: (d) => model.generation(zt, tc, d).efficiency * 100, color: colors.copper }, { fn: (d) => model.generation(zt, tc, d).carnot * 100, color: colors.gray, dash: "7 6", width: 1.8 }],
      points: [{ x: delta, y: state.efficiency * 100, color: colors.copper }], description: rightCaption,
    });
  }

  const updates = { cop: updateCOP, power: updatePower, gen: updateGeneration };
  for (const [group, settings] of Object.entries(defaults)) {
    Object.keys(settings).forEach((key) => $(`tc-${group}-${key}`).addEventListener("input", updates[group]));
  }
  $("tc-power-terms").addEventListener("change", updatePower);
  $("tc-set-cop").addEventListener("click", () => {
    const current = model.cooler(powerParameters()).iMaxCOP;
    if (current === null) return;
    $("tc-power-current").value = current.toFixed(2);
    updatePower();
  });
  $("tc-set-q").addEventListener("click", () => {
    $("tc-power-current").value = model.cooler(powerParameters()).iMaxQ.toFixed(2);
    updatePower();
  });
  root.querySelectorAll("[data-tc-reset]").forEach((button) => button.addEventListener("click", () => {
    const group = button.dataset.tcReset;
    for (const [key, initial] of Object.entries(defaults[group])) $(`tc-${group}-${key}`).value = initial;
    if (group === "power") $("tc-power-terms").checked = false;
    updates[group]();
  }));
  const updateAll = () => { updateCOP(); updatePower(); updateGeneration(); };
  let frame;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateAll); };
  const widths = new WeakMap();
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const width = Math.round(entry.contentRect.width);
        if (width > 0 && widths.get(entry.target) !== width) { widths.set(entry.target, width); changed = true; }
      }
      if (changed) schedule();
    });
    root.querySelectorAll(".tc-plot").forEach((el) => observer.observe(el));
  } else window.addEventListener("resize", schedule);
  window.addEventListener("pageviewchange", (event) => { if (event.detail.viewId === root.id) schedule(); });
  updateAll();
})();
