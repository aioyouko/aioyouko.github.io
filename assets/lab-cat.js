/* Lab cat: a small pixel-art version of the site's cat (glasses, blue lanyard, ID badge)
 * that lives in the Agent Workspace console. workspace.js sets its state:
 *   idle   – sits and blinks
 *   coding – paws on the laptop while a command is typed
 *   synth  – drips reagent into a flask over a burner while the command runs
 *   done   – happy eyes and sparkles when the figure lands
 * Sprites are drawn from the text grids below; one character = one pixel. */
(() => {
  "use strict";

  const P = {
    k: "#24242b", g: "#72727c", d: "#57525e", l: "#a3a3ad", p: "#5d4b51",
    s: "#d3d6db", n: "#4b3529", e: "#e6a33c", b: "#3047a8", w: "#f1f3f5", x: "#8b9098",
    m: "#b2bac4", L: "#4b525c", c: "#4fb8a8",
    o: "#bfe3dc", f: "#f39a3c", F: "#ffd166", M: "#8d96a0", r: "#d0644a",
    t: "#b78b5f", T: "#94704a", y: "#f6c94f",
  };

  // Cat, 22 × 22, top-left at (0, 0).
  const CAT = [
    "...k..............k...",
    "..kgk............kgk..",
    "..kgdk..........kdgk..",
    "..kgddkkkkkkkkkkddgk..",
    "..kggggggggggggggggk..",
    ".kggggggggggggggggggk.",
    ".kgssssssssssssssssgk.",
    ".kgsnnnnsggggsnnnnsgk.",
    ".kgsnnnnsggggsnnnnsgk.",
    ".kgssssssggggssssssgk.",
    ".kggggggllppllggggggk.",
    ".kgggggllllllllgggggk.",
    ".kgggggggllllgggggggk.",
    "..kggggggggggggggggk..",
    ".kggbggggggggggggbggk.",
    ".kggggbggggggggbggggk.",
    ".kggggggbggggbggggggk.",
    ".kggggggggkkggggggggk.",
    ".kgggggggwwwwgggggggk.",
    ".kgggggggwxxwgggggggk.",
    ".kgggggggwwwwgggggggk.",
    ".kggggggggggggggggggk.",
  ];
  const EYES_OPEN = [[5, 8], [6, 8], [15, 8], [16, 8]];
  const EYES_HAPPY = [[4, 8], [5, 7], [6, 7], [7, 8], [14, 8], [15, 7], [16, 7], [17, 8]];

  // Laptop lid seen from behind, in front of the cat.
  const LAPTOP = { x: 3, y: 18, rows: [
    "mmmmmmmmmmmmmmmm",
    "LLLLLLLLLLLLLLLL",
    "LLLLLLLccLLLLLLL",
    "LLLLLLLLLLLLLLLL",
  ] };
  const PAW_L = { x: 4, y: 16, rows: ["klllk", ".lll."] };
  const PAW_R = { x: 13, y: 16, rows: ["klllk", ".lll."] };

  // Chemistry bench to the right of the cat.
  const ARM = { x: 20, y: 5, rows: ["kkkkkkk..", "gggggglll", "kkkkkkklk"] };
  const DROPPER = { x: 27, y: 2, rows: [".rrr.", ".rrr.", "..o..", "..o..", "..o.."] };
  const FLASK = { x: 26, y: 9, rows: [
    "..ooo..",
    "..o.o..",
    "..o.o..",
    ".o...o.",
    "oqqqqqo",
    "oqqqqqo",
    "ooooooo",
  ] };
  const BURNER = { x: 26, y: 18, rows: [".MMMMM.", "..MMM..", ".MMMMM.", "MMMMMMM"] };
  const FLAME = { x: 27, y: 16, rows: ["..f..", ".fFf."] };

  // Desk across the whole scene.
  const DESK = { x: 0, y: 22, rows: ["t".repeat(40), "T".repeat(40)] };

  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };

  // Draw a sprite, merging horizontal runs of one colour into a single rect.
  function sprite(def, cls) {
    const group = el("g", cls ? { class: cls } : {});
    def.rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        if (ch === ".") { x += 1; continue; }
        let end = x + 1;
        while (end < row.length && row[end] === ch) end += 1;
        const rect = el("rect", { x: def.x + x, y: def.y + y, width: end - x, height: 1 });
        if (ch === "q") rect.setAttribute("class", "lc-liquid");
        else rect.setAttribute("fill", P[ch]);
        group.appendChild(rect);
        x = end;
      }
    });
    return group;
  }

  function pixels(list, color, cls) {
    const group = el("g", { class: cls });
    list.forEach(([x, y]) => group.appendChild(el("rect", { x, y, width: 1, height: 1, fill: color })));
    return group;
  }

  function build() {
    const svg = el("svg", { viewBox: "0 0 40 24", "shape-rendering": "crispEdges", "aria-hidden": "true", focusable: "false" });
    svg.appendChild(sprite(DESK));
    // Chemistry bench (synth + done)
    const bench = el("g", { class: "lc-bench" });
    bench.appendChild(sprite(BURNER));
    bench.appendChild(sprite(FLAME, "lc-flame"));
    bench.appendChild(sprite(FLASK));
    const bubbles = el("g", { class: "lc-bubbles" });
    [[28, 13, 0], [30, 13, 0.35], [29, 14, 0.7]].forEach(([x, y, delay]) => {
      bubbles.appendChild(el("rect", { x, y, width: 1, height: 1, fill: "#e8fffb", style: `animation-delay:${delay}s` }));
    });
    bench.appendChild(bubbles);
    const steam = el("g", { class: "lc-steam" });
    [[28, 7, 0], [30, 6, 0.6]].forEach(([x, y, delay]) => {
      steam.appendChild(el("rect", { x, y, width: 1, height: 1, fill: "#cfe3df", style: `animation-delay:${delay}s` }));
    });
    bench.appendChild(steam);
    svg.appendChild(bench);
    // Cat
    svg.appendChild(sprite({ x: 0, y: 0, rows: CAT }, "lc-cat"));
    svg.appendChild(pixels(EYES_OPEN, P.e, "lc-eyes"));
    svg.appendChild(pixels(EYES_HAPPY, P.e, "lc-eyes-happy"));
    // Synthesis: arm, dropper and a falling drop
    const lab = el("g", { class: "lc-lab" });
    lab.appendChild(sprite(ARM));
    lab.appendChild(sprite(DROPPER));
    lab.appendChild(el("rect", { class: "lc-drop", x: 29, y: 7, width: 1, height: 1, fill: P.r }));
    svg.appendChild(lab);
    // Coding: laptop and paws
    const desk = el("g", { class: "lc-laptop" });
    desk.appendChild(sprite(PAW_L, "lc-paw lc-paw-l"));
    desk.appendChild(sprite(PAW_R, "lc-paw lc-paw-r"));
    desk.appendChild(sprite(LAPTOP));
    svg.appendChild(desk);
    // Done: sparkles
    const spark = el("g", { class: "lc-sparkles" });
    [[24, 3], [37, 8], [33, 1]].forEach(([x, y], i) => {
      const s = el("g", { style: `animation-delay:${i * 0.25}s` });
      [[x, y - 1], [x - 1, y], [x, y], [x + 1, y], [x, y + 1]].forEach(([px, py]) => s.appendChild(el("rect", { x: px, y: py, width: 1, height: 1, fill: P.y })));
      spark.appendChild(s);
    });
    svg.appendChild(spark);
    return svg;
  }

  const STATUS = {
    idle: "Waiting for the next experiment",
    coding: "Coding",
    synth: "Synthesizing",
    done: "Figure ready",
  };
  const GLYPHS = ["✢", "✳", "✶", "✻", "✽", "✻", "✶", "✳"];

  function mount(host) {
    const root = document.createElement("div");
    root.className = "lab-cat is-idle";
    root.appendChild(build());
    const label = document.createElement("p");
    label.className = "lab-cat-status";
    label.innerHTML = '<span class="lab-cat-glyph" aria-hidden="true">✢</span><span class="lab-cat-text"></span>';
    root.appendChild(label);
    host.appendChild(root);

    const glyph = label.querySelector(".lab-cat-glyph");
    const text = label.querySelector(".lab-cat-text");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let state = "idle";
    let tick = 0;

    function set(next, detail) {
      state = next;
      root.className = `lab-cat is-${next}`;
      text.textContent = detail ? `${STATUS[next]} · ${detail}` : STATUS[next];
    }
    set("idle");

    if (!reduce) {
      // Spinner glyph while working, slow blink otherwise.
      setInterval(() => {
        tick += 1;
        if (state === "coding" || state === "synth") glyph.textContent = GLYPHS[tick % GLYPHS.length];
        else glyph.textContent = state === "done" ? "✓" : "✢";
      }, 140);
      const blink = () => {
        if (state === "idle" || state === "coding") {
          root.classList.add("is-blink");
          setTimeout(() => root.classList.remove("is-blink"), 150);
        }
        setTimeout(blink, 2600 + Math.random() * 2600);
      };
      setTimeout(blink, 1800);
    }
    return { set };
  }

  window.LabCat = { mount };
})();
