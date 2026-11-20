(() => {
  "use strict";
  const root = document.querySelector(".te-lab");
  const model = window.ThermoelectricModel;
  if (!root || !model) return;
  const $ = (id) => document.getElementById(id);
  const value = (id) => Number($(id).value);
  const put = (id, text) => { $(id).textContent = text; };
  // Plot colours are CSS custom properties so the light and dark themes can restyle them.
  const colors = { teal: "var(--tc-c-teal)", copper: "var(--tc-c-copper)", blue: "var(--tc-c-blue)", gray: "var(--tc-c-gray)", purple: "var(--tc-c-purple)", load: "var(--tc-c-load)", ref: "var(--tc-c-ref)" };
  const defaults = { cop: { zt: 0.8, th: 300, delta: 20 }, power: { n: 127, current: 3, delta: 20, th: 300, load: 150 }, gen: { zt: 1, tc: 300, delta: 100 } };
  // Leg designs for the multi-couple module (SI units). The thin-film design keeps
  // the same bulk material so that only geometry and contact resistance change.
  const designs = {
    bulk: { label: "Bulk module", width: 1.4e-3, length: 1.6e-3, couples: 127 },
    mini: { label: "Mini module", width: 0.5e-3, length: 0.5e-3, couples: 32 },
    film: { label: "Thin-film cooler", width: 0.2e-3, length: 20e-6, couples: 49 },
  };
  // Present-day reference devices for the working-environment check. The 6 A class
  // equals the bulk design (a common 40 x 40 mm, 127-couple module); the 15 A class
  // uses wider legs in the same footprint, matching typical high-current modules.
  const references = [
    { key: "a6", label: "40 × 40 mm module, 6 A class", short: "6 A module", width: 1.4e-3, length: 1.6e-3, couples: 127, fill: 0.3 },
    { key: "a15", label: "40 × 40 mm module, 15 A class", short: "15 A module", width: 2.0e-3, length: 1.6e-3, couples: 127, fill: 0.6 },
    { key: "film", label: "Thin-film cooler, 49 couples", short: "Thin film", width: 0.2e-3, length: 20e-6, couples: 49, fill: 0.3 },
  ];
  const hotSide = () => value("tc-power-th");
  let design = "bulk";
  const format = (x, digits = 2) => Number(x).toFixed(digits);
  const watts = (x) => `${format(x, Math.abs(x) < 10 ? 2 : 1)} W`;
  const percent = (x) => `${format(x * 100, 1)}%`;
  const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Symbol markup: <i> for physical quantities, <sub> for descriptive subscripts.
  // Captions take it as HTML; plot labels convert it to SVG tspans.
  const putHTML = (id, html) => { $(id).innerHTML = html; };
  const plain = (html) => html.replace(/<[^>]+>/g, "");
  const svgText = (html) => escape(html)
    .replace(/&lt;i&gt;(.*?)&lt;\/i&gt;/g, '<tspan font-style="italic">$1</tspan>')
    .replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/g, '<tspan baseline-shift="sub" font-size="80%">$1</tspan>');
  const sym = {
    ZT: "<i>ZT̄</i>", COP: "<i>COP</i>", dT: "Δ<i>T</i>", Th: "<i>T</i><sub>h</sub>", Tc: "<i>T</i><sub>c</sub>",
    Qc: "<i>Q</i><sub>c</sub>", I: "<i>I</i>", R: "<i>R</i>", K: "<i>K</i>", alpha: "<i>α</i>", N: "<i>N</i>",
    eta: "<i>η</i><sub>max</sub>", dTmax: "Δ<i>T</i><sub>max</sub>", qmax: "<i>q</i><sub>max</sub>",
  };

  function updateLabels(group) {
    Object.keys(defaults[group]).forEach((key) => {
      const id = `tc-${group}-${key}`;
      const input = $(id);
      const digits = key === "current" ? 2 : key === "zt" ? 1 : 0;
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
  // Surfaces, grid and bands use CSS classes; series colours are CSS variables.
  function plot(id, { xMax, xTicks, xLabel, yLabel, yLow = 0, yHigh, series, points = [], guides = [], bands = [], lines = [], description }) {
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
    let out = `<title>${escape(svg.getAttribute("aria-label"))}</title><desc>${escape(plain(description))}</desc><defs><clipPath id="${clip}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" /></clipPath></defs>`;
    out += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="tc-plot-bg" />`;
    for (const band of bands) {
      const bx = x(band.x1 ?? 0), by = y(band.y2 ?? axis.max);
      out += `<rect x="${bx}" y="${by}" width="${x(band.x2 ?? xMax) - bx}" height="${y(band.y1 ?? axis.min) - by}" class="${band.cls || "tc-band-off"}" clip-path="url(#${clip})" />`;
    }
    for (let n = axis.min; n <= axis.max + axis.step / 2; n += axis.step) {
      const label = Math.abs(n) < 1e-9 ? "0" : Number(n.toFixed(3)).toString();
      out += `<line x1="${x0}" x2="${x0 + w}" y1="${y(n)}" y2="${y(n)}" class="${Math.abs(n) < 1e-9 ? "tc-grid-zero" : "tc-grid"}"/><text x="${x0 - 10}" y="${y(n) + 4}" text-anchor="end">${label}</text>`;
    }
    for (const n of xTicks) out += `<line x1="${x(n)}" x2="${x(n)}" y1="${y0 + h}" y2="${y0 + h + 5}" class="tc-tick"/><text x="${x(n)}" y="${y0 + h + 21}" text-anchor="middle">${n}</text>`;
    out += `<text x="${x0}" y="14" class="tc-axis-title">${svgText(yLabel)}</text><text x="${x0 + w / 2}" y="${height - 5}" text-anchor="middle" class="tc-axis-title">${svgText(xLabel)}</text>`;
    for (const guide of guides) {
      out += `<line x1="${x(guide.x)}" x2="${x(guide.x)}" y1="${y0}" y2="${y0 + h}" style="stroke:${guide.color}" stroke-dasharray="${guide.dash || "4 5"}" stroke-width="1.5" clip-path="url(#${clip})"/>`;
    }
    for (const line of lines) {
      if (!Number.isFinite(line.y) || line.y < axis.min || line.y > axis.max) continue;
      out += `<line x1="${x0}" x2="${x0 + w}" y1="${y(line.y)}" y2="${y(line.y)}" style="stroke:${line.color}" stroke-width="${line.width || 1.6}" stroke-dasharray="${line.dash || "6 4"}"/>`;
      out += `<text x="${x0 + w - 6}" y="${y(line.y) - 6}" text-anchor="end" class="tc-line-label" style="fill:${line.color}">${svgText(line.label)}</text>`;
    }
    for (const s of series) {
      let d = "", active = false;
      for (let i = 0; i <= 400; i++) {
        const px = i / 400 * xMax, py = s.fn(px);
        if (py === null || !Number.isFinite(py)) { active = false; continue; }
        d += `${active ? "L" : "M"}${x(px).toFixed(2)},${y(py).toFixed(2)} `;
        active = true;
      }
      out += `<path d="${d}" fill="none" style="stroke:${s.color}" stroke-width="${s.width || 2.8}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""} stroke-linecap="round" stroke-linejoin="round" clip-path="url(#${clip})"/>`;
    }
    for (const p of points) {
      if (p.y === null || !Number.isFinite(p.y)) continue;
      out += `<line x1="${x(p.x)}" x2="${x(p.x)}" y1="${y(p.y)}" y2="${y0 + h}" style="stroke:${p.color}" stroke-opacity=".4" stroke-dasharray="3 5"/><circle cx="${x(p.x)}" cy="${y(p.y)}" r="5.5" style="fill:${p.color}" class="tc-point-ring" stroke-width="2"/>`;
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
    const caption = `${sym.Th} = ${th} K · ${sym.Tc} = ${state.tc} K · ${sym.dT} = ${delta} K. Positive cooling requires ${sym.ZT} > ${format(state.threshold, 3)}.${state.feasible ? ` At ${sym.ZT} = ${format(zt, 1)}, maximum ${sym.COP} = ${format(state.cop)}.` : ` The selected ${sym.ZT} cannot sustain this hot–cold temperature difference.`} Green band: Bi₂Te₃ modules today (${sym.ZT} ≈ 0.7–1).`;
    putHTML("tc-cop-caption", caption);
    const best = model.coolingLimit(2, th, delta).cop;
    plot("tc-cop-chart", {
      xMax: 2, xTicks: [0, 0.5, 1, 1.5, 2], xLabel: `Device ${sym.ZT}`, yLabel: sym.COP, yHigh: Math.max(best ?? 0, state.cop ?? 0, 0.5) * 1.15,
      bands: [{ x1: 0.7, x2: 1, cls: "tc-band-today" }, { x2: state.threshold, cls: "tc-band-off" }],
      series: [{ fn: (z) => model.coolingLimit(z, th, delta).cop, color: colors.teal }],
      points: [{ x: zt, y: state.cop, color: colors.teal }], description: caption,
    });
  }

  function moduleOf(couples = value("tc-power-n")) {
    const d = designs[design];
    return model.moduleProperties({ couples, width: d.width, length: d.length });
  }

  function powerParameters() {
    const m = moduleOf();
    return { alpha: m.alpha, resistance: m.resistance, conductance: m.conductance, th: hotSide(), delta: value("tc-power-delta"), current: value("tc-power-current") };
  }

  // The drive current scales with leg area, not with N, so each design gets its own range.
  function currentMax() {
    const one = moduleOf(1);
    return Math.ceil(1.6 * one.alpha * hotSide() / one.resistance);
  }

  function applyDesign(name, resetValues) {
    design = name;
    const input = $("tc-power-current"), max = currentMax();
    input.max = max;
    put("tc-power-current-max", `${max} A`);
    if (resetValues) {
      $("tc-power-n").value = designs[name].couples;
      input.value = (max / 3.2).toFixed(2);
    }
    document.querySelectorAll("[name='tc-design']").forEach((radio) => { radio.checked = radio.value === name; });
  }

  function updatePower() {
    // The current range follows the design and the hot-side temperature.
    const currentInput = $("tc-power-current"), xMax = currentMax();
    if (Number(currentInput.max) !== xMax) { currentInput.max = xMax; put("tc-power-current-max", `${xMax} A`); }
    updateLabels("power");
    const th = hotSide();
    const p = powerParameters(), state = model.cooler(p), m = moduleOf(), d = designs[design];
    const areaCm2 = m.footprint * 1e4, side = Math.sqrt(m.footprint) * 1e3;
    const terms = $("tc-power-terms").checked;
    $("tc-term-legend").hidden = !terms;
    $("tc-set-cop").disabled = state.iMaxCOP === null;
    put("tc-power-q", watts(state.qc));
    put("tc-power-flux", state.qc > 0 ? `${format(state.qc / areaCm2, 1)} W cm⁻²` : "—");
    put("tc-power-cop", state.cop !== null ? format(state.cop) : state.input === 0 ? "Undefined" : "No cooling");
    for (const [name, amount] of Object.entries({ peltier: state.peltier, conduction: state.conduction, joule: state.joule, net: state.qc })) put(`tc-balance-${name}`, watts(amount));
    const zeroDelta = m.alpha ** 2 * th ** 2 / (2 * m.resistance);
    const deltaMax = model.noLoadDelta(m.alpha ** 2 / (m.resistance * m.conductance), th);
    putHTML("tc-power-module", `${d.label}: ${sym.alpha} = ${p.alpha * 1e3 >= 10 ? format(p.alpha * 1e3, 1) : format(p.alpha * 1e3, 2)} mV K⁻¹ · ${sym.R} = ${format(p.resistance, p.resistance < 1 ? 3 : 2)} Ω · ${sym.K} = ${format(p.conductance, 3)} W K⁻¹ · ${sym.ZT} = ${format(state.zt, 2)} · footprint ≈ ${format(side, 1)} × ${format(side, 1)} mm · ${sym.dTmax} ≈ ${format(deltaMax, 0)} K · ${sym.qmax} ≈ ${format(zeroDelta / areaCm2, 0)} W cm⁻² at ${sym.dT} = 0`);
    const copNote = state.iMaxCOP !== null ? `Max ${sym.COP} at ${format(state.iMaxCOP)} A; max ${sym.Qc} at ${format(state.iMaxQ)} A.` : `No current produces net cooling at ${sym.dT} = ${p.delta} K; this module's limit is about ${format(deltaMax, 0)} K.`;
    putHTML("tc-power-note", `${copNote} ${state.qc <= 0 ? `At the selected current, ${sym.Qc} ≤ 0: there is no net cooling.` : `The heat sink must reject ${watts(state.rejected)}: the pumped heat plus ${watts(state.input)} of electrical input.`}`);
    const caption = `${d.label}: ${value("tc-power-n")} couples · ${sym.Th} = ${th} K · ${sym.Tc} = ${state.tc} K · electrical input ${watts(state.input)}.`;
    putHTML("tc-power-caption", caption);
    const at = (current) => model.cooler({ ...p, current });
    const last = at(xMax);
    const load = value("tc-power-load"), showRefs = $("tc-power-refs").checked;
    const env = { th, delta: p.delta };
    const rows = references.map((ref) => ({ ref, module: model.moduleProperties(ref) }));
    rows.push({ ref: { label: `Selected: ${d.label.toLowerCase()}, ${value("tc-power-n")} couples`, short: "Selected", selected: true }, module: m });
    const tbody = rows.map(({ ref, module }) => {
      const share = model.shareLoad({ ...module, ...env }, load);
      const side = Math.sqrt(module.footprint) * 1e3;
      if (share === null) return `<tr${ref.selected ? ' class="is-selected"' : ""}><th scope="row">${ref.label}</th><td colspan="6">Cannot hold ${sym.dT} = ${p.delta} K</td></tr>`;
      const area = share.modules * module.footprint * 1e4;
      return `<tr${ref.selected ? ' class="is-selected"' : ""}><th scope="row">${ref.label}<small>${format(side, 1)} × ${format(side, 1)} mm each</small></th><td>${watts(share.qMax)}</td><td>${share.modules}</td><td>${format(share.current, 2)} A</td><td>${load > 0 ? watts(share.input) : "—"}</td><td>${share.cop === null ? "—" : format(share.cop, 2)}</td><td>${load > 0 ? `${watts(share.rejected)}<small>${format(area, 0)} cm² of coolers</small>` : "—"}</td></tr>`;
    }).join("");
    putHTML("tc-load-rows", tbody);
    putHTML("tc-load-title", `Working environment: a ${load} W SoC with the heat sink at ${sym.Th} = ${th} K and ${sym.dT} = ${p.delta} K`);
    const refLines = showRefs ? [
      ...(load > 0 ? [{ y: load, color: colors.load, label: `SoC load ${load} W`, width: 2, dash: "8 4" }] : []),
      ...references.slice(0, 2).map((ref, i) => {
        const share = model.shareLoad({ ...model.moduleProperties(ref), ...env }, 0);
        return { y: share ? share.qMax : NaN, color: colors.ref, label: `${ref.short} max ${share ? watts(share.qMax) : ""}`, dash: i ? "2 4" : "5 4", width: 1.4 };
      }),
    ] : [];
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
    const high = Math.max(terms ? last.peltier : state.qMax, Math.abs(low) * 0.25, ...refLines.map((line) => Number.isFinite(line.y) ? line.y : 0)) * 1.12;
    const tickStep = xMax <= 6 ? 1 : xMax <= 12 ? 2 : 4;
    plot("tc-power-chart", {
      xMax, xTicks: Array.from({ length: Math.floor(xMax / tickStep) + 1 }, (_, i) => i * tickStep), xLabel: `Current ${sym.I} (A)`, yLabel: terms ? "Heat-flow contribution (W)" : `Net cooling ${sym.Qc} (W)`,
      yLow: low, yHigh: high,
      series, guides, lines: refLines, bands: [{ y1: niceAxis(low, high).min, y2: 0, cls: "tc-band-neg" }],
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
    const leftCaption = `${sym.dT} = ${delta} K · ${sym.Tc} = ${tc} K. Selected ${sym.ZT} = ${format(zt, 1)}: ${sym.eta} = ${percent(state.efficiency)}.`;
    const rightCaption = `${sym.ZT} = ${format(zt, 1)} · ${sym.Tc} = ${tc} K, held fixed across the sweep. Selected ${sym.dT} = ${delta} K.`;
    putHTML("tc-gen-zt-caption", leftCaption);
    putHTML("tc-gen-delta-caption", rightCaption);
    plot("tc-gen-zt-chart", {
      xMax: 2, xTicks: [0, 0.5, 1, 1.5, 2], xLabel: `Device ${sym.ZT}`, yLabel: `Efficiency ${sym.eta.replace(/<sub>max<\/sub>/, "")} (%)`, yHigh: Math.max(5, state.carnot * 107),
      series: [{ fn: (z) => model.generation(z, tc, delta).efficiency * 100, color: colors.teal }, { fn: () => state.carnot * 100, color: colors.gray, dash: "7 6", width: 1.8 }],
      points: [{ x: zt, y: state.efficiency * 100, color: colors.teal }], description: leftCaption,
    });
    plot("tc-gen-delta-chart", {
      xMax: 500, xTicks: [0, 100, 200, 300, 400, 500], xLabel: `Temperature difference ${sym.dT} (K)`, yLabel: `Efficiency ${sym.eta.replace(/<sub>max<\/sub>/, "")} (%)`, yHigh: model.generation(zt, tc, 500).carnot * 107,
      series: [{ fn: (d) => model.generation(zt, tc, d).efficiency * 100, color: colors.copper }, { fn: (d) => model.generation(zt, tc, d).carnot * 100, color: colors.gray, dash: "7 6", width: 1.8 }],
      points: [{ x: delta, y: state.efficiency * 100, color: colors.copper }], description: rightCaption,
    });
  }

  const updates = { cop: updateCOP, power: updatePower, gen: updateGeneration };
  for (const [group, settings] of Object.entries(defaults)) {
    Object.keys(settings).forEach((key) => $(`tc-${group}-${key}`).addEventListener("input", updates[group]));
  }
  $("tc-power-terms").addEventListener("change", updatePower);
  $("tc-power-refs").addEventListener("change", updatePower);
  document.querySelectorAll("[name='tc-design']").forEach((radio) => radio.addEventListener("change", () => {
    if (!radio.checked) return;
    applyDesign(radio.value, true);
    updatePower();
  }));
  applyDesign(design, false);
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
    if (group === "power") { applyDesign("bulk", false); $("tc-power-terms").checked = false; $("tc-power-refs").checked = true; }
    for (const [key, initial] of Object.entries(defaults[group])) $(`tc-${group}-${key}`).value = initial;
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
