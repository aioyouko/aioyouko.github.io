// Generates the two "My representative work" card illustrations
// (assets/research/plastic-te-toughness.svg and plastic-te-ductility-motion.svg).
// Run: node tools/make-work-figures.mjs
// Palette: polished black-silver semiconductor, matte steel fixtures, copper for loads / own values.
// Animation is SMIL so it plays inside <img>; a static frame is shown under prefers-reduced-motion.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "research");
const f = (n) => (Math.round(n * 10) / 10).toString();
const COPPER = "#b4632a", COPPER_DEEP = "#96501f", BG_MID = "#eceef1";

const anim = (attr, dur, keyTimes, values, extra = "") =>
  `<animate attributeName="${attr}" dur="${dur}s" repeatCount="indefinite" keyTimes="${keyTimes.join(";")}" values="${values.join(";")}"${extra}/>`;
const animT = (dur, keyTimes, values) =>
  `<animateTransform attributeName="transform" type="translate" dur="${dur}s" repeatCount="indefinite" keyTimes="${keyTimes.join(";")}" values="${values.join(";")}"/>`;

const sharedDefs = `
<linearGradient id="bg" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#f5f6f8"/><stop offset="1" stop-color="#e3e6ea"/></linearGradient>
<linearGradient id="metal" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#eef1f4"/><stop offset=".1" stop-color="#b4bcc5"/><stop offset=".42" stop-color="#58616b"/><stop offset=".8" stop-color="#181c21"/><stop offset="1" stop-color="#3a424b"/></linearGradient>
<linearGradient id="fixture" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#dfe3e7"/><stop offset="1" stop-color="#aab1b9"/></linearGradient>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${COPPER}"/></marker>`;

const sharedCss = `text{font-family:Arial,Helvetica,sans-serif;fill:#20262c}.label{font-size:12px;letter-spacing:1.3px;font-weight:700;fill:#20262c}.small{font-size:13px;fill:#4a525a}.tiny{font-size:11px;fill:#68717a}.value{font-size:13px;font-weight:700}.metal{fill:url(#metal);stroke:#0c0f12;stroke-width:1.2;stroke-linejoin:round}.fixture{fill:url(#fixture);stroke:#7c858e}.load{fill:none;stroke:${COPPER};stroke-width:2.5;marker-end:url(#arrow)}.axis{fill:none;stroke:#8e969e;stroke-width:1.3}.still{display:none}@media (prefers-reduced-motion:reduce){.motion{display:none}.still{display:inline}}`;

/* ---------- Figure 1: notched beam + fracture toughness ---------- */
function toughness() {
  const dur = 5, kt = [0, 0.4, 0.58, 0.88, 1], SAG = 3;
  const beam = (s) => `M50 148Q180 ${148 + 2 * s} 310 148V204Q180 ${204 + 2 * s} 50 204Z`;
  const gloss = (s) => `M58 152Q180 ${152 + 2 * s} 302 152`;
  const sags = [0, SAG, SAG, 0, 0];
  const body = (animated) => {
    const a = (attr, vals) => (animated ? anim(attr, dur, kt, vals) : "");
    const s = animated ? 0 : SAG;
    return `
<g clip-path="url(#beamclip)">
  <path class="metal" d="${beam(s)}">${a("d", sags.map(beam))}</path>
  <path d="${gloss(s)}" fill="none" stroke="#fff" stroke-width="1.3" opacity=".5">${a("d", sags.map(gloss))}</path>
  ${animated ? `<path d="M0 140L26 140L-2 212L-28 212Z" fill="#fff" opacity=".2">${animT(dur, [0, 0.55, 1], ["20 0", "20 0", "350 0"])}</path>` : ""}
</g>
<g transform="translate(0 ${s})">${animated ? animT(dur, kt, sags.map((v) => `0 ${v}`)) : ""}
  <circle cx="180" cy="170" r="${animated ? 13 : 30}" fill="url(#zone)" opacity="${animated ? 0.45 : 1}">${a("r", [13, 30, 30, 13, 13])}${a("opacity", [0.45, 1, 1, 0.45, 0.45])}</circle>
  <path d="M171.5 205L180 186L188.5 205Z" fill="${BG_MID}" stroke="#0c0f12" stroke-linejoin="round"/>
  <path d="M180 188V172" stroke="${BG_MID}" stroke-width="2.4"/><circle cx="180" cy="171" r="3.3" fill="${BG_MID}" stroke="#0c0f12" stroke-width=".8"/>
  <path d="M172 204.6H188" stroke="${BG_MID}" stroke-width="2.2"/>
  <path class="disl" d="M155 166h10M160 166v-8 M195 161h10M200 161v-8 M159 187h10M164 187v-8 M193 185h10M198 185v-8 M175 154h10M180 154v-8" opacity="${animated ? 0 : 1}">${a("opacity", [0, 1, 1, 0, 0])}</path>
</g>
<g transform="translate(0 ${animated ? -6 : s})">${animated ? animT(dur, kt, ["0 -6", `0 ${SAG}`, `0 ${SAG}`, "0 -6", "0 -6"]) : ""}
  <path d="M180 86V141" class="load"/><text x="192" y="104" class="tiny" style="fill:${COPPER_DEEP}">F</text>
</g>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><title>High fracture toughness in Ag2Se-based semiconductors</title><desc>Left: a black-silver notched beam in three-point bending; as the load presses, the crack tip blunts inside a growing plastic zone with dislocations instead of running through the beam. Right: fracture toughness of silicon (about 0.9), Bi2Te3-based alloys (about 1) and Ag2Se0.9Te0.1 (4.5 MPa m^1/2). Conceptual schematic; reference values are approximate. With reduced motion a single loaded frame is shown.</desc>
<defs>${sharedDefs}
<radialGradient id="zone"><stop offset="0" stop-color="#ffb877" stop-opacity=".95"/><stop offset=".5" stop-color="#e58a45" stop-opacity=".6"/><stop offset="1" stop-color="#e58a45" stop-opacity="0"/></radialGradient>
<linearGradient id="own" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#262c33"/><stop offset=".2" stop-color="#aeb6bf"/><stop offset=".3" stop-color="#e8ecf0"/><stop offset=".48" stop-color="#59626c"/><stop offset=".8" stop-color="#171b20"/><stop offset="1" stop-color="#2f363e"/></linearGradient>
<linearGradient id="ref" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#b3bac2"/><stop offset=".35" stop-color="#d7dce1"/><stop offset="1" stop-color="#aab1b9"/></linearGradient>
<clipPath id="beamclip"><rect x="40" y="140" width="280" height="80"/></clipPath>
<clipPath id="ownclip"><rect x="536" y="120" width="46" height="150" rx="2"/></clipPath>
</defs>
<style>${sharedCss}.disl{fill:none;stroke:#fff6ea;stroke-width:1.9;stroke-linecap:round}</style>
<rect width="640" height="360" fill="url(#bg)"/>
<text x="35" y="42" class="label">Ag₂Se-BASED MATERIALS</text>
<path d="M76 223L86 205L96 223Z M264 223L274 205L284 223Z" class="fixture"/>
<g class="motion">${body(true)}</g>
<g class="still">${body(false)}</g>
<text x="180" y="250" text-anchor="middle" class="small">Notched beam: the crack tip blunts</text>
<text x="180" y="268" text-anchor="middle" class="tiny">a plastic zone with dislocations absorbs energy</text>
<text x="372" y="92" class="small"><tspan font-style="italic">K</tspan><tspan baseline-shift="sub" font-size="10">IC</tspan> (MPa m<tspan baseline-shift="super" font-size="10">1/2</tspan>)</text>
<path d="M368 237H612M368 204H612M368 170H612M368 137H612" stroke="#d3d8dd" stroke-width="1"/>
<path d="M372 104V270H612" class="axis"/>
<text x="364" y="274" text-anchor="end" class="tiny">0</text><text x="364" y="208" text-anchor="end" class="tiny">2</text><text x="364" y="141" text-anchor="end" class="tiny">4</text>
<rect x="392" y="240" width="46" height="30" rx="2" fill="url(#ref)" stroke="#8e969e" stroke-width=".8"/>
<rect x="464" y="237" width="46" height="33" rx="2" fill="url(#ref)" stroke="#8e969e" stroke-width=".8"/>
<rect x="536" y="120" width="46" height="150" rx="2" fill="url(#own)" stroke="#0c0f12" stroke-width="1"/>
<g clip-path="url(#ownclip)" class="motion"><path d="M530 0L600 0L600 26L530 60Z" fill="#fff" opacity=".22">${animT(5, [0, 0.55, 1], ["0 40", "0 40", "0 300"])}</path></g>
<text x="415" y="232" text-anchor="middle" class="value">≈ 0.9</text><text x="487" y="229" text-anchor="middle" class="value">≈ 1</text><text x="559" y="112" text-anchor="middle" class="value" style="fill:${COPPER_DEEP}">4.5</text>
<text x="415" y="290" text-anchor="middle" class="tiny">Si</text><text x="487" y="290" text-anchor="middle" class="tiny">Bi₂Te₃ alloys</text><text x="559" y="290" text-anchor="middle" class="tiny" font-weight="700" style="fill:${COPPER_DEEP}">Ag₂Se₀.₉Te₀.₁</text>
<text x="320" y="329" text-anchor="middle" class="small">High fracture toughness: cracks blunt instead of running through</text>
</svg>
`;
}

/* ---------- Figure 2: tensile dog-bone + bending foil ---------- */
const RAMP = [[0, [13, 16, 20]], [0.25, [42, 48, 56]], [0.5, [111, 121, 133]], [0.75, [185, 193, 202]], [1, [247, 249, 251]]];
function shade(b) {
  b = Math.min(1, Math.max(0, b));
  let i = 1;
  while (RAMP[i][0] < b) i++;
  const [b0, c0] = RAMP[i - 1], [b1, c1] = RAMP[i], t = (b - b0) / (b1 - b0);
  return "#" + c0.map((v, k) => Math.round(v + (c1[k] - v) * t).toString(16).padStart(2, "0")).join("");
}

function foil() {
  // A narrow foil closed into a Mobius loop, spinning about its axis.
  // Rotating a Mobius strip by psi equals shifting its twist phase by -psi/2, so one revolution is phase 0 -> -pi.
  // Draw order must change as it turns, so the turn is cut into K steps: each step is a depth-sorted group shown
  // for DT seconds, and inside it every facet glides linearly to its next position (all loops share the DT clock).
  const R = 72, W = 11, M = 36, K = 20, DT = 0.3, CX = 486, CY = 182, TILT = (40 * Math.PI) / 180;
  const ct = Math.cos(TILT), st = Math.sin(TILT);
  const P = (u, s, ph) => {
    const r = R + s * Math.cos(u / 2 + ph);
    return [r * Math.cos(u), r * Math.sin(u), s * Math.sin(u / 2 + ph)];
  };
  // view: camera looks along +y tilted down; returns [screenX, screenY, depth(larger = nearer)]
  const view = ([x, y, z]) => [CX + x, CY + y * st - z * ct, y * ct + z * st];
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map((c) => c / l); };
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const Lk = norm([-0.4, 0.55, 0.73]), Lh = norm([-0.25, 0.45, 0.86]), L2 = norm([0.8, -0.2, 0.55]); // in view space: x right, y up(-screenY), z to camera
  const facet = (i, ph) => {
    const pad = 0.14, u0 = ((i - pad) / M) * 2 * Math.PI, u1 = ((i + 1 + pad) / M) * 2 * Math.PI, um = ((i + 0.5) / M) * 2 * Math.PI;
    const c = [P(u0, -W, ph), P(u1, -W, ph), P(u1, W, ph), P(u0, W, ph)].map(view);
    const pts = c.map((v) => f(v[0]) + "," + f(v[1])).join(" ");
    // normal in view space
    const toV = (p) => { const v = view(p); return [v[0], -v[1], v[2]]; };
    const du = sub(toV(P(um + 0.01, 0, ph)), toV(P(um - 0.01, 0, ph))), ds = sub(toV(P(um, 1, ph)), toV(P(um, -1, ph)));
    let n = norm([du[1] * ds[2] - du[2] * ds[1], du[2] * ds[0] - du[0] * ds[2], du[0] * ds[1] - du[1] * ds[0]]);
    if (n[2] < 0) n = n.map((c) => -c);
    const b = 0.1 + 0.3 * Math.max(0, dot(n, Lk)) ** 2 + 0.6 * Math.max(0, dot(n, Lh)) ** 9 + 0.3 * Math.max(0, dot(n, L2)) ** 5;
    return { pts, fill: shade(Math.min(b, 0.93)), depth: view(P(um, 0, ph))[2] };
  };
  const frame = (k) => Array.from({ length: M }, (_, i) => ({ a: facet(i, (-Math.PI * k) / K), b: facet(i, (-Math.PI * (k + 1)) / K) }))
    .sort((p, q) => p.a.depth + p.b.depth - q.a.depth - q.b.depth);
  const T = K * DT, tick = 'dur="' + DT + 's" repeatCount="indefinite"';
  let motion = "";
  for (let k = 0; k < K; k++) {
    const kt = k === 0 ? "0;" + f4(1 / K) + ";1" : k === K - 1 ? "0;" + f4(k / K) + ";1" : "0;" + f4(k / K) + ";" + f4((k + 1) / K) + ";1";
    const vals = k === 0 ? "inline;none;none" : k === K - 1 ? "none;inline;inline" : "none;inline;none;none";
    motion += '<g display="' + (k ? "none" : "inline") + '"><animate attributeName="display" calcMode="discrete" dur="' + T + 's" repeatCount="indefinite" keyTimes="' + kt + '" values="' + vals + '"/>';
    for (const { a, b } of frame(k))
      motion += '<polygon points="' + a.pts + '" fill="' + a.fill + '"><animate attributeName="points" ' + tick + ' values="' + a.pts + ";" + b.pts + '"/>' +
        (a.fill === b.fill ? "" : '<animate attributeName="fill" ' + tick + ' values="' + a.fill + ";" + b.fill + '"/>') + "</polygon>";
    motion += "</g>";
  }
  const still = frame(0).map(({ a }) => '<polygon points="' + a.pts + '" fill="' + a.fill + '"/>').join("");
  const shadow = '<ellipse cx="' + CX + '" cy="' + (CY + 78) + '" rx="' + (R + 4) + '" ry="9" fill="#0c0f12" opacity=".2" filter="url(#soft)"/>';
  return shadow + '\n<g filter="url(#rim)"><g class="motion">' + motion + '</g><g class="still">' + still + "</g></g>";
}
const f4 = (t) => (+t.toFixed(5)).toString();

function ductility() {
  const D = 5.5;
  const d0 = "M86.0 105H120.0C127.0 105 125.0 120.0 132.0 120.0Q172 120.0 212.0 120.0C219.0 120.0 217.0 105 224.0 105H258.0V155H224.0C217.0 155 219.0 140.0 212.0 140.0Q172 140.0 132.0 140.0C125.0 140.0 127.0 155 120.0 155H86.0Z";
  const d1 = "M56.0 105H90.0C97.0 105 95.0 122.0 102.0 122.0Q172 122.0 242.0 122.0C249.0 122.0 247.0 105 254.0 105H288.0V155H254.0C247.0 155 249.0 138.0 242.0 138.0Q172 138.0 102.0 138.0C95.0 138.0 97.0 155 90.0 155H56.0Z";
  const d2 = "M47.0 105H81.0C88.0 105 86.0 122.5 93.0 122.5Q172 127.0 251.0 122.5C258.0 122.5 256.0 105 263.0 105H297.0V155H263.0C256.0 155 258.0 137.5 251.0 137.5Q172 133.0 93.0 137.5C86.0 137.5 88.0 155 81.0 155H47.0Z";
  const ss = "M62 292L67 246C92 234 170 224 240 221S292 222 304 228";
  const kt = [0, 0.55, 0.75, 0.88, 0.9, 1];
  const slip = "M128 136L138 124M150 137L160 125M172 137L182 125M194 137L204 125M214 136L222 126";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><title>Tensile ductility and flexible foils of cubic Ag2(S,Se,Te)</title><desc>Animated schematic in a black-silver semiconductor palette. Left: a dog-bone specimen is pulled symmetrically, stretches uniformly, then necks at about 97% elongation while slip bands appear; the engineering stress-strain curve below traces in step. Right: a narrow polished foil twisted and closed into a Mobius loop spins continuously about its axis. Not to scale. With reduced motion, a single stretched frame and a still loop are shown.</desc>
<defs>${sharedDefs}
<path id="ss" d="${ss}"/>
<filter id="soft" x="-20%" y="-120%" width="140%" height="340%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="rim" x="-5%" y="-5%" width="110%" height="110%"><feMorphology in="SourceAlpha" operator="dilate" radius=".7"/><feFlood flood-color="#0c0f12"/><feComposite operator="in" in2="SourceAlpha" result="x"/><feMorphology in="SourceAlpha" operator="dilate" radius=".7" result="d"/><feFlood flood-color="#0c0f12"/><feComposite operator="in" in2="d"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<style>${sharedCss}.slip{stroke:#e8edf1;stroke-width:2;stroke-linecap:round}.curve{fill:none;stroke:${COPPER};stroke-width:2.6;stroke-linecap:round}</style>
<rect width="640" height="360" fill="url(#bg)"/>
<text x="35" y="42" class="label">CUBIC Ag₂(S,Se,Te)</text>
<path d="M62 196V292H316" class="axis"/>
<text x="56" y="204" text-anchor="end" class="tiny" font-style="italic">σ</text>
<text x="62" y="306" text-anchor="middle" class="tiny">0</text><text x="187" y="306" text-anchor="middle" class="tiny">50%</text><text x="304" y="306" text-anchor="middle" class="tiny">≈ 97%</text>
<text x="316" y="286" text-anchor="end" class="tiny" font-style="italic">ε</text>
<path d="${ss}" fill="none" stroke="#d0d5db" stroke-width="2.6" stroke-linecap="round"/>
<text x="172" y="338" text-anchor="middle" class="small">Uniform stretching, then necking</text>
<text x="486" y="338" text-anchor="middle" class="small">Rolled foil as a spinning Möbius loop</text>
<g class="motion">
  <g>${anim("opacity", D, [0, 0.82, 0.88, 0.9, 0.96, 1], [1, 1, 0, 0, 1, 1])}
    <path class="metal" d="${d0}">${anim("d", D, kt, [d0, d1, d2, d2, d0, d0])}</path>
    <path class="slip" d="${slip}" opacity="0">${anim("opacity", D, [0, 0.45, 0.75, 0.88, 0.9, 1], [0, 0, 0.9, 0.9, 0, 0])}</path>
    <g>${animT(D, kt, ["0 0", "-30 0", "-39 0", "-39 0", "0 0", "0 0"])}<rect class="fixture" x="78" y="97" width="28" height="66" rx="3"/><path d="M74 130H58" class="load"/></g>
    <g>${animT(D, kt, ["0 0", "30 0", "39 0", "39 0", "0 0", "0 0"])}<rect class="fixture" x="238" y="97" width="28" height="66" rx="3"/><path d="M270 130H286" class="load"/></g>
    <path class="curve" d="${ss}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1">${anim("stroke-dashoffset", D, [0, 0.75, 0.88, 0.9, 1], [1, 0, 0, 1, 1])}</path>
    <circle r="4.5" fill="${COPPER}" stroke="#fff" stroke-width="1.5"><animateMotion dur="${D}s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;0.75;0.88;0.9;1" calcMode="linear"><mpath href="#ss"/></animateMotion></circle>
  </g>
</g>
<g class="still">
  <path class="metal" d="${d2}"/><path class="slip" d="${slip}"/>
  <rect class="fixture" x="39" y="97" width="28" height="66" rx="3"/><path d="M35 130H19" class="load"/>
  <rect class="fixture" x="277" y="97" width="28" height="66" rx="3"/><path d="M309 130H325" class="load"/>
  <path class="curve" d="${ss}"/>
</g>
${foil()}
</svg>
`;
}

for (const [name, svg] of [["plastic-te-toughness.svg", toughness()], ["plastic-te-ductility-motion.svg", ductility()]]) {
  writeFileSync(join(out, name), svg);
  console.log(name, svg.length, "bytes");
}
