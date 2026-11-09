(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const DATASETS = window.TE_DATASETS = window.TE_DATASETS || {};
  let D;
  let fields;
  let modelBy;
  let propBy;
  const dashPatterns = ["", "9 4", "3 3", "12 3 2 3", "2 3", "8 3 2 3 2 3"];
  const compareColors = [
    "#0072B2", "#D55E00", "#009E73", "#CC79A7", "#E69F00",
    "#56B4E9", "#6A3D9A", "#B15928", "#1B9E77", "#D95F02",
    "#7570B3", "#E7298A", "#66A61E", "#E6AB02", "#A6761D",
    "#1F78B4", "#E31A1C", "#33A02C", "#FF7F00", "#6B6ECF",
    "#8C564B",
  ];

  let state = {
    difficulty: "D2",
    condition: "without",
    incomplete: "0",
    model: "gpt6_1_sol_max",
    property: "seebeck",
    sample: "S01",
    question: null,
    compare: ["gpt6_1_sol_max"],
    aggregate: "mean",
  };
  let pickerQuery = "";

  const params = new URLSearchParams(location.search);
  for (const key of ["difficulty", "condition", "incomplete", "model", "property", "sample", "question", "aggregate"]) {
    if (params.get(key)) state[key] = params.get(key);
  }
  if (params.has("models")) {
    state.compare = params.get("models").split(",").filter(Boolean);
  } else {
    state.compare = [state.model];
  }

  function activateDataset() {
    if (!["D1", "D2"].includes(state.difficulty)) state.difficulty = "D2";
    const conditions = state.difficulty === "D1" ? ["different", "same"] : ["without", "with"];
    if (!conditions.includes(state.condition)) state.condition = conditions[0];
    const source = DATASETS[state.difficulty + "_" + state.condition];
    D = {...source, models: source.models.filter(model => model.complete || state.incomplete === "1")
      .map(model => model.complete ? model : {...model, label: `${model.label} [${model.returned}/114 returned]`})};
    fields = D.metric_fields;
    modelBy = Object.fromEntries(D.models.map((model) => [model.key, model]));
    propBy = Object.fromEntries(D.properties.map((property) => [property.slug, property]));
  }
  const pct = (value) => value == null || !Number.isFinite(value) ? "n/a" : `${(100 * value).toFixed(1)}%`;
  const num = (value) => value == null || value === "" ? "n/a" : Number(value).toLocaleString(undefined, { maximumSignificantDigits: 4 });
  const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

  function fillSelect(element, items, value) {
    element.innerHTML = items.map(([itemValue, label]) => `<option value="${esc(itemValue)}"${itemValue === value ? " selected" : ""}>${esc(label)}</option>`).join("");
  }

  function currentProp() {
    return propBy[state.property] || D.properties[0];
  }

  function currentQuestions() {
    const property = currentProp();
    const sampleSeries = D.series[property.slug]?.[state.sample] || {};
    return property.questions.filter((question) => sampleSeries[question.id]?.g?.length);
  }

  function ensureState() {
    activateDataset();
    if (!modelBy[state.model]) state.model = D.default_model || D.models[0].key;
    if (!propBy[state.property]) state.property = D.properties[0].slug;
    const property = currentProp();
    if (!property.samples.some((sample) => sample.id === state.sample)) state.sample = property.samples[0].id;
    const questions = currentQuestions();
    if (!questions.some((question) => question.id === state.question)) state.question = questions[0].id;
    const requested = new Set(state.compare.filter((key) => modelBy[key]));
    state.compare = D.models.filter((model) => requested.has(model.key)).map((model) => model.key);
    if (!new Set(["mean", "median"]).has(state.aggregate)) state.aggregate = "mean";
  }

  function syncURL() {
    const query = new URLSearchParams({
      difficulty: state.difficulty,
      condition: state.condition,
      incomplete: state.incomplete,
      model: state.model,
      property: state.property,
      sample: state.sample,
      question: state.question,
      models: state.compare.join(","),
      aggregate: state.aggregate,
    });
    history.replaceState(null, "", `${location.pathname}?${query}`);
  }

  function renderModelList() {
    const groups = [];
    for (const model of D.models) {
      let group = groups.find((item) => item.family === model.family);
      if (!group) {
        group = { family: model.family, items: [] };
        groups.push(group);
      }
      group.items.push(model);
    }
    const summary = D.summary[state.property] || {};
    $("modelList").innerHTML = groups.map((group) => `<div class="family">${esc(group.family)}</div>${group.items.map((model) => {
      const metrics = summary[model.key];
      return `<button type="button" class="model-button ${model.key === state.model ? "active" : ""}" style="--model-color:${model.color}" data-model="${model.key}"><span class="model-name">${esc(model.label)}${!model.complete ? '<span class="status-pill warning">PARTIAL</span>' : ""}</span><span class="model-mini">${model.returned}/114 returned · ${metrics ? `coverage ${pct(metrics.coverage)}` : ""}</span></button>`;
    }).join("")}`).join("");
    document.querySelectorAll("[data-model]").forEach((button) => {
      button.onclick = () => {
        state.model = button.dataset.model;
        render();
      };
    });
    filterSidebar();
  }

  function filterSidebar() {
    const query = $("sidebarSearch").value.trim().toLowerCase();
    document.querySelectorAll("[data-model]").forEach(button => {
      button.hidden = !button.textContent.toLowerCase().includes(query);
    });
    document.querySelectorAll("#modelList .family").forEach(heading => {
      let sibling = heading.nextElementSibling;
      let visible = false;
      while (sibling && !sibling.classList.contains("family")) {
        if (!sibling.hidden) visible = true;
        sibling = sibling.nextElementSibling;
      }
      heading.hidden = !visible;
    });
  }

  function renderControls() {
    $("difficultySelect").value = state.difficulty;
    fillSelect($("conditionSelect"), state.difficulty === "D1"
      ? [["different", "Different source · 24 questions"], ["same", "Same source as D2 · 12 questions"]]
      : [["without", "Normal · without instructions"], ["with", "Detail · with instructions"]], state.condition);
    $("includeIncomplete").checked = state.incomplete === "1";
    fillSelect($("modelSelect"), D.models.map((model) => [model.key, model.label]), state.model);
    fillSelect($("propertySelect"), D.properties.map((property) => [property.slug, `${property.title} (${property.questions.length} questions)`]), state.property);
    const property = currentProp();
    fillSelect($("sampleSelect"), property.samples.map((sample) => [sample.id, `${sample.id}: ${sample.name}`]), state.sample);
    fillSelect($("questionSelect"), currentQuestions().map((question) => [question.id, question.label || `${String(question.order).padStart(2, "0")}. ${question.id}`]), state.question);
    $("aggregateMethod").value = state.aggregate;
  }

  function entry(questionId = state.question) {
    return D.series[state.property][state.sample][questionId];
  }

  function pred(questionId = state.question, modelKey = state.model) {
    return entry(questionId).m[modelKey];
  }

  function metricsFor(questionId = state.question, modelKey = state.model) {
    const values = pred(questionId, modelKey).met;
    return Object.fromEntries(fields.map((field, index) => [field, values[index]]));
  }

  function renderCards() {
    const metrics = metricsFor();
    const stability = D.stability[state.property][state.sample][state.model];
    const ratio = metrics.median_abs_pred_gold_ratio;
    const bad = ratio != null && (ratio < .5 || ratio > 2);
    const items = [
      [pct(metrics.covered_points / metrics.gold_points), "Current-question coverage"],
      [pct((metrics["<=5%"] + metrics["5-10%"] + metrics["10-20%"] ) / metrics.gold_points), "Current question: ≤20% / Gold"],
      [num(ratio), "median |pred/gold|", bad],
      [`${metrics.predicted_points}/${metrics.gold_points}`, "Predicted points / Gold points"],
      [pct(stability.cov), "Cross-question slot coverage"],
      [pct(stability.spread), "Normalized robust spread"],
      [pct(stability.bias), "Normalized shape bias"],
    ];
    $("metricCards").innerHTML = items.map(([value, label, isBad]) => `<div class="metric-card ${isBad ? "bad" : ""}"><div class="value">${esc(value)}</div><div class="label">${esc(label)}</div></div>`).join("");
  }

  function bounds(values, pad = .1) {
    const finite = values.filter(Number.isFinite);
    if (!finite.length) return [0, 1];
    let low = Math.min(...finite);
    let high = Math.max(...finite);
    let span = high - low;
    if (!(span > 0)) span = Math.max(Math.abs(low) * .2, 1);
    return [low - span * pad, high + span * pad];
  }

  function niceTicks(low, high, target = 5) {
    if (!(high > low)) return [low];
    const raw = (high - low) / target;
    const power = 10 ** Math.floor(Math.log10(raw));
    const fraction = raw / power;
    const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    const step = nice * power;
    const start = Math.ceil(low / step) * step;
    const output = [];
    for (let value = start; value <= high + step * 1e-9 && output.length < 20; value += step) output.push(value);
    return output;
  }

  function fmt(value) {
    const magnitude = Math.abs(value);
    let output;
    if (magnitude >= 1e4 || (magnitude > 0 && magnitude < .1)) output = value.toExponential(1);
    else if (magnitude >= 100) output = value.toFixed(0);
    else if (magnitude >= 10) output = value.toFixed(1);
    else output = value.toFixed(2);
    return output.replace(/-/g, "−");
  }

  function axisText(value) {
    return esc(value)
      .replace(/⁻¹/g, '<tspan baseline-shift="super" font-size="70%">−1</tspan>')
      .replace(/⁻²/g, '<tspan baseline-shift="super" font-size="70%">−2</tspan>')
      .replace(/⁻³/g, '<tspan baseline-shift="super" font-size="70%">−3</tspan>');
  }

  function marker(x, y, type, color, open = false, size = 4) {
    const markerType = type || "circle";
    if (markerType.includes("open")) open = true;
    const fill = open ? "#fff" : color;
    if (markerType.startsWith("square")) return `<rect x="${x - size}" y="${y - size}" width="${size * 2}" height="${size * 2}" fill="${fill}" stroke="${color}" stroke-width="1.5"/>`;
    if (markerType.startsWith("diamond")) return `<polygon points="${x},${y - size - 1} ${x + size + 1},${y} ${x},${y + size + 1} ${x - size - 1},${y}" fill="${fill}" stroke="${color}" stroke-width="1.3"/>`;
    if (markerType.startsWith("triangle-down")) return `<polygon points="${x - size - 1},${y - size} ${x + size + 1},${y - size} ${x},${y + size + 1}" fill="${fill}" stroke="${color}" stroke-width="1.3"/>`;
    if (markerType.startsWith("triangle")) return `<polygon points="${x},${y - size - 1} ${x + size + 1},${y + size} ${x - size - 1},${y + size}" fill="${fill}" stroke="${color}" stroke-width="1.3"/>`;
    return `<circle cx="${x}" cy="${y}" r="${size}" fill="${fill}" stroke="${color}" stroke-width="1.6"/>`;
  }

  function panel({ id, x0, y0, w, h, title, xBounds, yBounds, yLabel, traces, note = "" }) {
    const left = x0 + 78;
    const right = x0 + w - 18;
    const top = y0 + 42;
    const bottom = y0 + h - 66;
    const [xLow, xHigh] = xBounds;
    const [yLow, yHigh] = yBounds;
    const mapX = (value) => left + (value - xLow) / (xHigh - xLow) * (right - left);
    const mapY = (value) => bottom - (value - yLow) / (yHigh - yLow) * (bottom - top);
    let svg = `<text class="pt" x="${(left + right) / 2}" y="${y0 + 22}" text-anchor="middle">${esc(title)}</text><rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" fill="#fff" stroke="#172026" stroke-width="1.4"/><clipPath id="${id}"><rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}"/></clipPath>`;
    for (const tick of niceTicks(xLow, xHigh)) {
      const x = mapX(tick);
      svg += `<line class="tick" x1="${x}" y1="${bottom}" x2="${x}" y2="${bottom - 8}"/><text class="tl" x="${x}" y="${bottom + 25}" text-anchor="middle">${fmt(tick)}</text>`;
    }
    for (const tick of niceTicks(yLow, yHigh)) {
      const y = mapY(tick);
      svg += `<line class="tick" x1="${left}" y1="${y}" x2="${left + 8}" y2="${y}"/><text class="tl" x="${left - 11}" y="${y + 5}" text-anchor="end">${fmt(tick)}</text>`;
    }
    svg += `<text class="al" x="${(left + right) / 2}" y="${bottom + 53}" text-anchor="middle">Temperature (K)</text><text class="al" x="${x0 + 21}" y="${(top + bottom) / 2}" text-anchor="middle" transform="rotate(-90 ${x0 + 21} ${(top + bottom) / 2})">${axisText(yLabel)}</text>`;
    for (const trace of traces) {
      if (!trace.points.length) continue;
      if (trace.band && trace.band.length) {
        const upper = trace.band.map((point) => [mapX(point[0]), mapY(point[2])]);
        const lower = [...trace.band].reverse().map((point) => [mapX(point[0]), mapY(point[1])]);
        const area = [...upper, ...lower].map((point, index) => `${index ? "L" : "M"} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" ") + " Z";
        svg += `<path d="${area}" fill="${trace.color}" fill-opacity="${trace.bandOpacity ?? .12}" stroke="none" clip-path="url(#${id})"/>`;
      }
      const coordinates = trace.points.map((point) => [mapX(point[0]), mapY(point[1])]);
      const path = coordinates.map((point, index) => `${index ? "L" : "M"} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" ");
      svg += `<path d="${path}" fill="none" stroke="${trace.color}" stroke-width="${trace.width || 1.7}" opacity="${trace.opacity ?? 1}" ${trace.dash ? `stroke-dasharray="${trace.dash}"` : ""} clip-path="url(#${id})"/>`;
      if (trace.marker) {
        for (const point of coordinates) svg += `<g clip-path="url(#${id})" opacity="${trace.opacity ?? 1}">${marker(point[0], point[1], trace.marker, trace.color, trace.open, trace.size || 4)}</g>`;
      }
    }
    if (note) svg += `<text class="note" x="${right - 5}" y="${top + 18}" text-anchor="end">${esc(note)}</text>`;
    return svg;
  }

  function svgShell(body, title, legend = "") {
    return `<svg viewBox="0 0 1200 610" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(title)}"><style>text{font-family:Inter,system-ui,sans-serif;fill:#172026;text-rendering:geometricPrecision}.title{font-size:20px;font-weight:700}.sub{font-size:13px;fill:#5b6670}.pt{font-size:16px;font-weight:700}.al{font-size:15px}.tl{font-size:12px}.tick{stroke:#172026;stroke-width:1.2}.note{font-size:11px;fill:#a94c4c;font-weight:700}</style><rect width="100%" height="100%" fill="#fff"/><text class="title" x="600" y="30" text-anchor="middle">${esc(title)}</text>${legend}${body}</svg>`;
  }

  function legend(model) {
    return `<line x1="435" y1="58" x2="475" y2="58" stroke="#b65f24" stroke-width="2"/>${marker(455, 58, "circle", "#b65f24", true, 4)}<text class="sub" x="485" y="63">Gold reference</text><line x1="620" y1="58" x2="660" y2="58" stroke="${model.color}" stroke-width="2.2" stroke-dasharray="7 4"/>${marker(640, 58, model.marker, model.color, false, 4)}<text class="sub" x="670" y="63">${esc(model.short)}</text>`;
  }

  function renderComparison() {
    const currentEntry = entry();
    const prediction = pred();
    const model = modelBy[state.model];
    const allPoints = [...currentEntry.g, ...prediction.p];
    const xBounds = bounds(allPoints.map((point) => point[0]), .04);
    const fullBounds = bounds(allPoints.map((point) => point[1]), .1);
    const zoomBounds = bounds(currentEntry.g.map((point) => point[1]), .15);
    const traces = [
      { points: currentEntry.g, color: "#b65f24", width: 2, marker: "circle", open: true },
      { points: prediction.p, color: model.color, width: 2.2, dash: "7 4", marker: model.marker },
    ];
    const outside = prediction.p.filter((point) => point[1] < zoomBounds[0] || point[1] > zoomBounds[1]).length;
    const title = `${state.question} — ${currentProp().title} — ${state.sample} — ${model.label}`;
    let body = panel({ id: "full", x0: 20, y0: 82, w: 570, h: 500, title: "Shared full scale", xBounds, yBounds: fullBounds, yLabel: currentProp().axis_label, traces });
    body += panel({ id: "zoom", x0: 610, y0: 82, w: 570, h: 500, title: "Gold-range zoom", xBounds, yBounds: zoomBounds, yLabel: currentProp().axis_label, traces, note: outside ? `${outside} predicted point(s) outside zoom` : "" });
    if (!prediction.p.length) body += `<text x="600" y="350" text-anchor="middle" style="font:600 20px Inter,system-ui,sans-serif;fill:#a94c4c">No comparable prediction curve (${esc(prediction.cv)})</text>`;
    $("comparisonPlot").innerHTML = svgShell(body, title, legend(model));
  }

  function median(values) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const count = sorted.length;
    return count % 2 ? sorted[(count - 1) / 2] : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  }

  function normalizedCurve(currentEntry, prediction) {
    if (!prediction.length || !currentEntry.g.length) return [];
    const xs = currentEntry.g.map((point) => point[0]).sort((a, b) => a - b);
    const gaps = xs.slice(1).map((x, index) => x - xs[index]);
    const tolerance = (median(gaps) || 1) * .45;
    const ratios = [];
    for (const point of prediction) {
      const gold = currentEntry.g.reduce((best, candidate) => Math.abs(candidate[0] - point[0]) < Math.abs(best[0] - point[0]) ? candidate : best);
      if (Math.abs(gold[0] - point[0]) <= tolerance && gold[1]) ratios.push(point[1] / gold[1]);
    }
    const scale = median(ratios);
    return scale && Number.isFinite(scale) ? prediction.map((point) => [point[0], point[1] / scale]) : [];
  }

  function quantile(values, probability) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const position = (sorted.length - 1) * probability;
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
  }

  function mean(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }

  function sampleStandardDeviation(values) {
    if (values.length < 2) return null;
    const center = mean(values);
    return Math.sqrt(values.reduce((sum, value) => sum + (value - center) ** 2, 0) / (values.length - 1));
  }

  const dataNum = (value) => value == null || value === "" ? "—" : Number(value).toLocaleString("en-US", { useGrouping: false, maximumSignificantDigits: 10 });

  function meanCell(values) {
    return values.length ? esc(dataNum(mean(values))) : "—";
  }

  function sdCell(values) {
    const spread = sampleStandardDeviation(values);
    return spread == null ? "—" : esc(dataNum(spread));
  }

  function alignedCountLabel(rows, key) {
    const counts = rows.map((row) => row[key].length).filter((count) => count > 0);
    if (!counts.length) return "n=0";
    const minimum = Math.min(...counts);
    const maximum = Math.max(...counts);
    return minimum === maximum ? `n=${maximum}` : `n=${minimum}–${maximum}`;
  }

  function nearestPoint(points, x) {
    if (!points.length) return null;
    return points.reduce((best, point) => Math.abs(point[0] - x) < Math.abs(best[0] - x) ? point : best);
  }

  function pointTolerance(points) {
    const xs = points.map((point) => point[0]).sort((a, b) => a - b);
    const gaps = xs.slice(1).map((value, index) => value - xs[index]);
    return (median(gaps) || 1) * .45;
  }

  function isScaleWarning(questionId, modelKey = state.model) {
    const prediction = pred(questionId, modelKey);
    if (!prediction.p.length) return false;
    const ratio = metricsFor(questionId, modelKey).median_abs_pred_gold_ratio;
    return ratio != null && (ratio < .5 || ratio > 2);
  }

  function isInjectedUnitErrorQuestion(question) {
    return ["D", "F"].includes(String(question.track || "").toUpperCase());
  }

  function selectedValueStatistics() {
    const reference = entry().g;
    const tolerance = pointTolerance(reference);
    const rows = reference.map(([temperature, gold]) => ({
      temperature,
      gold,
      selected: null,
      all: [],
      ordinary: [],
      unitError: [],
      trackA: [],
      trackB: [],
    }));
    const details = [];
    const counts = { all: 0, ordinary: 0, unitError: 0, scaleWarning: 0, missing: 0, trackA: 0, trackB: 0 };

    for (const question of currentQuestions()) {
      const questionEntry = entry(question.id);
      const prediction = pred(question.id);
      const hasCurve = prediction.p.length > 0;
      const scaleWarning = isScaleWarning(question.id);
      const track = String(question.track || "").toUpperCase();
      const unitErrorQuestion = state.difficulty === "D2" && isInjectedUnitErrorQuestion(question);
      const group = state.difficulty === "D1"
        ? `Track ${track || "—"}`
        : unitErrorQuestion ? "Output from unit-error question" : "Output from no-unit-error question";

      if (hasCurve) {
        counts.all += 1;
        if (state.difficulty === "D2") counts[unitErrorQuestion ? "unitError" : "ordinary"] += 1;
        if (state.difficulty === "D2" && scaleWarning) counts.scaleWarning += 1;
        if (state.difficulty === "D1" && track === "A") counts.trackA += 1;
        if (state.difficulty === "D1" && track === "B") counts.trackB += 1;
      } else {
        counts.missing += 1;
      }

      rows.forEach((row) => {
        const point = nearestPoint(prediction.p, row.temperature);
        if (!point || Math.abs(point[0] - row.temperature) > tolerance) return;
        const value = point[1];
        row.all.push(value);
        if (state.difficulty === "D2") row[unitErrorQuestion ? "unitError" : "ordinary"].push(value);
        if (state.difficulty === "D1" && track === "A") row.trackA.push(value);
        if (state.difficulty === "D1" && track === "B") row.trackB.push(value);
        if (question.id === state.question) row.selected = value;
      });

      if (!hasCurve) {
        details.push({ question, group, temperature: null, value: null, gold: null, relativeError: null, unit: prediction.u[1] || "—", unitErrorQuestion, scaleWarning: false, missing: true });
        continue;
      }
      const questionTolerance = pointTolerance(questionEntry.g);
      for (const point of prediction.p) {
        const goldPoint = nearestPoint(questionEntry.g, point[0]);
        const matchedGold = goldPoint && Math.abs(goldPoint[0] - point[0]) <= questionTolerance ? goldPoint[1] : null;
        const relativeError = matchedGold == null || matchedGold === 0 ? null : Math.abs(point[1] - matchedGold) / Math.abs(matchedGold);
        details.push({ question, group, temperature: point[0], value: point[1], gold: matchedGold, relativeError, unit: prediction.u[1] || "—", unitErrorQuestion, scaleWarning, missing: false });
      }
    }
    return { rows, details, counts };
  }

  function renderValueStatistics() {
    const property = currentProp();
    const sample = property.samples.find((item) => item.id === state.sample);
    const model = modelBy[state.model];
    const unit = property.display_unit || "display unit";
    const { rows, details, counts } = selectedValueStatistics();
    const d1 = state.difficulty === "D1";
    const allN = alignedCountLabel(rows, "all");
    const middleN = alignedCountLabel(rows, d1 ? "trackA" : "ordinary");
    const lastN = alignedCountLabel(rows, d1 ? "trackB" : "unitError");
    $("valueStatsTitle").textContent = `${model.label} × ${sample.id}: output values`;
    $("valueStatsNote").textContent = d1
      ? "Mean and sample SD are separate numeric columns for direct plotting. Track A is canonical and Track B is the valid alternate unit, temperature-scale, or axis presentation. Missing values are excluded. The Mean-column headers report aligned n; a range means n varies by temperature."
      : "Mean and sample SD are separate numeric columns for direct plotting. Values are post-conversion outputs grouped by their source questions. D2 tracks D and F contain injected unit errors; the other tracks are the no-unit-error comparison. A post-conversion scale warning means median |pred/gold| < 0.5 or > 2. Missing values are excluded. Mean-column n is the aligned count; a range means n varies by temperature.";
    $("valueStatsSummary").innerHTML = d1
      ? `<strong>${counts.all}</strong> curves · <strong>${counts.trackA}</strong> Track A · <strong>${counts.trackB}</strong> Track B · <strong>${counts.missing}</strong> missing`
      : `<strong>${counts.all}</strong> curves · <strong>${counts.ordinary}</strong> outputs from no-unit-error questions · <strong>${counts.unitError}</strong> outputs from unit-error questions · <strong>${counts.scaleWarning}</strong> post-conversion scale warnings · <strong>${counts.missing}</strong> missing`;
    $("valueStatsHead").innerHTML = d1
      ? `<tr><th>Temperature (K)</th><th>Gold (${esc(unit)})</th><th>${esc(state.question)} (${esc(unit)})</th><th>All mean (${allN})</th><th>All SD</th><th>Track A mean (${middleN})</th><th>Track A SD</th><th>Track B mean (${lastN})</th><th>Track B SD</th></tr>`
      : `<tr><th>Temperature (K)</th><th>Gold (${esc(unit)})</th><th>${esc(state.question)} (${esc(unit)})</th><th>All-output mean (${allN})</th><th>All-output SD</th><th>No-unit-error-question output mean (${middleN})</th><th>No-unit-error-question output SD</th><th>Unit-error-question output mean (${lastN})</th><th>Unit-error-question output SD</th></tr>`;
    $("valueStatsBody").innerHTML = rows.map((row) => {
      const middle = d1 ? row.trackA : row.ordinary;
      const last = d1 ? row.trackB : row.unitError;
      return `<tr><td>${esc(dataNum(row.temperature))}</td><td>${esc(dataNum(row.gold))}</td><td>${row.selected == null ? "—" : esc(dataNum(row.selected))}</td><td>${meanCell(row.all)}</td><td>${sdCell(row.all)}</td><td>${meanCell(middle)}</td><td>${sdCell(middle)}</td><td>${meanCell(last)}</td><td>${sdCell(last)}</td></tr>`;
    }).join("");
    $("valueDetailSummary").textContent = `Show every question-level output value (${details.length} rows)`;
    $("valueDetailBody").innerHTML = details.map((detail) => `<tr class="${detail.scaleWarning ? "bad" : ""}"><td>${detail.question.order}</td><td>${esc(detail.question.label || detail.question.id)}</td><td><span class="status-pill ${detail.unitErrorQuestion ? "unit-task" : ""}">${esc(detail.group)}</span>${detail.scaleWarning ? ` <span class="status-pill warning">Scale warning</span>` : ""}${detail.missing ? ` <span class="status-pill">Missing output</span>` : ""}</td><td>${detail.temperature == null ? "—" : esc(num(detail.temperature))}</td><td>${detail.value == null ? "—" : esc(num(detail.value))}</td><td>${detail.gold == null ? "—" : esc(num(detail.gold))}</td><td>${detail.relativeError == null ? "—" : esc(pct(detail.relativeError))}</td><td>${esc(detail.unit)}</td></tr>`).join("");
  }

  function aggregateForModel(modelKey, normalize = false) {
    const property = currentProp();
    const goldXs = entry().g.map((point) => point[0]);
    const gaps = goldXs.slice(1).map((value, index) => value - goldXs[index]);
    const tolerance = (median(gaps) || 1) * .45;
    const slots = goldXs.map(() => []);
    let curveCount = 0;
    for (const question of currentQuestions()) {
      const currentEntry = D.series[state.property][state.sample][question.id];
      let points = currentEntry.m[modelKey].p;
      if (normalize) points = normalizedCurve(currentEntry, points);
      if (!points.length) continue;
      curveCount += 1;
      goldXs.forEach((x, slotIndex) => {
        let nearest = null;
        for (const point of points) {
          if (!nearest || Math.abs(point[0] - x) < Math.abs(nearest[0] - x)) nearest = point;
        }
        if (nearest && Math.abs(nearest[0] - x) <= tolerance) slots[slotIndex].push(nearest[1]);
      });
    }
    const points = [];
    const band = [];
    slots.forEach((values, slotIndex) => {
      if (!values.length) return;
      const center = state.aggregate === "median" ? median(values) : values.reduce((sum, value) => sum + value, 0) / values.length;
      points.push([goldXs[slotIndex], center]);
      band.push([goldXs[slotIndex], quantile(values, .25), quantile(values, .75)]);
    });
    return { points, band, curveCount, observedSlots: points.length, totalSlots: goldXs.length };
  }

  function repeatedQuestionTraces(model, normalize = false) {
    const style = styleForModel(model);
    const traces = [];
    for (const question of currentQuestions()) {
      const currentEntry = D.series[state.property][state.sample][question.id];
      let points = currentEntry.m[model.key].p;
      if (normalize) points = normalizedCurve(currentEntry, points);
      if (points.length) traces.push({ points, color: style.color, width: .9, opacity: .10 });
    }
    return traces;
  }

  function repeatedQuestionSummary(modelKey) {
    let goldPoints = 0;
    let coveredPoints = 0;
    let within20 = 0;
    let curves = 0;
    let scaleWarnings = 0;
    for (const question of currentQuestions()) {
      const prediction = D.series[state.property][state.sample][question.id].m[modelKey];
      const metrics = Object.fromEntries(fields.map((field, index) => [field, prediction.met[index]]));
      goldPoints += metrics.gold_points;
      coveredPoints += metrics.covered_points;
      within20 += metrics["<=5%"] + metrics["5-10%"] + metrics["10-20%"];
      if (prediction.p.length) curves += 1;
      const ratio = metrics.median_abs_pred_gold_ratio;
      if (ratio != null && (ratio < .5 || ratio > 2)) scaleWarnings += 1;
    }
    return { goldPoints, coveredPoints, within20, curves, scaleWarnings };
  }

  function renderRobustness() {
    const property = currentProp();
    const model = modelBy[state.model];
    const selectedEntry = entry();
    const raw = [];
    const normalized = [];
    const questions = currentQuestions();
    for (const question of questions) {
      const currentEntry = D.series[state.property][state.sample][question.id];
      const prediction = currentEntry.m[state.model].p;
      const isSelected = question.id === state.question;
      if (prediction.length) {
        raw.push({ points: prediction, color: model.color, width: isSelected ? 2.8 : 1.25, opacity: isSelected ? 1 : .2, marker: isSelected ? model.marker : null });
        const normalizedPrediction = normalizedCurve(currentEntry, prediction);
        if (normalizedPrediction.length) normalized.push({ points: normalizedPrediction, color: model.color, width: isSelected ? 2.8 : 1.25, opacity: isSelected ? 1 : .2, marker: isSelected ? model.marker : null });
      }
    }
    const gold = { points: selectedEntry.g, color: "#b65f24", width: 2.2, marker: "circle", open: true };
    const rawTraces = [...raw, gold];
    const normalizedTraces = [...normalized, gold];
    const xBounds = bounds([...selectedEntry.g, ...raw.flatMap((trace) => trace.points)].map((point) => point[0]), .04);
    const rawBounds = bounds(rawTraces.flatMap((trace) => trace.points).map((point) => point[1]), .1);
    const normalizedBounds = bounds(normalizedTraces.flatMap((trace) => trace.points).map((point) => point[1]), .12);
    let body = panel({ id: "rraw", x0: 20, y0: 82, w: 570, h: 500, title: `Raw overlay (${raw.length}/${questions.length} curves)`, xBounds, yBounds: rawBounds, yLabel: property.axis_label, traces: rawTraces });
    body += panel({ id: "rnorm", x0: 610, y0: 82, w: 570, h: 500, title: "Median-scale-normalized shape", xBounds, yBounds: normalizedBounds, yLabel: property.axis_label, traces: normalizedTraces });
    $("robustnessPlot").innerHTML = svgShell(body, `${state.sample}: ${property.title} across repeated questions`, legend(model));
  }

  function styleForModel(model) {
    const index = Math.max(0, D.models.findIndex((candidate) => candidate.key === model.key));
    return {
      color: compareColors[index % compareColors.length],
      marker: model.marker,
      dash: dashPatterns[Math.floor(index / compareColors.length) % dashPatterns.length],
    };
  }

  function renderModelPicker() {
    const query = pickerQuery.trim().toLowerCase();
    const groups = [];
    for (const model of D.models) {
      if (query && !`${model.label} ${model.family} ${model.effort}`.toLowerCase().includes(query)) continue;
      let group = groups.find((item) => item.family === model.family);
      if (!group) {
        group = { family: model.family, items: [] };
        groups.push(group);
      }
      group.items.push(model);
    }
    $("modelPicker").innerHTML = groups.length ? groups.map((group) => `<div class="picker-family"><h4>${esc(group.family)}</h4>${group.items.map((model) => `<label class="model-option" style="--model-color:${model.color}"><input type="checkbox" value="${model.key}"${state.compare.includes(model.key) ? " checked" : ""}><span class="color-key" aria-hidden="true"></span><span>${esc(model.label)}</span></label>`).join("")}</div>`).join("") : `<p class="selection-summary">No model matches “${esc(pickerQuery)}”.</p>`;
    $("modelPicker").querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      checkbox.onchange = () => {
        const requested = new Set(state.compare);
        if (checkbox.checked) requested.add(checkbox.value); else requested.delete(checkbox.value);
        state.compare = D.models.filter((model) => requested.has(model.key)).map((model) => model.key);
        syncURL();
        renderModelPicker();
        renderMultiComparison();
      };
    });
  }

  function legendSwatch(model) {
    const style = styleForModel(model);
    return `<span class="legend-item"><svg viewBox="0 0 40 14" aria-hidden="true"><line x1="2" y1="7" x2="38" y2="7" stroke="${style.color}" stroke-width="2.2" ${style.dash ? `stroke-dasharray="${style.dash}"` : ""}/>${marker(20, 7, style.marker, style.color, false, 3)}</svg><span>${esc(model.short)}</span></span>`;
  }

  function renderMultiComparison() {
    const selectedModels = state.compare.map((key) => modelBy[key]).filter(Boolean);
    const currentEntry = entry();
    const gold = { points: currentEntry.g, color: "#b65f24", width: 2.4, marker: "circle", open: true, size: 4 };
    const showQuestionCurves = selectedModels.length > 0 && selectedModels.length <= 4;
    const bandOpacity = selectedModels.length <= 6 ? .12 : .06;
    const rawAggregates = selectedModels.map((model) => {
      const style = styleForModel(model);
      const aggregate = aggregateForModel(model.key, false);
      return { model, aggregate, trace: { points: aggregate.points, band: aggregate.band, bandOpacity, color: style.color, width: 2.8, marker: selectedModels.length <= 8 ? style.marker : null, size: 3.5 } };
    });
    const normalizedAggregates = selectedModels.map((model) => {
      const style = styleForModel(model);
      const aggregate = aggregateForModel(model.key, true);
      return { model, aggregate, trace: { points: aggregate.points, band: aggregate.band, bandOpacity, color: style.color, width: 2.8, marker: selectedModels.length <= 8 ? style.marker : null, size: 3.5 } };
    });
    const rawFaint = showQuestionCurves ? selectedModels.flatMap((model) => repeatedQuestionTraces(model, false)) : [];
    const normalizedFaint = showQuestionCurves ? selectedModels.flatMap((model) => repeatedQuestionTraces(model, true)) : [];
    const rawTraces = [...rawFaint, ...rawAggregates.map((item) => item.trace), gold];
    const normalizedTraces = [...normalizedFaint, ...normalizedAggregates.map((item) => item.trace), gold];
    const xBounds = bounds([...currentEntry.g, ...rawTraces.flatMap((trace) => trace.points)].map((point) => point[0]), .04);
    const rawBounds = bounds(rawTraces.flatMap((trace) => trace.points).map((point) => point[1]), .1);
    const normalizedBounds = bounds(normalizedTraces.flatMap((trace) => trace.points).map((point) => point[1]), .12);
    const countLabel = selectedModels.length ? `${selectedModels.length} selected model${selectedModels.length === 1 ? "" : "s"}` : "Gold reference only";
    const methodLabel = state.aggregate === "mean" ? "Mean" : "Median";
    let body = panel({ id: "mraw", x0: 20, y0: 62, w: 570, h: 520, title: `${methodLabel} raw curve + IQR`, xBounds, yBounds: rawBounds, yLabel: currentProp().axis_label, traces: rawTraces });
    body += panel({ id: "mnormalized", x0: 610, y0: 62, w: 570, h: 520, title: `${methodLabel} median-scale-normalized shape + IQR`, xBounds, yBounds: normalizedBounds, yLabel: currentProp().axis_label, traces: normalizedTraces });
    $("multiModelPlot").innerHTML = svgShell(body, `${state.sample} — ${currentProp().title} across repeated questions — ${countLabel}`);
    $("selectionSummary").textContent = selectedModels.length ? `${selectedModels.length} of ${D.models.length} model settings selected. Each model has a unique comparison color. ${showQuestionCurves ? "Faint lines are individual questions; heavy lines are the central curves." : "Individual question curves are hidden above four selected models; heavy curves and IQR bands remain."}` : `No model selected. Gold is shown by itself.`;
    $("multiLegend").innerHTML = `<span class="legend-item"><svg viewBox="0 0 40 14" aria-hidden="true"><line x1="2" y1="7" x2="38" y2="7" stroke="#b65f24" stroke-width="2.2"/>${marker(20, 7, "circle", "#b65f24", true, 3)}</svg><span>Gold reference</span></span>${selectedModels.map(legendSwatch).join("")}`;

    $("multiModelTable").innerHTML = selectedModels.length ? selectedModels.map((model) => {
      const summary = repeatedQuestionSummary(model.key);
      const stability = D.stability[state.property][state.sample][model.key];
      const goldPoints = summary.goldPoints || 1;
      const bad = summary.scaleWarnings > 0;
      const questionCount = currentQuestions().length;
      return `<tr class="${model.key === state.model ? "primary-model " : ""}${bad ? "bad" : ""}"><td>${esc(model.label)}</td><td>${summary.curves}/${questionCount}</td><td>${pct(summary.coveredPoints / goldPoints)}</td><td>${pct(summary.within20 / goldPoints)}</td><td>${pct(stability.cov)}</td><td>${pct(stability.spread)}</td><td>${pct(stability.bias)}</td><td>${summary.scaleWarnings}/${questionCount}</td></tr>`;
    }).join("") : `<tr><td colspan="8" style="text-align:left;color:#5b6670">Select one or more models above to compare their repeated-question central curves.</td></tr>`;
  }

  function renderTable() {
    const questions = currentQuestions();
    $("questionTable").innerHTML = questions.map((question) => {
      const prediction = D.series[state.property][state.sample][question.id].m[state.model];
      const metrics = Object.fromEntries(fields.map((field, index) => [field, prediction.met[index]]));
      const goldPoints = metrics.gold_points || 1;
      const ratio = metrics.median_abs_pred_gold_ratio;
      const bad = !metrics.predicted_points || (ratio != null && (ratio < .5 || ratio > 2));
      return `<tr data-question="${question.id}" class="${question.id === state.question ? "selected " : ""}${bad ? "bad" : ""}"><td>${question.order}</td><td>${esc(question.label || question.id)}</td><td><span class="status-pill ${prediction.st === "ok" ? "ok" : ""}">${esc(prediction.st)}</span></td><td>${metrics.predicted_points}</td><td>${pct(metrics.covered_points / goldPoints)}</td><td>${pct(metrics["<=5%"] / goldPoints)}</td><td>${pct(metrics["5-10%"] / goldPoints)}</td><td>${pct(metrics["10-20%"] / goldPoints)}</td><td>${pct(metrics[">20%"] / goldPoints)}</td><td>${pct(metrics.missing_points / goldPoints)}</td><td>${num(ratio)}</td><td>${esc(prediction.u[1] || "—")}</td></tr>`;
    }).join("");
    document.querySelectorAll("[data-question]").forEach((row) => {
      row.onclick = () => {
        state.question = row.dataset.question;
        render();
      };
    });
  }

  function renderDatasetContext() {
    $("browserIntro").textContent = `${state.difficulty}: ${D.models.length} model settings × ${D.properties.length} thermoelectric properties. User-defined model and effort order. Updated 9 Nov 2026 from the selected 4 Nov results.`;
    const d1 = state.difficulty === "D1";
    $("reportLink").href = "methods.html";
    $("reportLink").textContent = "Methods & provenance";
    $("curveCsvLink").href = `data/${D.dataset}_csv.zip`;
    $("browserFootnote").textContent = d1
      ? "D1 compares a canonical single-panel extraction (Track A) with a valid unit, temperature-scale, or axis-presentation variant (Track B). Every point fraction uses all Gold points in the selected question as denominator. Robustness here describes agreement across the paired presentations, not repeated-call randomness."
      : "Every point-level fraction uses all Gold points in the current question as its denominator; “Lost” means uncovered Gold points. Cross-question slot coverage, median-scale-normalized robust spread, and normalized shape bias use the same definitions as Fig. 10 of the main report. Here, robustness measures whether the same curve is extracted consistently from different questions and contexts; it is not the random variance of repeated calls to one identical prompt.";
    const model = modelBy[state.model];
    const prediction = pred();
    $("sourceNote").textContent = `${d1 ? (state.condition === "same" ? "D1 same source" : "D1 different source") : (state.condition === "with" ? "D2 detail (with instructions)" : "D2 normal (without instructions)")} · ${model.returned}/114 responses returned · Selected source: ${prediction.source_key} · Response status: ${prediction.st}.`;
    if (d1 && state.condition === "different") $("sourceNote").textContent += " Set 1 Gold/image binding remains provisional.";
    if (!model.complete) $("sourceNote").textContent += " Incomplete configuration: observed curves only; no complete benchmark ranking.";
  }

  const pendingDatasets = new Map();
  function loadDataset(key) {
    if (DATASETS[key]) return Promise.resolve();
    if (pendingDatasets.has(key)) return pendingDatasets.get(key);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `data/${key}.js`;
      script.onload = () => DATASETS[key] ? resolve() : reject(new Error("Dataset unavailable"));
      script.onerror = () => { script.remove(); pendingDatasets.delete(key); reject(new Error("Download failed")); };
      document.head.appendChild(script);
    });
    pendingDatasets.set(key, promise);
    return promise;
  }
  let renderVersion = 0;
  async function render() {
    const version = ++renderVersion;
    if (!["D1", "D2"].includes(state.difficulty)) state.difficulty = "D2";
    const conditions = state.difficulty === "D1" ? ["different", "same"] : ["without", "with"];
    if (!conditions.includes(state.condition)) state.condition = conditions[0];
    const key = `${state.difficulty}_${state.condition}`;
    const loading = $("datasetLoading");
    loading.hidden = false;
    $("retryDataset").hidden = true;
    loading.querySelector("span").textContent = `Loading ${key.replaceAll("_", " ")} curves…`;
    document.querySelector(".layout").inert = true;
    try { await loadDataset(key); }
    catch (error) {
      loading.querySelector("span").textContent = "Curve data could not be loaded. Check your connection and retry.";
      $("retryDataset").hidden = false;
      return;
    }
    if (version !== renderVersion) return;
    loading.hidden = true;
    document.querySelector(".layout").inert = false;
    ensureState();
    syncURL();
    renderDatasetContext();
    renderControls();
    renderModelList();
    renderModelPicker();
    const property = currentProp();
    const sample = property.samples.find((item) => item.id === state.sample);
    const questions = currentQuestions();
    const question = questions.find((item) => item.id === state.question);
    const model = modelBy[state.model];
    $("pageTitle").textContent = `${state.difficulty} · ${model.label} · ${property.title}`;
    $("pageSubtitle").textContent = `${sample.id}: ${sample.name} · ${questions.indexOf(question) + 1}/${questions.length} ${question.label || question.id}`;
    renderCards();
    renderComparison();
    renderValueStatistics();
    renderMultiComparison();
    renderRobustness();
    renderTable();
  }

  $("difficultySelect").onchange = (event) => {
    state.difficulty = event.target.value;
    state.property = "seebeck";
    state.sample = "S01";
    state.question = null;
    state.compare = [state.model];
    render();
  };

  $("conditionSelect").onchange = (event) => {
    state.condition = event.target.value;
    state.question = null;
    render();
  };
  $("includeIncomplete").onchange = (event) => {
    state.incomplete = event.target.checked ? "1" : "0";
    render();
  };
  $("sidebarSearch").oninput = filterSidebar;

  const audit = window.TE_AUDIT;
  $("coverageSummary").textContent = `64 complete configurations / 76 requested · 7,637 returned responses / 8,664 planned slots · 1,047 returned output anomalies retained`;
  $("coverageTable").innerHTML = audit.coverage.map(row => `<tr><td>${esc(row.model)} ${esc(row.effort)}</td><td>${row.schema_ok + row.output_error}/114</td><td>${row.schema_ok}</td><td>${row.output_error}</td><td>${row.api_failed}</td><td>${row.unrequested + row.not_tested}</td></tr>`).join("");
  $("coverageCounts").textContent = `API failures: ${audit.counts.api_raw || 0}; empty responses: ${audit.counts.api_empty_response || 0}; unrequested: ${audit.counts.unrequested || 0}; untested without a source: ${audit.counts.not_tested || 0}; JSON/parse anomalies: ${audit.counts.parse_json || 0}; structure/schema anomalies: ${audit.counts.structure_schema || 0}. Returned anomalies count as completed tests.`;

  $("modelSelect").onchange = (event) => {
    state.model = event.target.value;
    render();
  };
  $("propertySelect").onchange = (event) => {
    state.property = event.target.value;
    state.sample = currentProp().samples[0].id;
    state.question = currentQuestions()[0].id;
    render();
  };
  $("sampleSelect").onchange = (event) => {
    state.sample = event.target.value;
    render();
  };
  $("questionSelect").onchange = (event) => {
    state.question = event.target.value;
    render();
  };
  function stepQuestion(delta) {
    const questions = currentQuestions();
    const index = questions.findIndex((question) => question.id === state.question);
    state.question = questions[(index + delta + questions.length) % questions.length].id;
    render();
  }
  $("prevQuestion").onclick = () => stepQuestion(-1);
  $("nextQuestion").onclick = () => stepQuestion(1);
  $("modelSearch").oninput = (event) => {
    pickerQuery = event.target.value;
    renderModelPicker();
  };
  $("aggregateMethod").onchange = (event) => {
    state.aggregate = event.target.value;
    render();
  };
  $("addCurrent").onclick = () => {
    const requested = new Set(state.compare);
    requested.add(state.model);
    state.compare = D.models.filter((model) => requested.has(model.key)).map((model) => model.key);
    render();
  };
  $("selectAllModels").onclick = () => {
    state.compare = D.models.map((model) => model.key);
    render();
  };
  $("clearModels").onclick = () => {
    state.compare = [];
    render();
  };

  $("retryDataset").onclick = render;
  render();
})();
