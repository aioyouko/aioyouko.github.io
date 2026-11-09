/* Provisional coordinates estimated from the user's reference image (2026-11-09).
 * Edit this file when measured values and references are supplied. No fetching is
 * required, so the chart also works when index.html is opened with file://.
 * bandGapEv: null means the separate near-zero-gap strip, NOT a log-axis value.
 * Multiple points with the same material label are separate, unidentified
 * examples in the reference; they are not replicate measurements or error bars.
 */
((root) => {
  const data = {
    provisional: true,
    source: "User-supplied band-gap–elongation schematic, 2026-11-09; visually estimated, not verified measurements.",
    groups: [
      { id: "ductile", label: "Ductile inorganic materials", color: "#c25249" },
      { id: "semiconductor", label: "Brittle semiconductors", color: "#397ba4" },
      { id: "ceramic", label: "Brittle ceramics", color: "#b87524" },
      { id: "metal", label: "Metals · reference", color: "#727d78" }
    ],
    points: [
      { id: "mg3bi2", label: "Mg₃Bi₂", group: "ductile", bandGapEv: null, elongationPercent: 100, labelOffset: [14, -12], note: "Near-zero-gap placement follows the schematic; electronic classification and phase await confirmation." },
      { id: "fe", label: "Fe", group: "metal", bandGapEv: null, elongationPercent: 70, labelOffset: [14, 0] },
      { id: "cu", label: "Cu", group: "metal", bandGapEv: null, elongationPercent: 55, labelOffset: [14, 14] },
      { id: "mg", label: "Mg", group: "metal", bandGapEv: null, elongationPercent: 6, labelOffset: [14, 5] },
      { id: "ag2-alloy-1", label: "Ag₂(S,Se,Te)", example: "A", group: "ductile", bandGapEv: 0.11, elongationPercent: 105, labelOffset: [16, -10] },
      { id: "ag2-alloy-2", label: "Ag₂(S,Se,Te)", example: "B", group: "ductile", bandGapEv: 0.11, elongationPercent: 75 },
      { id: "ag2-alloy-3", label: "Ag₂(S,Se,Te)", example: "C", group: "ductile", bandGapEv: 0.12, elongationPercent: 52 },
      { id: "ag2-alloy-4", label: "Ag₂(S,Se,Te)", example: "D", group: "ductile", bandGapEv: 0.30, elongationPercent: 95 },
      { id: "agcu-alloy-1", label: "AgCuS₀.₀₈Se₀.₂₂Te₀.₇", shortLabel: "AgCu(S,Se,Te)", example: "A", group: "ductile", bandGapEv: 0.22, elongationPercent: 15, labelOffset: [-13, -17], labelAnchor: "end" },
      { id: "agcu-alloy-2", label: "AgCuS₀.₀₈Se₀.₂₂Te₀.₇", shortLabel: "AgCu(S,Se,Te)", example: "B", group: "ductile", bandGapEv: 0.28, elongationPercent: 25 },
      { id: "bi2te3", label: "Defective Bi₂Te₃", group: "ductile", bandGapEv: 0.15, elongationPercent: 8, labelOffset: [0, 24], labelAnchor: "middle" },
      { id: "mg3sb2", label: "Mg₃Sb₂", group: "ductile", bandGapEv: 0.40, elongationPercent: 7.5, labelOffset: [-6, 24], labelAnchor: "middle" },
      { id: "snse2", label: "SnSe₂", group: "ductile", bandGapEv: 0.90, elongationPercent: 6, labelOffset: [-13, 6], labelAnchor: "end" },
      { id: "ag2s", label: "Ag₂S", group: "ductile", bandGapEv: 1.05, elongationPercent: 4.2, labelOffset: [2, 24], labelAnchor: "middle" },
      { id: "twisted-gagete", label: "Twisted-GaGeTe", group: "ductile", bandGapEv: 1.10, elongationPercent: 30, labelOffset: [-8, -15], labelAnchor: "end" },
      { id: "inse", label: "InSe", group: "ductile", bandGapEv: 1.20, elongationPercent: 12, labelOffset: [-14, -5], labelAnchor: "end" },
      { id: "mos2", label: "MoS₂", group: "ductile", bandGapEv: 1.30, elongationPercent: 9, labelOffset: [12, 14] },
      { id: "gase", label: "GaSe", group: "ductile", bandGapEv: 2.10, elongationPercent: 11, labelOffset: [14, 14] },
      { id: "twisted-gase", label: "Twisted-GaSe", group: "ductile", bandGapEv: 2.10, elongationPercent: 28, labelOffset: [-6, -17], labelAnchor: "middle" },
      { id: "agbr", label: "AgBr", group: "ductile", bandGapEv: 2.70, elongationPercent: 53, labelOffset: [0, -17], labelAnchor: "middle" },
      { id: "agcl", label: "AgCl", group: "ductile", bandGapEv: 3.20, elongationPercent: 34, labelOffset: [13, -8] },
      { id: "twisted-gas", label: "Twisted-GaS", group: "ductile", bandGapEv: 3.00, elongationPercent: 25, labelOffset: [18, 15] },
      { id: "ge", label: "Ge", group: "semiconductor", bandGapEv: 0.67, elongationPercent: 0.11, labelOffset: [-10, -13], labelAnchor: "end" },
      { id: "si", label: "Si", group: "semiconductor", bandGapEv: 1.10, elongationPercent: 0.10, labelOffset: [0, 23], labelAnchor: "middle" },
      { id: "gaas", label: "GaAs", group: "semiconductor", bandGapEv: 1.42, elongationPercent: 0.35, labelOffset: [0, -15], labelAnchor: "middle" },
      { id: "sic", label: "SiC", group: "semiconductor", bandGapEv: 3.00, elongationPercent: 0.12, labelOffset: [-10, 23], labelAnchor: "end" },
      { id: "si3n4", label: "Si₃N₄", group: "ceramic", bandGapEv: 4.60, elongationPercent: 0.25, labelOffset: [-8, -15], labelAnchor: "end" },
      { id: "aln", label: "AlN", group: "ceramic", bandGapEv: 6.00, elongationPercent: 0.20, labelOffset: [5, 24], labelAnchor: "middle" },
      { id: "al2o3", label: "Al₂O₃", group: "ceramic", bandGapEv: 8.70, elongationPercent: 0.08, labelOffset: [-3, 24], labelAnchor: "end" }
    ]
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else root.DuctilityMapData = data;
})(globalThis);
