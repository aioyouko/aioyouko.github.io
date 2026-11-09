(() => {
  const demo = document.querySelector("[data-flex-demo]");
  if (!demo) return;

  const find = (name) => demo.querySelector(`[data-flex-${name}]`);
  const slider = demo.querySelector("#flex-thickness");
  const radiusInputs = [...demo.querySelectorAll('input[name="flex-radius"]')];
  const presets = [...demo.querySelectorAll("[data-flex-preset]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svgNS = "http://www.w3.org/2000/svg";
  // A deliberately illustrative fracture strain, not a fitted silicon property.
  const failureStrain = 0.005;
  const referenceThickness = 500; // μm; fixed width, E, and Poisson ratio.
  let thickness = Number(slider.value);
  let radius = 10; // mm at the neutral plane.
  let loaded = true;
  let fractured = false;
  let frame = 0;
  let announcementTimer;
  let drawn = { curvature: 1 / radius, thickness, separation: 0 };

  function svgElement(tag, attributes = {}, content = "") {
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (content) node.textContent = content;
    return node;
  }

  function path(points, close = false) {
    return points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(" ") + (close ? " Z" : "");
  }

  function draw({ curvature, thickness: visualThickness, separation }) {
    const sheet = find("sheet");
    const guide = find("guide");
    const annotations = find("annotations");
    sheet.replaceChildren();
    guide.replaceChildren();
    annotations.replaceChildren();
    const halfLength = 12; // mm, giving a constant 24-mm neutral-plane length.
    const scale = 14;
    const h = 2.8 + visualThickness * 0.035; // Exaggerated for legibility.
    const k = Math.max(0, curvature);
    const lifted = Math.min(1, k / 0.1);
    const baseY = 252 - lifted * 79;
    const point = (s, w = 0, bottom = false, side = 0) => {
      const x = k > 0.00001 ? Math.sin(s * k) / k : s;
      const y = k > 0.00001 ? (1 - Math.cos(s * k)) / k : 0;
      // Oblique projection of a ribbon; the displayed h is exaggerated.
      return [310 + x * scale + w * 67 + side * separation * 17,
        baseY + y * scale - w * 76 + (bottom ? h : 0) + (side === 1 ? separation * 9 : 0)];
    };
    const samples = (start, end, w, bottom, side) => Array.from({ length: 49 }, (_, index) => point(start + (end - start) * index / 48, w, bottom, side));
    const ranges = separation > 0.005 ? [[-halfLength, -0.16, -1], [0.16, halfLength, 1]] : [[-halfLength, halfLength, 0]];

    ranges.forEach(([start, end, side]) => {
      const front = samples(start, end, 0, false, side);
      const back = samples(start, end, 1, false, side);
      const lowerFront = samples(start, end, 0, true, side);
      sheet.append(svgElement("path", { d: path([...front, ...lowerFront.slice().reverse()], true), fill: "url(#flex-edge)", stroke: "#657c92", "stroke-width": 0.75 }));
      sheet.append(svgElement("path", { d: path([point(end, 0, false, side), point(end, 1, false, side), point(end, 1, true, side), point(end, 0, true, side)], true), fill: "#455975", stroke: "#657c92", "stroke-width": 0.75 }));
      sheet.append(svgElement("path", { d: path([...front, ...back.slice().reverse()], true), fill: "url(#flex-silicon)", stroke: "#344e6b", "stroke-width": 1 }));
      for (let w = 0.2; w < 1; w += 0.2) {
        sheet.append(svgElement("path", { d: path(samples(start, end, w, false, side)), fill: "none", stroke: "#c3d7df", "stroke-opacity": 0.28, "stroke-width": 0.75 }));
      }
      for (let s = -10; s <= 10; s += 2) {
        if (s <= start || s >= end) continue;
        sheet.append(svgElement("path", { d: path([point(s, 0, false, side), point(s, 1, false, side)]), stroke: "#c3d7df", "stroke-opacity": 0.23, "stroke-width": 0.75 }));
      }
      sheet.append(svgElement("path", { d: path(front), fill: "none", stroke: separation > 0.005 ? "#bd7966" : "#8dc2b5", "stroke-width": 2 }));
      if (side) {
        const cut = side < 0 ? end : start;
        const edge = [point(cut, 0, false, side), point(cut, 1, false, side), point(cut, 1, true, side), point(cut, 0, true, side)];
        sheet.append(svgElement("path", { d: path(edge, true), fill: "#d5a991", stroke: "#9b5d4b", "stroke-width": 1 }));
      }
    });

    if (separation < 0.05 && k > 0.035) {
      const a = point(0, 0);
      // Radius follows the neutral plane, half-way through the drawn front edge.
      const center = [a[0], a[1] + h / 2 + scale / k];
      // For gentle curvature the circle center is outside the drawing. Do not
      // extend a fictitious radius into the caption or adjacent controls.
      if (center[1] < 351) {
        guide.append(svgElement("path", { d: path([[a[0], a[1] + h / 2], center]) }));
        guide.append(svgElement("circle", { cx: center[0], cy: center[1], r: 3, fill: "#6c8b89", stroke: "none" }));
        annotations.append(svgElement("text", { x: a[0] + 12, y: a[1] + h / 2 + Math.min(64, scale / k / 2), "font-style": "italic" }, "R"));
      }
    }

    const annotation = (text, labelX, labelY, target, anchor = "start", color = "#496369") => {
      const elbow = anchor === "end" ? labelX - 18 : labelX + 18;
      annotations.append(svgElement("path", { d: path([[elbow, labelY + 9], [elbow, labelY + 25], target]), fill: "none", stroke: "#98aaa9", "stroke-width": 1 }));
      annotations.append(svgElement("circle", { cx: target[0], cy: target[1], r: 2.5, fill: color }));
      annotations.append(svgElement("text", { x: labelX, y: labelY, "text-anchor": anchor }, text));
    };
    if (separation > 0.05) {
      const atLimit = demo.dataset.state === "limit";
      annotation(atLimit ? "Failure at target R" : "Fracture before target R", 50, 49, point(-0.16, 0.5, false, -1), "start", "#a34630");
      annotations.append(svgElement("text", { x: 350, y: 385, "text-anchor": "middle", class: "flex-svg-label" }, loaded ? atLimit ? "Failure shown schematically · assumed strain limit reached" : "Failure shown schematically · required curvature exceeds the limit" : "Unloaded fragments · fracture is irreversible"));
    } else if (k > 0.005) {
      annotation("Elastic bending", 52, 48, point(-4, 0.7));
      annotation(`h = ${thickness} μm`, 640, 104, point(halfLength, 0, true), "end");
      annotations.append(svgElement("text", { x: 350, y: 385, "text-anchor": "middle", class: "flex-svg-label" }, "Outer surface in tension · inner surface in compression"));
    } else {
      annotation("Original shape recovered", 52, 75, point(-5, 0.7));
      annotation(`h = ${thickness} μm`, 640, 130, point(halfLength, 0, true), "end");
      annotations.append(svgElement("text", { x: 350, y: 385, "text-anchor": "middle", class: "flex-svg-label" }, "Unloaded · zero bending strain · no permanent deformation"));
    }
  }

  function animate(target) {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) {
      drawn = target;
      draw(drawn);
      return;
    }
    const from = { ...drawn };
    const start = performance.now();
    function step(now) {
      const progress = Math.min(1, (now - start) / 380);
      const eased = 1 - (1 - progress) ** 3;
      drawn = Object.fromEntries(Object.keys(target).map((key) => [key, from[key] + (target[key] - from[key]) * eased]));
      draw(drawn);
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
  }

  function update({ newSpecimen = false, immediate = false, announce = true } = {}) {
    const strain = (thickness / 1000) / (2 * radius);
    const critical = 2 * radius * failureStrain * 1000;
    const minRadius = thickness / 1000 / (2 * failureStrain);
    const atLimit = Math.abs(strain - failureStrain) < 1e-9;
    if (newSpecimen) fractured = false;
    if (loaded && strain >= failureStrain - 1e-9) fractured = true;
    const state = fractured ? (atLimit && loaded ? "limit" : "fracture") : loaded ? "elastic" : "released";
    demo.dataset.state = state;
    const status = fractured ? (atLimit && loaded ? "At failure limit" : "Fractured") : loaded ? "Elastic bending" : "Shape recovered";
    find("state").textContent = status;
    find("thickness-output").replaceChildren(document.createTextNode(`${thickness} `), Object.assign(document.createElement("span"), { textContent: "μm" }));
    slider.setAttribute("aria-valuetext", `${thickness} micrometres`);
    // Resolve adjacent 1-μm slider values around the failure boundary.
    const strainText = (strain * 100).toFixed(3);
    find("strain").textContent = `${strainText}%`;
    // The marker is fixed at the failure strain; the bar clips at 2× this limit.
    find("strain-bar").style.width = `${Math.min(100, strain / failureStrain * 50)}%`;
    find("critical").textContent = critical.toFixed(0);
    const fraction = (critical - Number(slider.min)) / (Number(slider.max) - Number(slider.min));
    demo.style.setProperty("--flex-critical", `${fraction * 100}%`);
    demo.style.setProperty("--flex-critical-fraction", fraction);
    find("min-radius").textContent = minRadius.toFixed(1);
    const rigidity = (thickness / referenceThickness) ** 3;
    find("rigidity").textContent = rigidity < 0.001 ? rigidity.toFixed(5) : rigidity < 0.01 ? rigidity.toFixed(4) : rigidity.toFixed(3);
    presets.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.flexPreset) === thickness)));
    find("load").setAttribute("aria-pressed", String(loaded));
    find("load").replaceChildren(Object.assign(document.createElement("span"), { textContent: loaded ? "↗" : "↘" }), document.createTextNode(loaded ? " Release sample" : " Apply bending"));
    find("load").firstChild.setAttribute("aria-hidden", "true");
    const caption = fractured
      ? loaded
        ? atLimit ? "The assumed failure limit is reached at the target radius." : "Too thick for this radius: fracture occurs before the target bend."
        : "Unloading does not heal a fracture. Adjust thickness or radius for a new specimen."
      : loaded ? "Thin enough to reach the target radius and recover on release." : "The sheet returns to its original shape. Its deformation was elastic.";
    find("caption").textContent = caption;
    document.querySelector("#flex-svg-desc").textContent = `${thickness} micrometre silicon sheet. ${caption} Required strain at a ${radius} millimetre radius: ${strainText} percent; illustrative failure strain: 0.50 percent.`;
    if (announce) {
      clearTimeout(announcementTimer);
      announcementTimer = setTimeout(() => { find("live").textContent = `${thickness} micrometres. ${status}. Target strain ${strainText} percent. Critical thickness ${critical.toFixed(0)} micrometres.`; }, 200);
    }
    const target = {
      curvature: loaded ? 1 / Math.max(radius, minRadius) : 0,
      thickness,
      separation: fractured ? 1 : 0,
    };
    if (newSpecimen) drawn.separation = target.separation;
    if (immediate) { cancelAnimationFrame(frame); drawn = target; draw(drawn); }
    else animate(target);
  }

  slider.addEventListener("input", () => {
    thickness = Number(slider.value);
    update({ newSpecimen: true, immediate: true });
  });
  presets.forEach((button) => button.addEventListener("click", () => {
    thickness = Number(button.dataset.flexPreset);
    slider.value = thickness;
    update({ newSpecimen: true });
  }));
  radiusInputs.forEach((input) => input.addEventListener("change", () => {
    radius = Number(input.value);
    update({ newSpecimen: true });
  }));
  find("load").addEventListener("click", () => { loaded = !loaded; update(); });
  find("reset").addEventListener("click", () => {
    thickness = 60;
    radius = 10;
    loaded = true;
    slider.value = thickness;
    radiusInputs.forEach((input) => { input.checked = Number(input.value) === radius; });
    update({ newSpecimen: true });
  });
  update({ immediate: true, announce: false });
})();
