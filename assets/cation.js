/* Cat'ion: a lab-cat companion for the homepage.
   - Sits in the bottom-right corner; each click plays the next reaction.
   - Every so often it thinks about a crystal, throws a wafer, or types an ASE line.
   - On each view change (the "pageviewchange" event from main.js) it hops across or
     peeks up with a sign naming the new page, and changes into a random lab coat.
   - A second cat perches on the section heading being read. It thinks about a crystal on
     the materials pages, types on the Agent Workspace page and does a random action
     elsewhere. A data-cation="think|type|toss" attribute on a heading or its page overrides that.
   - Styles live in assets/cation.css. Hiding it is remembered under "cation-hidden". */
(() => {
  if (window.__cation) return;
  window.__cation = true;

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const pick = (list) => list[(Math.random() * list.length) | 0];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };
  // A quick page change or move cancels pending animations; that rejection is expected.
  const quiet = (err) => { if (!err || err.name !== "AbortError") throw err; };

  /* ---------- drawing ---------- */
  document.body.insertAdjacentHTML("beforeend",
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    '<pattern id="cnCoatLattice" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#ffffff"/>' +
    '<circle cx="2" cy="2" r="1.15" fill="#8fa6d2"/><circle cx="6" cy="6" r="1.15" fill="#8fa6d2"/></pattern></defs></svg>');

  const eye = (cx, side) =>
    `<g class="eye eye-${side}"><ellipse class="iris" cx="${cx}" cy="84" rx="5.5" ry="8.5"/>` +
    `<g class="pupil"><ellipse class="pup" cx="${cx}" cy="85" rx="3" ry="6"/><circle class="shine" cx="${cx + 1.6}" cy="80.5" r="1.8"/></g></g>`;

  function keyboard() {
    let s = '<g class="kbd"><path class="kbd-base" d="M48 154 L152 154 L164 182 L36 182 Z"/>';
    for (let r = 0; r < 3; r++) {
      const y0 = 157.5 + r * 8, t = (y0 - 154) / 28;
      const xl = 48 - 12 * t + 4, xr = 152 + 12 * t - 4, n = 11, g = 1.6, kw = (xr - xl - (n - 1) * g) / n;
      for (let i = 0; i < n; i++) s += `<rect class="key" x="${(xl + i * (kw + g)).toFixed(1)}" y="${y0.toFixed(1)}" width="${kw.toFixed(1)}" height="6" rx="1.2"/>`;
    }
    return s + "</g>";
  }
  const KBD = keyboard();

  function signSVG(label) {
    const words = label.split(" ");
    let lines = [label];
    if (label.length > 11 && words.length > 1) {
      let best = 1, worst = Infinity;
      for (let i = 1; i < words.length; i++) {
        const w = Math.max(words.slice(0, i).join(" ").length, words.slice(i).join(" ").length);
        if (w < worst) { worst = w; best = i; }
      }
      lines = [words.slice(0, best).join(" "), words.slice(best).join(" ")];
    }
    const two = lines.length > 1, ys = two ? [166, 181] : [175];
    const text = lines.map((l, i) =>
      `<text x="100" y="${ys[i]}" text-anchor="middle"${two ? ' style="font-size:13.5px"' : ""}${l.length > 13 ? ' textLength="104" lengthAdjust="spacingAndGlyphs"' : ""}>${esc(l)}</text>`).join("");
    return `<g class="sign"><rect x="42" y="150" width="116" height="40" rx="8"/>${text}</g>`;
  }

  function catSVG(cls = "", extra = KBD) {
    return `<svg class="cn-cat ${cls}" viewBox="0 0 200 210" aria-hidden="true" focusable="false">
  <g class="tail"><path class="tail-o" d="M120 172 C 150 182, 166 172, 162 156 C 160 147, 166 142, 171 147"/><path class="tail-f" d="M120 172 C 150 182, 166 172, 162 156 C 160 147, 166 142, 171 147"/></g>
  <g class="hind hind-l"><rect class="fur" x="82" y="166" width="14" height="36" rx="7"/><ellipse class="shoe" cx="87" cy="202" rx="11" ry="6"/><path class="sole" d="M76.5 203.5 Q87 209 97.5 203.5"/><path class="lace" d="M84 199 h6"/></g>
  <g class="hind hind-r"><rect class="fur" x="104" y="166" width="14" height="36" rx="7"/><ellipse class="shoe" cx="113" cy="202" rx="11" ry="6"/><path class="sole" d="M102.5 203.5 Q113 209 123.5 203.5"/><path class="lace" d="M110 199 h6"/></g>
  <g class="cat-body">
    <g class="ear ear-l"><path class="fur" d="M54 80 L52 24 Q54 17 61 21 L93 55 Z"/><path class="inner" d="M60 66 L59 34 L84 55 Z"/></g>
    <g class="ear ear-r"><path class="fur" d="M146 80 L148 24 Q146 17 139 21 L107 55 Z"/><path class="inner" d="M140 66 L141 34 L116 55 Z"/></g>
    <path class="fur" d="M58 62 C 72 46, 128 46, 142 62 C 150 70, 152 82, 152 92 L 160 100 L 150 103 L 156 110 L 138 112 C 130 116, 124 118, 122 122 C 128 128, 130 140, 128 158 C 127 168, 126 174, 124 178 C 112 183, 88 183, 76 178 C 74 174, 73 168, 72 158 C 70 140, 72 128, 78 122 C 76 118, 70 116, 62 112 L 44 110 L 50 103 L 40 100 L 48 92 C 48 82, 50 70, 58 62 Z"/>
    <ellipse class="belly" cx="100" cy="150" rx="18" ry="20"/>
    <path class="collar" d="M78 117 Q100 127 122 117"/><circle class="tagc" cx="100" cy="122" r="4"/>
    <g class="coat">
      <path class="coat-fill" d="M90 118 L100 146 L110 118 C 116 118, 121 119, 124 122 C 131 128, 133 140, 132 158 L134 180 C 116 186, 84 186, 66 180 L68 158 C 67 140, 69 128, 76 122 C 79 119, 84 118, 90 118 Z"/>
      <path class="coat-line" d="M90 118 L86 134 L98 142 M110 118 L114 134 L102 142 M100 146 V184"/>
      <circle class="coat-btn" cx="100" cy="156" r="2"/><circle class="coat-btn" cx="100" cy="169" r="2"/>
      <path class="pen-a" d="M111.5 140 V150"/><path class="pen-b" d="M116 142 V150"/>
      <rect class="coat-fill pocket" x="108" y="145" width="12" height="9" rx="2"/>
    </g>
  </g>
  <g class="head">
    <ellipse class="muzzle" cx="100" cy="96" rx="15" ry="9"/>
    <ellipse class="blush" cx="66" cy="96" rx="5.5" ry="3"/><ellipse class="blush" cx="134" cy="96" rx="5.5" ry="3"/>
    ${eye(76, "l")}${eye(124, "r")}
    <path class="shut" d="M70 85 q6 -6 12 0 M118 85 q6 -6 12 0"/>
    <path class="nose" d="M96.5 89 h7 l-3.5 4 z"/>
    <path class="mouth" d="M93 95 q3.5 4 7 0 q3.5 4 7 0"/>
    <ellipse class="mouth-open" cx="100" cy="99" rx="4" ry="5"/>
    <path class="whisk" d="M62 92 L52 91 M62 97 L53 99 M138 92 L148 91 M138 97 L147 99"/>
  </g>
  ${extra}
  <g class="paw paw-l"><circle class="fur" cx="68" cy="163" r="6"/><ellipse class="coat-fill" cx="73" cy="142" rx="7.5" ry="17" transform="rotate(12 73 142)"/></g>
  <g class="paw paw-r"><circle class="fur" cx="132" cy="163" r="6"/><ellipse class="coat-fill" cx="127" cy="142" rx="7.5" ry="17" transform="rotate(-12 127 142)"/></g>
</svg>`;
  }

  /* ---------- lab coats ---------- */
  const COATS = [
    { id: "white", fill: "#ffffff" },
    { id: "clean", fill: "#cfe2f6" },
    { id: "amber", fill: "#f7d27c" },
    { id: "mint", fill: "#cdebdd" },
    { id: "lattice", fill: "url(#cnCoatLattice) #ffffff" },
  ];
  function dress(svg, not) {
    const coat = pick(COATS.filter((c) => c.id !== not));
    svg.style.setProperty("--cn-coat", coat.fill);
    svg.dataset.coat = coat.id;
  }

  /* ---------- crystal geometry (shared by both cats) ---------- */
  const LAT = {
    si: { cap: "Si · 5.431 Å", size: 0.46, r: 9, bw: 3.2, base: "#7488ae", hi: "#e6edf8", base2: "#5c73a0" },
    c: { cap: "diamond · 3.567 Å", size: 0.46 * 3.567 / 5.431, r: 6.5, bw: 2.6, base: "#5fc3d3", hi: "#ffffff", base2: "#46aec0" },
    gr: { cap: "graphene · 2.46 Å", size: 0.8, r: 6, bw: 2.6, base: "#4a5262", hi: "#bac2cf", base2: "#4a5262" },
  };
  function diamondCubic() {
    const pts = [];
    for (let x = 0; x <= 2; x++) for (let y = 0; y <= 2; y++) for (let z = 0; z <= 2; z++)
      if ((x + y + z) % 2 === 0) pts.push({ p: [x / 2 - 0.5, y / 2 - 0.5, z / 2 - 0.5], sub: 0 });
    [[0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]].forEach((q) => pts.push({ p: q.map((v) => v - 0.5), sub: 1 }));
    const bonds = [], L = Math.sqrt(3) / 4;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i].p, b = pts[j].p;
      if (Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - L) < 0.01) bonds.push([i, j]);
    }
    const c = [-0.5, 0.5], corners = [], edges = [];
    c.forEach((x) => c.forEach((y) => c.forEach((z) => corners.push([x, y, z]))));
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++)
      if (corners[i].filter((v, k) => v !== corners[j][k]).length === 1) edges.push([corners[i], corners[j]]);
    return { pts, bonds, edges };
  }
  function honeycomb() {
    const pts = [], a1 = [1.5, Math.sqrt(3) / 2], a2 = [1.5, -Math.sqrt(3) / 2], k = 1 / 6;
    for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
      const A = [i * a1[0] + j * a2[0], i * a1[1] + j * a2[1]];
      [[A[0] - 0.5, A[1]], [A[0] + 0.5, A[1]]].forEach((q) => { if (Math.hypot(q[0], q[1]) < 2.9) pts.push({ p: [q[0] * k, q[1] * k, 0], sub: 0 }); });
    }
    const bonds = [];
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i].p, b = pts[j].p;
      if (Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1]) - k) < 0.005) bonds.push([i, j]);
    }
    return { pts, bonds, edges: null };
  }
  const DC = diamondCubic(), GEOM = { si: DC, c: DC, gr: honeycomb() };

  const ASE_LINES = ['bulk("Si", "diamond", a=5.431)', 'bulk("C", "diamond", a=3.567)', "graphene(a=2.46, vacuum=10)"];
  const WS_LINES = ["python main.py --help", 'db.add(sample, source="lab")', 'plot(df, x="T", y="zT")', "pytest -q  # 128 passed"];

  /* ---------- one cat: markup + every action ----------
     el is the cat's container; bubbles, particles and the wafer are positioned inside it.
     A container with .cn-rightward opens its bubbles and throws to the right. */
  const REACTIONS = ["hop", "mrrp", "purr", "blink", "sneeze"];
  const HOP = [
    { transform: "translateY(0) scale(1,1)" },
    { transform: "translateY(0) scale(1.12,.86)", offset: 0.15 },
    { transform: "translateY(-26%) scale(.93,1.08)", offset: 0.45 },
    { transform: "translateY(0) scale(1.1,.9)", offset: 0.8 },
    { transform: "translateY(0) scale(1,1)" },
  ];
  const WS = 34;
  const tr = (p) => `translate(${(p.x - WS / 2).toFixed(1)}px,${(p.y - WS / 2).toFixed(1)}px)`;

  function makeRig(el, withHide) {
    el.innerHTML =
      '<div class="cn-thought" hidden><canvas></canvas><span class="cn-cap"></span></div>' +
      '<div class="cn-bubble" aria-hidden="true"></div>' +
      '<div class="cn-wafer" hidden><div class="cn-tilt"><div class="cn-disc"></div></div></div>' +
      `<button class="cn-cat-btn" type="button" aria-label="Cat'ion, the lab cat. Click for a reaction.">${catSVG()}</button>` +
      (withHide ? '<button class="cn-hide" type="button" aria-label="Hide the lab cat" title="Hide the lab cat">×</button>' : "");
    const btn = el.querySelector(".cn-cat-btn");
    const cat = btn.querySelector(".cn-cat");
    const bubble = el.querySelector(".cn-bubble");
    const thought = el.querySelector(".cn-thought");
    const cv = thought.querySelector("canvas");
    const ctx = cv.getContext("2d");
    const cap = thought.querySelector(".cn-cap");
    const wafer = el.querySelector(".cn-wafer");
    const disc = el.querySelector(".cn-disc");
    const R = { el, btn, cat, busy: false };
    const rightward = () => el.classList.contains("cn-rightward");
    dress(cat);

    function vb(x, y) {
      const r = cat.getBoundingClientRect(), s = el.getBoundingClientRect();
      return { x: r.left - s.left + (x / 200) * r.width, y: r.top - s.top + (y / 210) * r.height };
    }
    function say(text, ms = 1300, code = false) {
      const p = vb(rightward() ? 90 : 110, 30);
      bubble.style.left = p.x + "px";
      bubble.style.top = p.y + "px";
      bubble.classList.toggle("is-code", code);
      bubble.textContent = text;
      bubble.classList.add("show");
      clearTimeout(bubble._t);
      if (ms) bubble._t = setTimeout(() => bubble.classList.remove("show"), ms);
    }
    function particle(x, y, html, cls, { dx = 0, dy = -50, dur = 1000, delay = 0, rot = 0 } = {}) {
      if (RM) return;
      const p = document.createElement("span");
      p.className = "cn-pt " + cls;
      p.innerHTML = html;
      p.style.left = x + "px";
      p.style.top = y + "px";
      el.appendChild(p);
      const a = p.animate([
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1, offset: 0.2 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.85) rotate(${rot}deg)`, opacity: 0 },
      ], { duration: dur, delay, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" });
      a.onfinish = () => p.remove();
    }
    function flash(cls, ms, delay = 0) {
      setTimeout(() => { cat.classList.add(cls); setTimeout(() => cat.classList.remove(cls), ms); }, delay);
    }
    const part = (sel) => cat.querySelector(sel);

    /* blinking + gaze */
    (function blink() {
      setTimeout(() => {
        cat.classList.add("blink");
        setTimeout(() => cat.classList.remove("blink"), 150);
        blink();
      }, 2200 + Math.random() * 4200);
    })();
    R.gaze = (e) => {
      const r = cat.getBoundingClientRect();
      if (!r.width) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.4);
      const d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 160);
      cat.style.setProperty("--gx", ((dx / d) * 3.4 * m).toFixed(2) + "px");
      cat.style.setProperty("--gy", ((dy / d) * 3.4 * m).toFixed(2) + "px");
    };
    R.clearGaze = () => { cat.style.removeProperty("--gx"); cat.style.removeProperty("--gy"); };

    /* click reactions */
    R.react = function react(id) {
      const head = part(".head");
      if (id === "hop") {
        if (!RM) cat.animate(HOP, { duration: 650, easing: "ease-out" });
        say("hup!", 900);
      } else if (id === "mrrp") {
        if (!RM) {
          part(".ear-r").animate([{ transform: "rotate(0)" }, { transform: "rotate(24deg)", offset: 0.25 }, { transform: "rotate(-6deg)", offset: 0.55 }, { transform: "rotate(0)" }], { duration: 520 });
          head.animate([{ transform: "rotate(0)" }, { transform: "rotate(10deg)", offset: 0.3 }, { transform: "rotate(10deg)", offset: 0.8 }, { transform: "rotate(0)" }], { duration: 1200, easing: "ease-in-out" });
        }
        flash("talk", 380);
        say("mrrp?");
      } else if (id === "purr") {
        if (!RM) cat.animate([{ transform: "translateX(-.6px)" }, { transform: "translateX(.6px)" }], { duration: 70, iterations: 20, direction: "alternate" });
        flash("eyes-shut", 1500);
        for (let i = 0; i < 6; i++) {
          const p = vb(55 + Math.random() * 90, 50 + Math.random() * 50);
          particle(p.x, p.y, "+", "charge", { dx: (Math.random() - 0.5) * 40, dy: -55 - Math.random() * 40, dur: 1300, delay: i * 170 });
        }
        say("prrrrr", 1500);
      } else if (id === "blink") {
        if (!RM) cat.querySelectorAll(".eye").forEach((e) => e.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(.12)", offset: 0.3 }, { transform: "scaleY(.12)", offset: 0.7 }, { transform: "scaleY(1)" }], { duration: 1300, easing: "ease-in-out" }));
        else flash("eyes-shut", 900);
        const p = vb(100, 36);
        particle(p.x, p.y, "♥", "heart", { dy: -40, dur: 1400, delay: 500 });
      } else if (id === "sneeze") {
        flash("eyes-shut", 650, 300);
        if (!RM) head.animate([{ transform: "rotate(0) translateY(0)" }, { transform: "rotate(-7deg) translateY(-5px)", offset: 0.45 }, { transform: "rotate(6deg) translateY(5px)", offset: 0.56 }, { transform: "rotate(0) translateY(0)" }], { duration: 950, easing: "ease-out" });
        setTimeout(() => {
          flash("talk", 220);
          const p = vb(100, 94);
          for (let i = 0; i < 7; i++) {
            const a = Math.PI * (0.1 + 0.8 * Math.random());
            particle(p.x, p.y, "", "dust", { dx: (i % 2 ? -1 : 1) * Math.cos(a) * (25 + Math.random() * 35), dy: Math.sin(a) * 24 + 4, dur: 850 });
          }
        }, 500);
        say("pff-tchoo!", 1400);
      }
    };
    let next = 0;
    btn.addEventListener("click", () => { R.react(REACTIONS[next % REACTIONS.length]); next++; });

    /* action 1: thinking about a crystal */
    function drawLattice(kind, t) {
      const W = cv.clientWidth;
      if (!W) return;
      const d = devicePixelRatio || 1;
      if (cv.width !== Math.round(W * d)) { cv.width = cv.height = Math.round(W * d); }
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const cs = getComputedStyle(el);
      const bond = cs.getPropertyValue("--cn-bond").trim(), edge = cs.getPropertyValue("--cn-atom-edge").trim();
      const S = LAT[kind], G = GEOM[kind], k = W / 200, sc = W * S.size;
      const ry = kind === "gr" ? Math.sin(t * 0.0007) * 0.75 : t * 0.0005, rx = kind === "gr" ? 0.3 + Math.sin(t * 0.0005) * 0.25 : 0.55;
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      const proj = (p) => {
        const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
        const y1 = p[1] * cx - z1 * sx, z2 = p[1] * sx + z1 * cx, f = 1 / (1 - z2 * 0.35);
        return { x: W / 2 + x1 * sc * f, y: W / 2 + y1 * sc * f, z: z2, f };
      };
      ctx.clearRect(0, 0, W, W);
      if (G.edges) {
        ctx.save(); ctx.strokeStyle = bond; ctx.globalAlpha = 0.55; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
        G.edges.forEach(([a, b]) => { const A = proj(a), B = proj(b); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); });
        ctx.restore();
      }
      const P = G.pts.map((a) => proj(a.p));
      ctx.strokeStyle = bond; ctx.lineCap = "round";
      G.bonds.map(([i, j]) => ({ i, j, z: (P[i].z + P[j].z) / 2 })).sort((a, b) => a.z - b.z).forEach(({ i, j }) => {
        ctx.lineWidth = S.bw * k * (P[i].f + P[j].f) / 2;
        ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke();
      });
      P.map((q, i) => ({ ...q, sub: G.pts[i].sub })).sort((a, b) => a.z - b.z).forEach((q) => {
        const r = S.r * k * q.f, g = ctx.createRadialGradient(q.x - r * 0.35, q.y - r * 0.4, r * 0.1, q.x, q.y, r);
        g.addColorStop(0, S.hi); g.addColorStop(1, q.sub ? S.base2 : S.base);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = edge; ctx.stroke();
      });
    }
    R.think = async function think() {
      const kind = pick(Object.keys(LAT));
      cap.textContent = LAT[kind].cap;
      cat.classList.add("pose-think");
      thought.hidden = false;
      const t0 = performance.now();
      let running = true;
      (function frame(t) { if (!running) return; drawLattice(kind, t - t0); requestAnimationFrame(frame); })(t0);
      try {
        thought.animate([{ opacity: 0, transform: "scale(.7)" }, { opacity: 1, transform: "scale(1)" }], { duration: 260, easing: "cubic-bezier(.3,1.5,.5,1)" });
        await wait(5600);
        await thought.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).finished;
      } finally {
        running = false;
        thought.hidden = true;
        cat.classList.remove("pose-think");
      }
    };

    /* action 2: wafer frisbee */
    R.toss = async function toss() {
      const dir = rightward() ? 1 : -1;
      cat.classList.add("pose-hold");
      try {
        await wait(380);
        const p0 = vb(148, 84);
        wafer.style.transform = tr(p0);
        wafer.hidden = false;
        await wait(500);
        cat.classList.replace("pose-hold", "pose-windup");
        const pw = vb(121, 78);
        await wafer.animate([{ transform: tr(p0) }, { transform: tr(pw) }], { duration: 240, easing: "ease-out", fill: "forwards" }).finished;
        cat.classList.replace("pose-windup", "pose-release");
        disc.classList.add("spin");
        const cp = { x: p0.x, y: p0.y - 40 }, D = 1700;
        const flight = wafer.animate([
          { transform: tr(pw) },
          { transform: tr({ x: pw.x + dir * 70, y: pw.y - 150 }), offset: 0.3 },
          { transform: tr({ x: pw.x + dir * 190, y: pw.y - 110 }), offset: 0.55 },
          { transform: tr({ x: pw.x + dir * 90, y: pw.y - 40 }), offset: 0.8 },
          { transform: tr(cp) },
        ], { duration: D, easing: "cubic-bezier(.25,.55,.5,1)", fill: "forwards" });
        setTimeout(() => cat.classList.remove("pose-release"), 320);
        await wait(D - 380);
        cat.classList.add("pose-hold");
        cat.animate([{ transform: "translateY(0)" }, { transform: "translateY(-40px)" }], { duration: 380, easing: "cubic-bezier(.2,.8,.4,1)", fill: "forwards" });
        await flight.finished;
        disc.classList.remove("spin");
        const opts = { duration: 300, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" };
        cat.animate([{ transform: "translateY(-40px)" }, { transform: "translateY(0)" }], opts);
        await wafer.animate([{ transform: tr(cp) }, { transform: tr(p0) }], opts).finished;
        cat.getAnimations().filter((a) => a.effect && a.effect.target === cat).forEach((a) => a.cancel());
        for (let i = 0; i < 6; i++) {
          const a = Math.random() * Math.PI * 2;
          particle(p0.x, p0.y, "", "spark", { dx: Math.cos(a) * 26, dy: Math.sin(a) * 26, dur: 600, rot: 180 });
        }
        say("caught it", 1100);
        await wait(900);
      } finally {
        cat.getAnimations().filter((a) => a.effect && a.effect.target === cat).forEach((a) => a.cancel());
        wafer.getAnimations().forEach((a) => a.cancel());
        disc.classList.remove("spin");
        wafer.hidden = true;
        cat.classList.remove("pose-hold", "pose-windup", "pose-release");
      }
    };

    /* action 3: coding */
    R.type = async function type(lines = ASE_LINES) {
      const paws = [part(".paw-l"), part(".paw-r")], keys = [...cat.querySelectorAll(".key")];
      cat.classList.add("pose-type");
      try {
        await wait(300);
        let out = "";
        for (const [i, ch] of [...pick(lines)].entries()) {
          out += ch;
          say(out + "▌", 0, true);
          const paw = paws[i % 2];
          paw.classList.add("tap"); setTimeout(() => paw.classList.remove("tap"), 70);
          const key = pick(keys);
          key.classList.add("lit"); setTimeout(() => key.classList.remove("lit"), 110);
          await wait(45 + Math.random() * 50);
        }
        say(out, 0, true);
        await wait(700);
        flash("eyes-shut", 700);
        say("it runs.", 1300);
        await wait(1400);
      } finally {
        cat.classList.remove("pose-type");
      }
    };
    return R;
  }

  /* ---------- the corner cat ---------- */
  const root = document.createElement("div");
  root.className = "cation";
  const corner = makeRig(root, true);
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "cn-tab";
  tab.textContent = "Cat'ion";
  tab.setAttribute("aria-label", "Show the lab cat");
  const tx = document.createElement("div");
  tx.className = "cation-tx";
  tx.setAttribute("aria-hidden", "true");
  const perchEl = document.createElement("div");
  perchEl.className = "cn-perch";
  perchEl.hidden = true;
  const perch = makeRig(perchEl, false);
  document.body.append(root, tab, tx, perchEl);

  /* Theme: the homepage sets body.te-dark; TE-PlotBench sets <html data-theme>, or leaves it
     unset to follow the system when no choice is saved under "te-theme". */
  const darkMq = matchMedia("(prefers-color-scheme: dark)");
  function syncTheme() {
    const set = document.documentElement.dataset.theme;
    const dark = set ? set === "dark"
      : document.body.classList.contains("te-dark") ||
        (!store.get("te-theme") && !store.get("tepb-theme") && darkMq.matches);
    [root, tab, tx, perchEl].forEach((el) => el.classList.toggle("cn-dark", dark));
  }
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  new MutationObserver(syncTheme).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  if (darkMq.addEventListener) darkMq.addEventListener("change", syncTheme);

  let hiddenByUser = store.get("cation-hidden") === "1";
  function setHidden(h) {
    hiddenByUser = h;
    root.hidden = h;
    tab.hidden = !h;
    if (h) hidePerch();
    else queuePerch();
    store.set("cation-hidden", h ? "1" : null);
  }
  root.querySelector(".cn-hide").addEventListener("click", () => { setHidden(true); tab.focus(); });
  tab.addEventListener("click", () => { setHidden(false); corner.btn.focus(); corner.react("hop"); });

  addEventListener("pointermove", (e) => {
    if (hiddenByUser) return;
    if (!corner.busy) corner.gaze(e);
    if (!perch.busy && !perchEl.hidden) perch.gaze(e);
  }, { passive: true });

  async function runAction(rig, fn) {
    if (rig.busy || hiddenByUser || document.hidden || RM) return;
    rig.busy = true;
    rig.clearGaze();
    try { await fn(); } catch (err) { quiet(err); } finally { rig.busy = false; }
  }
  (function schedule(first) {
    setTimeout(async () => {
      // Let the perched cat have the stage while it is busy.
      if (!perch.busy) await runAction(corner, pick([corner.think, corner.toss, () => corner.type()]));
      schedule(false);
    }, first ? 9000 : 24000 + Math.random() * 18000);
  })(true);

  /* ---------- the perched cat on section headings ---------- */
  const PERCH_SEL = [".pt-work-heading", ".pm-heading", ".tc-section-heading", ".ws-section-head",
    ".mechanics-section-heading", ".career-heading", ".personal-pages-heading", ".sec-head", "[data-cation-perch]"].join(",");
  const KICKER_SEL = ".section-kicker, .tc-eyebrow, .eyebrow";
  const seen = new Set();
  let done = new WeakSet(), host = null, moving = false, quietUntil = 0, perchTimer = 0;

  function textBox(el) {
    const r = document.createRange();
    r.selectNodeContents(el);
    const rs = [...r.getClientRects()].filter((q) => q.width > 0 && q.height > 0);
    if (!rs.length) return el.getBoundingClientRect();
    return {
      left: Math.min(...rs.map((q) => q.left)), right: Math.max(...rs.map((q) => q.right)),
      top: Math.min(...rs.map((q) => q.top)), bottom: Math.max(...rs.map((q) => q.bottom)),
    };
  }
  // Sit in the empty part of the heading: above a description column, under a kicker
  // column, or just after the kicker text, on top of the title.
  function placePerch() {
    if (!host || perchEl.hidden) return;
    const hr = host.getBoundingClientRect();
    if (!hr.width) return;
    const vw = document.documentElement.clientWidth;
    const w = perchEl.offsetWidth, ht = (w * 210) / 200;
    const T = host.querySelector("h2, h3, h4"), K = host.querySelector(KICKER_SEL);
    const tb = T ? textBox(T) : hr, kb = K && textBox(K);
    const D = [...host.querySelectorAll("p")].filter((p) => p !== K && !(T && T.contains(p)) && !p.matches(KICKER_SEL)).pop();
    const db = D && textBox(D);
    let x, bottom;
    if (db && db.left > tb.right + 16) { x = db.left + 10; bottom = db.top - 8; }
    else if (kb && kb.right < tb.left) { x = kb.left; bottom = kb.bottom + 14 + ht; }
    else if (kb) {
      x = kb.right + 24; bottom = tb.top - 2;
      if (x + w > hr.right) { x = hr.right - w; bottom = kb.top; }
    } else { x = tb.right + 18; bottom = tb.bottom; }
    x = Math.max(8, Math.min(x, vw - w - 8));
    // Open bubbles to the right when there is room for them there.
    const roomR = vw - (x + w);
    perchEl.classList.toggle("cn-rightward", roomR >= 200 || roomR >= x);
    // Page coordinates, so the cat scrolls with its heading.
    const op = perchEl.offsetParent;
    const base = !op || (op === document.body && getComputedStyle(op).position === "static")
      ? { left: -scrollX, top: -scrollY } : op.getBoundingClientRect();
    perchEl.style.left = Math.round(x - base.left) + "px";
    perchEl.style.top = Math.round(bottom - ht - base.top) + "px";
  }
  function hidePerch() {
    perchEl.getAnimations().forEach((a) => a.cancel());
    perchEl.hidden = true;
    host = null;
  }
  function topicFor(h) {
    const o = h.closest("[data-cation]");
    if (o) return o.dataset.cation;
    const view = h.closest(".page-view"), id = (view && view.id) || "";
    if (/^plastic-te/.test(id)) return "think";
    if (id === "agent-workspace") return "type";
    return pick(["think", "toss", "type"]);
  }
  async function moveTo(h) {
    moving = true;
    try {
      if (host && !perchEl.hidden && !RM) {
        await perchEl.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(10px) scale(.7)" }],
          { duration: 240, easing: "ease-in", fill: "forwards" }).finished;
      }
      host = h;
      perchEl.hidden = false;
      perchEl.getAnimations().forEach((a) => a.cancel());
      dress(perch.cat, perch.cat.dataset.coat);
      placePerch();
      if (!RM) {
        await perchEl.animate([{ opacity: 0, transform: "translateY(16px) scale(.6)" }, { opacity: 1, transform: "none" }],
          { duration: 620, easing: "cubic-bezier(.3,1.5,.5,1)" }).finished;
      }
    } catch (err) { quiet(err); return; } finally { moving = false; }
    if (RM || done.has(h)) return;
    done.add(h);
    await wait(450);
    if (host !== h) return;
    const topic = topicFor(h);
    const act = topic === "think" ? perch.think : topic === "type" ? () => perch.type(WS_LINES)
      : topic === "toss" ? perch.toss : perch.think;
    await runAction(perch, act);
    queuePerch();
  }
  function updatePerch() {
    if (hiddenByUser || document.hidden) return;
    const vis = [...seen].filter((h) => h.getClientRects().length);
    if (!vis.length) return;
    if (perch.busy || moving || performance.now() < quietUntil) { queuePerch(700); return; }
    vis.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (vis[0] !== host) moveTo(vis[0]);
  }
  function queuePerch(ms = 400) {
    clearTimeout(perchTimer);
    perchTimer = setTimeout(updatePerch, ms);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    queuePerch();
  }, { rootMargin: "-12% 0px -38% 0px" });
  document.querySelectorAll(PERCH_SEL).forEach((h) => io.observe(h));
  addEventListener("resize", placePerch, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(() => placePerch()).observe(document.body);

  setHidden(hiddenByUser);

  /* ---------- between pages ---------- */
  function labelFor(viewId) {
    const view = document.getElementById(viewId);
    const top = (view && view.dataset.viewParent) || viewId;
    const link = document.querySelector(`[data-nav] [data-view-link="${top}"]`);
    return ((link && link.textContent) || (view && view.dataset.pageTitle) || "Home").trim();
  }
  let txToken = 0;
  async function transition(label) {
    const token = ++txToken;
    tx.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    const style = pick(["peek", "hop"]);
    tx.innerHTML = `<div class="${style === "peek" ? "cn-peek" : "cn-hopper"}">${catSVG("pose-sign", signSVG(label))}</div>`;
    const box = tx.firstElementChild, svg = box.firstElementChild;
    dress(svg);
    if (style === "peek") {
      await box.animate([{ transform: "translate(-50%,110%)" }, { transform: "translate(-50%,0%)" }], { duration: 760, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "forwards" }).finished;
      if (token !== txToken) return;
      svg.querySelector(".ear-r").animate([{ transform: "rotate(0)" }, { transform: "rotate(20deg)", offset: 0.3 }, { transform: "rotate(0)" }], { duration: 520 });
      await wait(1900);
      if (token !== txToken) return;
      await box.animate([{ transform: "translate(-50%,0%)" }, { transform: "translate(-50%,110%)" }], { duration: 560, easing: "cubic-bezier(.6,0,.9,.5)", fill: "forwards" }).finished;
    } else {
      // About 280 px per second, with a hop every half second.
      const w = innerWidth, dur = Math.max(2600, Math.min(6500, (w + 180) / 0.28));
      svg.animate([{ transform: "translateY(0) scale(1.08,.9)" }, { transform: "translateY(-22px) scale(.96,1.05)", offset: 0.5 }, { transform: "translateY(0) scale(1.08,.9)" }], { duration: 520, iterations: Infinity });
      await box.animate([{ transform: "translateX(-140px)" }, { transform: `translateX(${w + 40}px)` }], { duration: dur, fill: "forwards" }).finished;
    }
    if (token === txToken) tx.innerHTML = "";
  }
  addEventListener("pageviewchange", (e) => {
    hidePerch();
    done = new WeakSet();
    quietUntil = performance.now() + 1600;
    queuePerch(1700);
    if (hiddenByUser) return;
    if (!RM) {
      transition(labelFor(e.detail && e.detail.viewId)).catch(quiet);
      corner.cat.animate([{ transform: "scale(1,1)" }, { transform: "scale(.86,1.06)", offset: 0.45 }, { transform: "scale(1,1)" }], { duration: 380, easing: "ease-in-out" });
      setTimeout(() => dress(corner.cat, corner.cat.dataset.coat), 170);
    } else {
      dress(corner.cat, corner.cat.dataset.coat);
    }
  });
})();
