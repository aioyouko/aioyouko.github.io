(() => {
  "use strict";
  const root = document.querySelector("[data-ductility-map]");
  const data = window.DuctilityMapData;
  if (!root || !data) return;
  const $ = (name) => root.querySelector(`[data-dm-${name}]`);
  const svg = $("plot");
  const ns = "http://www.w3.org/2000/svg";
  const groups = new Map(data.groups.map((group) => [group.id, group]));
  const enabled = new Set(groups.keys());
  const marks = new Map();
  const options = new Map();
  const rows = new Map();
  let selected = "ag2-alloy-1";
  const initialSelection = selected;
  const plot = { top: 46, bottom: 500, left: 96, right: 866, zero: 130, logLeft: 218 };
  const x = (gap) => gap === null ? plot.zero : plot.logLeft + (Math.log10(gap) - Math.log10(0.08)) / (1 - Math.log10(0.08)) * (plot.right - plot.logLeft);
  const y = (strain) => plot.bottom - (Math.log10(strain) + 2) / (Math.log10(200) + 2) * (plot.bottom - plot.top);
  const approximate = data.provisional ? "≈ " : "";
  const number = (value) => String(Number(value.toPrecision(3)));
  const gapLabel = (point) => point.bandGapEv === null ? "≈ 0 · separate strip" : `${approximate}${number(point.bandGapEv)} eV`;
  const strainLabel = (point) => `${approximate}${number(point.elongationPercent)}%`;
  const name = (point) => `${point.label}${point.example ? ` · example ${point.example}` : ""}`;
  const description = (point) => `${name(point)}. ${groups.get(point.group).label}. Band gap ${gapLabel(point)}; elongation ${strainLabel(point)}. ${data.provisional ? "Provisional image estimate." : ""}`;
  const visible = () => data.points.filter((point) => enabled.has(point.group));

  function element(tag, attributes = {}, text, parent = svg) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    parent.append(node);
    return node;
  }

  element("title", { id: "dm-plot-title" }, "Band gap and elongation of inorganic materials");
  element("desc", { id: "dm-plot-desc" }, "Provisional estimates from a supplied schematic. Both numerical axes are logarithmic. A separate near-zero-gap strip contains metals and Mg3Bi2. Tab to points or use the material selector to inspect values. Colored regions are visual guides, not fitted boundaries.");
  element("rect", { x: plot.left, y: plot.top, width: plot.right - plot.left, height: plot.bottom - plot.top, rx: 4, class: "dm-plot-bg" });
  element("rect", { x: 108, y: 57, width: 45, height: 203, rx: 23, fill: groups.get("metal").color, opacity: 0.13, "data-dm-region": "metal" });
  element("ellipse", { cx: 485, cy: 142, rx: 272, ry: 84, transform: "rotate(8 485 142)", fill: groups.get("ductile").color, opacity: 0.12, "data-dm-region": "ductile" });
  element("ellipse", { cx: 590, cy: 389, rx: 137, ry: 56, transform: "rotate(12 590 389)", fill: groups.get("semiconductor").color, opacity: 0.14, "data-dm-region": "semiconductor" });
  element("ellipse", { cx: 786, cy: 387, rx: 76, ry: 48, transform: "rotate(20 786 387)", fill: groups.get("ceramic").color, opacity: 0.14, "data-dm-region": "ceramic" });

  [0.01, 0.1, 1, 10, 100].forEach((tick) => {
    element("line", { x1: plot.left, x2: plot.right, y1: y(tick), y2: y(tick), class: "dm-grid" });
    element("text", { x: plot.left - 14, y: y(tick) + 5, "text-anchor": "end", class: "dm-tick" }, number(tick));
  });
  [0.1, 1, 10].forEach((tick) => {
    element("line", { x1: x(tick), x2: x(tick), y1: plot.top, y2: plot.bottom, class: "dm-grid dm-grid-vertical" });
    element("text", { x: x(tick), y: 526, "text-anchor": "middle", class: "dm-tick" }, number(tick));
  });
  [0.2, 0.5, 2, 5].forEach((tick) => element("line", { x1: x(tick), x2: x(tick), y1: 500, y2: 506, class: "dm-axis" }));
  element("line", { x1: 183, x2: 183, y1: plot.top, y2: plot.bottom, class: "dm-strip-divider" });
  element("path", { d: "M96 46V500H173 M196 500H866 M176 506l8 -12 M184 506l8 -12", class: "dm-axis", fill: "none" });
  element("text", { x: plot.zero, y: 526, "text-anchor": "middle", class: "dm-tick" }, "≈0");
  element("text", { x: plot.zero, y: 547, "text-anchor": "middle", class: "dm-axis-note" }, "separate strip");
  element("text", { x: 32, y: 273, transform: "rotate(-90 32 273)", "text-anchor": "middle", class: "dm-axis-title" }, "Elongation (%)");
  element("text", { x: 542, y: 566, "text-anchor": "middle", class: "dm-axis-title" }, "Band gap (eV)");
  element("text", { x: 542, y: 589, "text-anchor": "middle", class: "dm-axis-note" }, "0.08–10 eV · logarithmic scale");
  element("text", { x: 223, y: 479, class: "dm-axis-note" }, "Narrow gap");
  element("text", { x: 855, y: 479, "text-anchor": "end", class: "dm-axis-note" }, "Wide gap");
  element("path", { d: "M310 474H785m-5 -4 5 4 -5 4", fill: "none", class: "dm-direction" });
  element("text", { x: 462, y: 276, "text-anchor": "middle", class: "dm-region-label", fill: groups.get("ductile").color, "data-dm-region": "ductile" }, "Ductile inorganic materials");
  element("text", { x: 380, y: 360, "text-anchor": "middle", class: "dm-region-label", fill: groups.get("semiconductor").color, "data-dm-region": "semiconductor" }, "Brittle semiconductors");
  element("text", { x: 791, y: 308, "text-anchor": "middle", class: "dm-region-label", fill: groups.get("ceramic").color, "data-dm-region": "ceramic" }, "Brittle ceramics");

  function inspect(point, preview = false) {
    $("panel").style.setProperty("--dm-accent", point ? groups.get(point.group).color : "#727d78");
    $("state").textContent = preview ? "Preview · click to select" : "Selected material";
    $("name").textContent = point ? point.label : "No category selected";
    $("group").textContent = point ? `${groups.get(point.group).label}${point.example ? ` · example ${point.example}` : ""}` : "Choose a category above to restore its points.";
    $("gap").textContent = point ? gapLabel(point) : "—";
    $("elongation").textContent = point ? strainLabel(point) : "—";
    $("point-note").textContent = point ? point.note || (point.example ? "Separate examples read from the schematic; exact compositions and test conditions await confirmation." : "Approximate position read from the supplied schematic; test conditions await confirmation.") : "";
    marks.forEach((mark, id) => mark.classList.toggle("is-preview", preview && point?.id === id));
  }

  function selectPoint(point, announce = true, reveal = false) {
    selected = point?.id || null;
    marks.forEach((mark, id) => {
      mark.classList.toggle("is-selected", id === selected);
      mark.setAttribute("aria-pressed", String(id === selected));
    });
    $("select").value = selected || "";
    inspect(point);
    if (announce) $("live").textContent = point ? description(point) : "No materials shown.";
    if (reveal && point) {
      const frame = $("scroll");
      const scale = svg.getBoundingClientRect().width / 900;
      frame.scrollTo({ left: Math.max(0, x(point.bandGapEv) * scale - frame.clientWidth / 2), behavior: "instant" });
    }
  }

  data.points.forEach((point) => {
    const group = groups.get(point.group);
    const px = x(point.bandGapEv), py = y(point.elongationPercent);
    const mark = element("g", { class: "dm-point", transform: `translate(${px} ${py})`, tabindex: 0, role: "button", "aria-label": description(point), "aria-pressed": "false", "data-point-id": point.id, style: `--dm-color:${group.color}` });
    // Keep adjacent Fe/Cu targets from covering each other's visible centers.
    element("circle", { r: point.bandGapEv === null ? 8 : 13, class: "dm-hit" }, undefined, mark);
    element("circle", { r: 10, class: "dm-point-ring" }, undefined, mark);
    element("circle", { r: 5.7, class: "dm-point-dot" }, undefined, mark);
    if (point.labelOffset) {
      element("text", { x: point.labelOffset[0], y: point.labelOffset[1], "text-anchor": point.labelAnchor || "start", class: "dm-point-label", "aria-hidden": "true" }, point.shortLabel || point.label, mark);
    }
    mark.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") inspect(point, point.id !== selected); });
    mark.addEventListener("pointerleave", () => inspect(data.points.find((p) => p.id === selected)));
    mark.addEventListener("focus", () => inspect(point, point.id !== selected));
    mark.addEventListener("blur", () => inspect(data.points.find((p) => p.id === selected)));
    mark.addEventListener("click", () => selectPoint(point));
    mark.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectPoint(point); }
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const points = visible();
        const step = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1;
        const next = points[(points.indexOf(point) + step + points.length) % points.length];
        marks.get(next.id).focus();
      }
    });
    marks.set(point.id, mark);

    const option = document.createElement("option");
    option.value = point.id; option.textContent = name(point);
    $("select").append(option); options.set(point.id, option);
    const row = document.createElement("tr");
    [name(point), group.label, gapLabel(point), strainLabel(point)].forEach((text) => {
      const cell = document.createElement("td"); cell.textContent = text; row.append(cell);
    });
    $("table").append(row); rows.set(point.id, row);
  });

  function applyFilters() {
    data.points.forEach((point) => {
      const show = enabled.has(point.group);
      marks.get(point.id).classList.toggle("is-hidden", !show);
      marks.get(point.id).setAttribute("tabindex", show ? "0" : "-1");
      options.get(point.id).disabled = !show;
      options.get(point.id).hidden = !show;
      rows.get(point.id).hidden = !show;
    });
    root.querySelectorAll("[data-dm-region]").forEach((region) => region.classList.toggle("is-hidden", !enabled.has(region.dataset.dmRegion)));
    root.querySelectorAll("[data-dm-filter]").forEach((button) => button.setAttribute("aria-pressed", String(enabled.has(button.dataset.dmFilter))));
    const points = visible();
    $("count").textContent = `${points.length} / ${data.points.length} points shown`;
    $("empty").hidden = Boolean(points.length);
    $("select").disabled = !points.length;
    selectPoint(points.find((point) => point.id === selected) || points[0]);
  }

  data.groups.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button"; button.dataset.dmFilter = group.id;
    button.style.setProperty("--dm-color", group.color);
    button.setAttribute("aria-pressed", "true");
    const dot = document.createElement("span"); dot.className = "dm-filter-dot"; dot.setAttribute("aria-hidden", "true");
    button.append(dot, group.label);
    button.addEventListener("click", () => { enabled.has(group.id) ? enabled.delete(group.id) : enabled.add(group.id); applyFilters(); });
    $("filters").append(button);
  });
  $("select").addEventListener("change", (event) => selectPoint(data.points.find((point) => point.id === event.target.value), true, true));
  $("labels").addEventListener("change", (event) => root.classList.toggle("dm-hide-labels", !event.target.checked));
  $("reset").addEventListener("click", () => {
    groups.forEach((_, id) => enabled.add(id));
    selected = initialSelection;
    $("labels").checked = true; root.classList.remove("dm-hide-labels");
    applyFilters(); $("scroll").scrollLeft = 0;
  });
  $("download").addEventListener("click", () => {
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [["material", "example", "category", "band_gap_eV", "elongation_percent", "gap_placement", "status", "source"], ...data.points.map((p) => [p.label, p.example || "", groups.get(p.group).label, p.bandGapEv, p.elongationPercent, p.bandGapEv === null ? "near-zero strip; exact gap unverified" : "logarithmic axis", data.provisional ? "provisional_image_estimate" : "confirmed", data.source])].map((row) => row.map(quote).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "band-gap-elongation-provisional.csv";
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  applyFilters();
})();
