# Thermoelectric research figures

## InfoMat (2021): semiconductor mechanics chapter

Heyang Chen, Tian-Ran Wei, Kunpeng Zhao, Pengfei Qiu, Lidong Chen, Jian He, and Xun Shi. *Room-temperature plastic inorganic semiconductors for flexible and deformable electronics.* **3**, 22–35 (2021). DOI: https://doi.org/10.1002/inf2.12149. Published online 6 September 2020; issue year and pagination verified against the publisher. © 2020 The Authors.

`infomat-2021-stress-strain.png` is a render of Figure 1A cropped from page 3 of the user-supplied PDF. All four curves, the panel label, axes, annotations, and original colors are retained; the surrounding page and Figure 1B are omitted. The webpage identifies the crop, links the paper, and offers an enlarged view. These are schematic responses of material classes, not experimental semiconductor curves. Figure 1B has a separate AAAS credit in the source and is not reproduced here.

The chapter uses Sections 2–3 for elastic response, plasticity, flexibility, and slip/cleavage mechanisms. Its application-specific evaluation prompts are a design synthesis, not experimental results from the review. Toughness (energy absorbed per volume) is distinguished from fracture toughness; an ordinary stress–strain curve cannot provide K_IC. The simplified bending equations assume a thin, homogeneous, free-standing sheet with radius measured at its neutral plane. A brittle fracture strain must not be described as a yield strain.

The three inline application illustrations are original conceptual SVGs, not device photographs or measured geometries. The existing thickness/radius interaction stays in the linked flexibility chapter. References [3], [4], [7], and [8] retain the overview numbering; the supplied InfoMat review is added as [9] in the mechanics chapter. The two study links preserve the distinction between compressive plasticity in Ag2Se-based alloys and tensile ductility in cubic Ag2(S,Se,Te).

These WebP assets are extracted from the two published papers supplied by Heyang Chen. Figure content has not been redrawn, recolored, or digitized. Complete figures are used except the explicitly identified photograph crop. Publication attribution and DOI links accompany the images on the page; the enlarged views include copyright information.

## Advanced Energy Materials (2024)

Heyang Chen et al. *High-Entropy Cubic Pseudo-Ternary Ag2(S, Se, Te) Materials With Excellent Ductility and Thermoelectric Performance.* **14**, 2303473 (2024). DOI: https://doi.org/10.1002/aenm.202303473. © 2023 Wiley-VCH GmbH.

| Asset | Source |
| --- | --- |
| aem-2024-composition.webp | Figure 1, PDF page 2 |
| aem-2024-ductility.webp | Figure 2, PDF page 4 |
| aem-2024-transport.webp | Figure 3, PDF page 5 |
| aem-2024-foils.webp | Figure 5, PDF page 6 |
| aem-2024-flexible-foils.webp | Figure 5b,c, photograph crop from PDF page 6 |
| aem-2024-device.webp | Figure 6, PDF page 7 |

Reported zT values 0.45 at 300 K and 0.8 at 460 K refer to Ag1.98S1/3Se1/3Te1/3. The tensile elongation range 60–97% refers to the studied Ag2−xS1/3Se1/3Te1/3 materials. The approximate average lattice thermal conductivity of 0.2 W m−1 K−1 is inferred from the room-temperature κ–σ relation, not directly measured in isolation. The 15% bending strain in the phase map is apparatus-limited. Foils were rolled down to 30 μm; the device used 50 μm foils. The 150-cycle bending experiment was a separate test of a 30 μm foil.

## National Science Open (2025)

Heyang Chen, Shenghong Ren et al. *Robust mechanical properties of Ag2Se1−xTex thermoelectric materials.* **4**, 20250005 (2025). DOI: https://doi.org/10.1360/nso/20250005. © The authors 2025, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Heyang Chen and Shenghong Ren contributed equally.

| Asset | Source |
| --- | --- |
| nso-2025-mechanics.webp | Figure 2, PDF page 4 |
| nso-2025-transport.webp | Figure 4, PDF page 7 |
| nso-2025-microstructure.webp | Figure 3, PDF page 6 |

The 26.7 ± 4.5% strain is compression strain, not tensile elongation. Fracture toughness is 4.5 ± 0.6 MPa m1/2; both values refer to Ag2Se0.9Te0.1. Error bars in Figure 2 represent standard deviations from multiple measurements. The alloys exhibit brittle behavior in bending. The transport study optimizes small Ag deficiencies while retaining nominal stoichiometric composition labels; zT = 0.78 at 300 K and 1.1 at 380 K refers to the nominal Ag2Se0.9Te0.1 composition. Sub-grain rotation is a proposed mechanism, not a directly established dynamic observation.

## Representative-work card illustrations (2026-11-19)

`plastic-te-toughness.svg` (Ag2Se-based card) and `plastic-te-ductility-motion.svg` (cubic Ag2(S,Se,Te) card) are original conceptual vectors that replace `plastic-te-compression.svg` and `plastic-te-ductility.svg` on the overview (the old files are no longer referenced).

- Toughness panel: a notched beam in three-point bending with a blunted crack tip, plastic zone and schematic dislocations, plus a K_IC bar chart. Ag2Se0.9Te0.1 = 4.5 MPa m^1/2 is from the NSO 2025 paper; silicon (about 0.9) and Bi2Te3-based alloys (about 1) are rounded, commonly quoted literature values used only for scale. The load presses in a loop: the beam sags slightly and the plastic zone grows (schematic, not to scale).
- Motion panel: left, a dog-bone specimen pulled symmetrically, stretching uniformly and then necking at the paper's ~97% elongation of Ag2S1/3Se1/3Te1/3, with schematic slip bands; a schematic engineering stress-strain curve traces in step (shape only, no measured values). Right: a narrow foil closed into a Mobius loop that spins about its axis, standing for the flexibility of the paper's rolled foils (bending test: 150 cycles, 30 um). The loop is a parametric Mobius strip drawn as shaded facets; the spin is cut into 20 depth-sorted steps with linear motion inside each, and the shading is a stylised reflection, not a measurement.
- Both files are SMIL-animated SVG (plays inside <img>, no script) generated by `tools/make-work-figures.mjs` (`node tools/make-work-figures.mjs`). Under prefers-reduced-motion a static frame is shown.
- Palette (revised 2026-11-19): polished black-silver for the semiconductor, matte steel for fixtures, a cool silver backdrop, and copper for loads, the stress-strain trace and the author's own values. Illustration text is set in Arial (also for the inline SoC schematic and the flexibility demo).

## Plastic TE overview and background chapters

The six `plastic-te-*.svg` base illustrations and three `*-mobile.svg` portrait arrangements are original conceptual vectors. They are not traced publication figures, measured curves, or crystallographic models. No dimensions or loading diagrams are intended to predict specimen behavior. The application schematic separates electrically driven cooling from thermally driven generation; the latter includes energy management. The stress–strain diagram has no numerical axes and does not compare the two research compositions.

Background sources verified for the merged research section:

1. S. Hong et al. *Wearable thermoelectrics for personalized thermoregulation.* Science Advances 5, eaaw0536 (2019). https://doi.org/10.1126/sciadv.aaw0536
2. S. Yang et al. *Flexible thermoelectric generator and energy management electronics powered by body heat.* Microsystems & Nanoengineering 9, 106 (2023). https://doi.org/10.1038/s41378-023-00583-3
3. J. Peng and G. J. Snyder. *A figure of merit for flexibility.* Science 366, 690–691 (2019). https://doi.org/10.1126/science.aaz5704
4. W. Liu et al. *Flexible solar cells based on foldable silicon wafers with blunted edges.* Nature 617, 717–723 (2023). https://doi.org/10.1038/s41586-023-05921-z
5. X. Shi et al. *Room-temperature ductile inorganic semiconductor.* Nature Materials 17, 421–426 (2018). https://doi.org/10.1038/s41563-018-0047-z
6. J. Liang et al. *Flexible thermoelectrics: from silver chalcogenides to full-inorganic devices.* Energy & Environmental Science 12, 2983–2990 (2019). https://doi.org/10.1039/C9EE01777A

The background papers are literature context, not presented as Heyang Chen's own publications. The 2018 Nature Materials paper and 2019 EES paper list Hongyi Chen, a different author. The two supplied 2024/2025 papers remain the user's representative work. The existing silicon bending interaction and its explicitly illustrative failure criterion are preserved in the extrinsic/intrinsic flexibility chapter.

## Interactive thermoelectric applications chapter

`te-peltier.svg` and `te-seebeck.svg`, together with their `-mobile.svg` arrangements, are original conceptual p–n-couple diagrams. The four plots in `thermoelectric-lab.js` are calculated curves, not experimental data. `thermoelectric-model.js` contains the shared physical model; native MathML in `index.html` renders the equations without a remote script or font dependency.

Revised 2026-11-19: the chapter opens with chip thermal management (section 01) and the cooling-power plot became a multi-couple module designer.

- The two SoC panels (`tc-chip` section, inline SVG) are original schematics: a generic floorplan with an illustrative hotspot and a generic flip-chip stack with a thin-film TEC. No product, layout or measured temperature map is depicted.
- Chip-cooling references, metadata checked against Crossref on 2026-11-19: J. Mao, G. Chen & Z. Ren, Nature Materials 20, 454–461 (2021), doi:10.1038/s41563-020-00852-w; I. Chowdhury et al., Nature Nanotechnology 4, 235–238 (2009), doi:10.1038/nnano.2008.417 (cited qualitatively; its abstract was not retrieved); G. Bulman et al., Nature Communications 7, 10302 (2016), doi:10.1038/ncomms10302. The page's numbers "about 10 W cm⁻²" (bulk q_max) and "258 W cm⁻²" (thin-film superlattice modules) come from the Bulman abstract.
- Device-model texts on the page: H. J. Goldsmid, *Introduction to Thermoelectricity* (2nd ed., Springer 2016); D. M. Rowe (ed.), *CRC Handbook of Thermoelectrics* (1995); G. J. Snyder & E. S. Toberer, Nature Materials 7, 105–114 (2008). Heyang Chen's 3-page derivation (`Thermoelectric_Cooling_Device.pdf`) remains the working source for the formulas but is no longer cited on the page; the PDF stays outside the site.

Model conventions:

- SI units, steady state, one-dimensional, single-stage transport, constant effective alpha, R and K over each temperature interval; ideal contacts. No Thomson heat, contact losses, parasitic heat leaks or heat-exchanger losses. Half the Joule heat reaches each end.
- Material `zT = S^2 sigma T / kappa`. Device `Z = alpha^2 / (R K)` and `ZTbar = Z (Th + Tc)/2`. Thermal conductance K (W/K) is distinct from conductivity kappa (W/m/K). Peak material zT is not substituted for effective device ZTbar.
- Cooler: `Qc = alpha Tc I - K deltaT - I^2 R/2`, `Pin = alpha deltaT I + I^2 R`, and `Qh = Qc + Pin`. COP is shown only for positive Qc and Pin. A nonpositive optimum is marked as no cooling, not plotted as a zero-COP branch.
- COP plot: independent effective ZTbar (0.1–2, default 0.8; the 0.7–1 band marks typical Bi2Te3 modules), Th 280–400 K (to cover a hot chip package near 373 K) and deltaT 2–80 K (default 20 K). The y axis follows the COP curve; the Carnot COP is shown as a readout.
- Module plot: `moduleProperties` builds alpha = 2NS, R = 2N(rho L/A + 2 rho_c/A), K = 2N kappa A/L and footprint = 2NA/fill from Bi2Te3-like legs (S = 200 uV/K, rho = 1.0e-5 ohm m, kappa = 1.5 W/m/K, rho_c = 1e-10 ohm m^2 per contact, fill = 0.3). Th is adjustable from 300 to 400 K (default 300 K) to mimic a hot SoC heat sink; the material properties stay at their room-temperature values, so high-Th readings are indicative. The drive-current range scales with Th. Designs: bulk 1.4 x 1.4 x 1.6 mm (N = 127; gives alpha = 50.8 mV/K, R = 2.10 ohm, K = 0.467 W/K, Qmax = 55 W and deltaTmax = 70 K, consistent with common 40 x 40 mm modules), mini 0.5 x 0.5 x 0.5 mm (N = 32), thin film 200 x 200 um x 20 um (N = 49; same bulk material, so contact resistance lowers its effective ZTbar to about 0.4). Thermal contact resistance and ceramic plates are neglected.
- Generator: `eta_max = (deltaT/Th) (sqrt(1+ZTbar)-1)/(sqrt(1+ZTbar)+Tc/Th)`, at the load for maximum efficiency. Carnot efficiency is `deltaT/Th`. The fixed-ZTbar deltaT sweep compares idealized effective-property conditions; it does not claim a constant-ZTbar temperature trajectory for any specific material. At deltaT = 0, eta = eta_C = 0 and their ratio is undefined.
- In the author's intermediate derivation, the symbols kappa/K are mixed. Eq. (14)'s factored discriminant contains extra deltaT factors; the dimensionally consistent expression is `4 K^2 R^2 deltaT^2 (1 + Z Tbar)`, as in Eq. (15). The last two lines of Eq. (18) omit Tbar in the dimensionless numerator. These intermediate expressions are not copied into the page. The final COP, optimal-current and no-load-temperature formulas are consistent with the energy balances.

Working-environment check (added 2026-11-19): `shareLoad` carries a fixed SoC heat load (slider 0–300 W, default 150 W) with the fewest identical modules, each at the lower current that pumps exactly its share. The table compares a 40 x 40 mm 127-couple 6 A-class module (the bulk design; about 15 V at its maximum current, like common modules), a 15 A-class module (2.0 x 2.0 x 1.6 mm legs, 60% fill, same footprint), the 49-couple thin-film cooler and the selected design. Reference lines on the plot mark the SoC load and each commercial-class module's maximum cooling at the chosen Th and deltaT. These are model estimates, not datasheet values; the "100–300 W" range for high-performance SoCs is an order-of-magnitude note.

Dark mode (added 2026-11-19): `te-theme.js` adds a toggle to each Plastic TE page and sets `body.te-dark`; `te-dark.css` holds the dark palette. Published figures, photographs, schematics and the flexibility demo stay on light cards.

Notation on the page: physical quantities (T, deltaT, Q, P, I, R, K, N, S, alpha, kappa, rho, sigma, eta, zT, ZTbar, COP) are set in italic in text, captions and plot labels; descriptive subscripts (c, h, in, max) stay upright.

Numerical validation is in `tests/thermoelectric-model.test.cjs`: module scaling and the bulk-module reference values, energy conservation, independently calculated operating points, cooling and COP optima, generator efficiency checked against a load-dependent hot-side energy balance, Carnot bounds, and zero-current / zero-deltaT / no-load limits.


## Ag–S–Se–Te timeline

Seven milestones follow six 2018–2026 papers and the 2024 study by Heyang Chen. Dates use publication years (the 2024 AEM milestone uses its issue year); the two 2026 papers are ordered January, then March. Spacing is categorical, not proportional to elapsed time.

Only the 2024 milestone uses a publication photograph (`aem-2024-flexible-foils.webp`, Heyang Chen's own AEM paper, © 2023 Wiley-VCH GmbH, Figure 5b,c). The six other milestones use original inline SVG schematics drawn for this page (no tracing of the published photographs) and link to each paper by DOI. The previously extracted third-party photographs were removed from the published site on 2026-11-19 to avoid reproducing copyrighted figures; they are kept outside the repository in `../_unpublished-timeline-photos/`.

- 2018 — X. Shi et al. *Room-temperature ductile inorganic semiconductor.* Nature Materials 17, 421–426 (2018). https://doi.org/10.1038/s41563-018-0047-z
- 2021 — S. Yang et al. *Ductile Ag20S7Te3 with Excellent Shape-Conformability and High Thermoelectric Performance.* Advanced Materials 33, 2007681 (2021). https://doi.org/10.1002/adma.202007681
- 2022 — Q. Yang et al. *Flexible thermoelectrics based on ductile semiconductors.* Science 377, 854–858 (2022). https://doi.org/10.1126/science.abq0682
- 2024 — Heyang Chen et al. *High-Entropy Cubic Pseudo-Ternary Ag2(S, Se, Te) Materials With Excellent Ductility and Thermoelectric Performance.* Advanced Energy Materials 14, 2303473 (2024). https://doi.org/10.1002/aenm.202303473
- 2025 — Z. Gao et al. *Warm metalworking for plastic manufacturing in brittle semiconductors.* Nature Materials 24, 1538–1544 (2025). https://doi.org/10.1038/s41563-025-02223-9
- 2026 (Jan) — C. Sun et al. *A highly integrated blade structure for thermoelectric devices with ultra-high output voltage and power densities.* Energy & Environmental Science 19, 1080–1087 (2026). https://doi.org/10.1039/D5EE06920C
- 2026 (Mar) — C. Sun, X. Zhao et al. *Flexible thermoelectric device with blade-like structure for ultrahigh output performance.* Watt 1, 3 (2026). https://doi.org/10.1007/s44503-026-00002-4

Interpretation: the 2022 p-type phase is an AgCu-based family, not an Ag2 composition. The 2025 Ag2Se sheet in Extended Data Fig. 1b was rolled at 393 K; do not substitute the ~420 K condition of the long ribbon in main Fig. 1b. The EES watch photograph corresponds to a 160-couple device at 273 K ambient temperature and 1 m/s airflow. The Watt wrist photograph shows a 600-couple device and an LED; its health-monitoring system uses energy storage/boost circuitry and intermittent sampling. No cross-paper power-density comparison is made.


## Interactive band-gap–elongation map

Added 2026-11-09 to the research overview’s Mechanics & flexibility section; revised 2026-11-19. Most coordinates are approximate readings from a band-gap–elongation schematic (`codex-clipboard-96b151be-e6c8-489f-a1f7-51c1e6cee4ed.png`) whose bibliographic source and test conditions have not been recorded. The page labels the map "Approximate values · for orientation"; no published numerical dataset is claimed, and the CSV export was removed.

- `ductility-map-data.js` holds 27 points. The two Ag₂(S,Se,Te) points are Heyang Chen's own measured tensile elongations from the 2024 AEM paper (Ag₂S₁/₃Se₁/₃Te₁/₃ ≈ 97%; Ag₁.₉₈S₁/₃Se₁/₃Te₁/₃ ≈ 60%), marked `own: true`. Their band-gap positions remain approximate. Other reports exceed 100% for some Ag₂(S,Se,Te) compositions; at the author's request the map shows only the author's own data for this family.
- The two AgCuS₀.₀₈Se₀.₂₂Te₀.₇ points are separate samples from the schematic (A, B), not replicates.
- Fe, Cu, Mg, and Mg₃Bi₂ use a separate near-zero-gap strip (`bandGapEv: null`), not a logarithmic value.
- Elongation depends on loading mode, temperature, grain size, strain rate and specimen form; points are not asserted to be directly comparable tensile measurements.
- Shaded category regions are visual guides, not fits or classification boundaries.
- To update: replace coordinates with sourced values in `ductility-map-data.js` (add a `note` with the source per point).
