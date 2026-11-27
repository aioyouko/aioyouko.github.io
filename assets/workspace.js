/* Agent Workspace page (TEDEX 1.5): live console (command mode and agent mode), operating
 * modes, skills, showcase cases, materials-database walkthrough and figure gallery.
 * Every figure was rendered by TEDEX 1.5 from public demo data (assets/workspace/v15/).
 * Command lines and tool output are taken from real runs, trimmed: long lists shortened and
 * absolute paths removed. Agent transcripts follow the five skills under .agents/skills/
 * and the exit-code-2 checklists the tools print when a physical constant is missing. */
(() => {
  "use strict";
  const page = document.getElementById("agent-workspace");
  if (!page) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FIG = "assets/workspace/v15/";
  const TE = "data/demo/thermoelectric_property/{1,2,3,4,5}.csv";
  const CU = "data/demo/spb_fitting/Cu2Se";
  const PHYS = "data/demo/physics_fitting";
  const C1 = "showcase/cases/01_pbse_nonparabolic_skb_vs_spb";
  const C2 = "showcase/cases/02_mg3bi2_semimetal_bipolar_suite";
  const C3 = "showcase/cases/03_bi2sbte3_two_band_convergence";
  const C5 = "showcase/cases/05_xrd_structural_and_vt_suite/data";
  const C6 = "showcase/cases/06_sciplot_20kind_scientific_gallery/data";
  const C7 = "showcase/cases/07_classical_te_transport_and_spb_suite";
  const C8 = "showcase/cases/08_te_device_power_and_peltier_cooling";
  const TE_OUT = "outputs/figures/te/comparisons/thermoelectric_property/";
  const fig = (src, title, kicker = "", alt = "", wide = false) => ({ src, title, kicker, alt, wide });

  /* ---------- Command catalogue ----------
   * `chip` marks the commands offered in the console; every entry also appears in the gallery. */
  const demos = [
    {
      id: "zt", chip: "zT curves", group: "te",
      cmd: `te plot-te ${TE} --zt --legend --ylim 0 1.2 --xlim 280 600 --no-show`,
      log: [["", "TE selection: thermoelectric_property"], ["ok", "total 5 samples, now plotting"], ["done", `inter-batch single-property plots saved to: ${TE_OUT}`]],
      figs: [fig("te-zt.svg", "zT versus temperature", "plot-te", "zT versus temperature for five demo samples")],
    },
    {
      id: "seebeck", group: "te",
      cmd: `te plot-te ${TE} --seebeck --legend --ylim -400 400 --xlim 280 600 --no-show`,
      log: [["", "TE selection: thermoelectric_property"], ["ok", "total 5 samples, now plotting"], ["done", `inter-batch single-property plots saved to: ${TE_OUT}`]],
      figs: [fig("te-seebeck.svg", "Seebeck coefficient, p- and n-type", "plot-te", "Seebeck coefficient versus temperature, positive and negative curves")],
    },
    {
      id: "sigma", group: "te",
      cmd: `te plot-te ${TE} --sigma --ylim 0 1600 --xlim 280 600 --no-show`,
      log: [["", "TE selection: thermoelectric_property"], ["ok", "total 5 samples, now plotting"], ["done", `inter-batch single-property plots saved to: ${TE_OUT}`]],
      figs: [fig("te-conductivity.svg", "Electrical conductivity", "plot-te", "Electrical conductivity versus temperature for five demo samples")],
    },
    {
      id: "summary", chip: "6-panel TE summary", group: "te",
      cmd: `te plot-te ${C7}/data/te_series --plot-mode combined --formats svg png --no-show`,
      log: [["", "TE selection: te_series"], ["ok", "total 5 samples, now plotting"], ["done", "inter-batch combined plot saved to: outputs/figures/te/comparisons/te_series/te_series_summary.svg"]],
      figs: [fig("c7-summary.svg", "S, σ, PF, κ, κ<sub>L</sub> and zT for a p → n doping series", "plot-te --plot-mode combined", "Six-panel summary of Seebeck, conductivity, power factor, thermal and lattice thermal conductivity and zT versus temperature", true)],
    },
    {
      id: "xrd", chip: "XRD, two PDF cards", group: "xrd",
      cmd: 'te plot-xrd data/demo/xrd --pdf-card "data/pdf_card/CuInTe2 PDF#97-023-8958.txt" --pdf-card "data/pdf_card/Sb2Te3 PDF#97-067-0037.txt" --no-show',
      log: [["", "Bottom PDF standard: CuInTe2 PDF#97-023-8958"], ["", "Top PDF standard: Sb2Te3 PDF#97-067-0037"], ["", "Output group: xrd_5patterns · Layout: stack"], ["done", "saved normalized: data/demo/xrd/figures/xrd_5patterns_XRD_normalized.svg"]],
      figs: [fig("xrd-two-card.svg", "Stacked XRD between two reference cards", "plot-xrd", "Five stacked XRD patterns with one PDF card below and one above")],
    },
    {
      id: "vtmap", chip: "In-situ XRD map", group: "xrd",
      cmd: `te plot-xrd ${C5}/vt_xrd_cigt --vt-map --transition-temp 635 --formats svg png --no-show`,
      log: [["", "XRD patterns: 8 files, 300 K to 750 K"], ["", "Output group: vt_xrd_cigt_8patterns"], ["", "Layout: vt_map"], ["done", "saved vt_map: …/vt_xrd_cigt/figures/vt_xrd_cigt_8patterns_XRD_vt_map.svg"]],
      figs: [fig("xrd-vtmap.webp", "300–750 K in-situ map, transition at 635 K", "plot-xrd --vt-map", "Two-dimensional map of XRD intensity versus angle and temperature with a transition line")],
    },
    {
      id: "zoom", group: "xrd",
      cmd: `te plot-xrd ${C5}/vt_xrd_cigt --pick 13568 --zoom 26.9 28.3 --pdf-card ${C5}/CuInGaTe2_card.csv --legend --formats svg png --no-show`,
      log: [["", "XRD patterns: 300 K, 450 K, 600 K, 650 K, 750 K"], ["", "Output group: vt_xrd_cigt_5patterns_pick_1_3_5_6_8"], ["", "Layout: zoom"], ["done", "saved zoom: …/vt_xrd_cigt/figures/vt_xrd_cigt_5patterns_pick_1_3_5_6_8_XRD_zoom.svg"]],
      figs: [fig("xrd-zoom.svg", "Full patterns with a (112) peak-shift zoom", "plot-xrd --zoom", "Stacked XRD patterns beside a zoomed panel of the main peak")],
    },
    {
      id: "vtstack", group: "xrd",
      cmd: `te plot-xrd ${C5}/vt_xrd_cigt --vt-stack --formats svg png --no-show`,
      log: [["", "Output group: vt_xrd_cigt_8patterns"], ["", "Layout: vt_stack"], ["done", "saved vt_stack: …/vt_xrd_cigt/figures/vt_xrd_cigt_8patterns_XRD_vt_stack.svg"]],
      figs: [fig("xrd-vtstack.webp", "Temperature-coloured waterfall, 300–750 K", "plot-xrd --vt-stack", "Waterfall of XRD patterns coloured from blue to red with temperature")],
    },
    {
      id: "rietveld", group: "xrd",
      cmd: `te plot-xrd ${C5}/CIGT_ZnSe_rietveld.csv --rietveld --zoom 44.2 47.2 --pdf-card ${C5}/CuInGaTe2_card.csv --pdf-card ${C5}/ZnSe_card.csv --formats svg png --no-show`,
      log: [["done", "saved rietveld: …/data/figures/CIGT_ZnSe_rietveld_XRD_rietveld.svg"]],
      figs: [fig("xrd-rietveld.webp", "Two-phase Rietveld profile and residual", "plot-xrd --rietveld", "Observed and calculated XRD profile with difference curve, Bragg ticks and a zoom inset")],
    },
    {
      id: "wh", group: "xrd",
      cmd: `te plot-xrd ${C5}/CIT_nano_WH.xy --wh --pdf-card ${C5}/CuInGaTe2_card.csv --instr-fwhm 0.05 --formats svg png --no-show`,
      log: [["", "Output group: CIT_nano_WH"], ["", "Layout: williamson_hall"], ["done", "saved CIT_nano_WH_williamson_hall: …/data/figures/CIT_nano_WH_XRD_williamson_hall.svg"]],
      figs: [fig("xrd-wh.svg", "Williamson–Hall crystallite size and strain", "plot-xrd --wh", "Williamson–Hall plot of beta cos theta against 4 sin theta with a linear fit")],
    },
    {
      id: "contour", chip: "2D zT contour", group: "sci",
      cmd: `te sciplot ${C6}/contour_zt.csv --figure contour_phase_map --formats svg png --no-show`,
      log: [["", '"recipe": "configs/plot_recipes/map/contour_phase_map.json"'], ["ok", '"kind": "contour", "rows": 288'], ["done", '"figures": [ "…/data/figures/contour_phase_map.svg", … ]']],
      figs: [fig("sci-contour.svg", "(T, x) zT contour map", "sciplot · contour", "Filled contour map of zT against temperature and composition")],
    },
    {
      id: "ternary", chip: "Ternary map", group: "sci",
      cmd: `te sciplot ${C6}/ternary_cigt.csv --figure ternary_composition --alabel 'CuInTe$_2$' --blabel 'CuGaTe$_2$' --clabel ZnSe --formats svg png --no-show`,
      log: [["", '"recipe": "configs/plot_recipes/map/ternary_composition.json"'], ["ok", '"kind": "ternary", "rows": 56'], ["done", '"figures": [ "…/data/figures/ternary_composition.svg", … ]']],
      figs: [fig("sci-ternary.svg", "CuInTe₂–CuGaTe₂–ZnSe composition map", "sciplot · ternary", "Ternary composition diagram coloured by zT")],
    },
    {
      id: "parity", group: "sci",
      cmd: `te sciplot ${C6}/parity_zt.csv --figure parity_pred_vs_exp --formats svg png --no-show`,
      log: [["", '"recipe": "configs/plot_recipes/stats/parity_pred_vs_exp.json"'], ["ok", '"kind": "parity", "rows": 26'], ["done", '"figures": [ "…/data/figures/parity_pred_vs_exp.svg", … ]']],
      figs: [fig("sci-parity.svg", "Predicted vs measured zT, ±10% band", "sciplot · parity", "Parity plot of predicted against experimental zT with error band and fit statistics")],
    },
    {
      id: "arrhenius", group: "sci",
      cmd: `te sciplot ${C6}/arrhenius_sigma.csv --figure arrhenius_conductivity --formats svg png --no-show`,
      log: [["", '"recipe": "configs/plot_recipes/temperature/arrhenius_conductivity.json"'], ["ok", '"kind": "arrhenius", "rows": 18'], ["done", '"figures": [ "…/data/figures/arrhenius_conductivity.svg", … ]']],
      figs: [fig("sci-arrhenius.svg", "Arrhenius fit with a temperature top axis", "sciplot · arrhenius", "ln sigma against 1000 over T with a linear fit and activation energy")],
    },
    {
      id: "dual", group: "sci",
      cmd: "te sciplot --recipe configs/plot_recipes/dual_axis/composition_vs_carrier_mobility_dual.json data/demo/composition_Hall/nu_muh.csv --x x --y concentration --y mobility --yscale log --right-yscale log --formats svg --no-show",
      log: [["", '"recipe": "configs/plot_recipes/dual_axis/composition_vs_carrier_mobility_dual.json"'], ["ok", '"kind": "dual_line", "rows": 10'], ["done", '"figures": [ "data/demo/composition_Hall/figures/dual_axis_composition_vs_carrier_mobility.svg" ]']],
      figs: [fig("sci-dual-axis.svg", "Carrier concentration and mobility", "sciplot · dual axis", "Carrier concentration and Hall mobility versus composition on two log axes")],
    },
    {
      id: "bar", group: "sci",
      cmd: 'te sciplot --recipe configs/plot_recipes/bar/grouped_bar.json "data/demo/sound velocity/sound vvelocity.csv" --x x --y vl --y vs --y va --ylim 0 5000 --formats svg --no-show',
      log: [["", '"recipe": "configs/plot_recipes/bar/grouped_bar.json"'], ["ok", '"kind": "grouped_bar", "rows": 18'], ["done", '"figures": [ "data/demo/sound velocity/figures/grouped_bar.svg" ]']],
      figs: [fig("sci-grouped-bar.svg", "Sound velocity comparison", "sciplot · grouped bar", "Grouped bar chart of longitudinal, shear and average sound velocity")],
    },
    {
      id: "hall", group: "sci",
      cmd: `te sciplot --recipe ${C7}/recipes/hall_composition_dual.json --no-show`,
      log: [["", `"recipe": "${C7}/recipes/hall_composition_dual.json"`], ["ok", '"kind": "dual_line", "rows": 10'], ["done", '"figures": [ "…/figures/03_hall_composition_dual_axis.svg", … ]']],
      figs: [fig("c7-hall.svg", "Room-temperature n<sub>H</sub> and μ<sub>H</sub> vs composition", "sciplot · dual axis", "Hall carrier concentration and mobility versus composition on two axes")],
    },
    {
      id: "vtmob", group: "sci",
      cmd: `te sciplot --recipe ${C7}/recipes/vt_hall_mobility.json --no-show`,
      log: [["", `"recipe": "${C7}/recipes/vt_hall_mobility.json"`], ["ok", '"kind": "line", "rows": 55'], ["done", '"figures": [ "…/figures/04_hall_vt_mobility.svg", … ]']],
      figs: [fig("c7-vtmob.svg", "Hall mobility μ<sub>H</sub>(T), 300–800 K", "sciplot · recipe", "Hall mobility versus temperature for several samples")],
    },
    {
      id: "teg", group: "dev",
      cmd: `te sciplot --recipe ${C8}/recipes/teg_iv_power_dual.json --no-show`,
      log: [["", `"recipe": "${C8}/recipes/teg_iv_power_dual.json"`], ["ok", '"kind": "dual_line", "rows": 70'], ["done", '"figures": [ "…/figures/01_teg_iv_power_dual_axis.svg", … ]']],
      figs: [fig("c8-iv.svg", "TEG voltage and power vs current, ΔT = 150–500 K", "sciplot · dual axis", "Generator output voltage and power against current for several temperature differences")],
    },
    {
      id: "eff", group: "dev",
      cmd: `te sciplot --recipe ${C8}/recipes/teg_conversion_efficiency.json --no-show`,
      log: [["", `"recipe": "${C8}/recipes/teg_conversion_efficiency.json"`], ["ok", '"kind": "line", "rows": 179'], ["done", '"figures": [ "…/figures/02_teg_conversion_efficiency.svg", … ]']],
      figs: [fig("c8-eff.svg", "TEG conversion efficiency η(I)", "sciplot · recipe", "Generator conversion efficiency against current for several temperature differences")],
    },
    {
      id: "cop", group: "dev",
      cmd: `te sciplot --recipe ${C8}/recipes/tec_peltier_cop.json --no-show`,
      log: [["", `"recipe": "${C8}/recipes/tec_peltier_cop.json"`], ["ok", '"kind": "line", "rows": 38'], ["done", '"figures": [ "…/figures/03_tec_peltier_cop.svg", … ]']],
      figs: [fig("c8-cop.svg", "Peltier cooler COP(I)", "sciplot · recipe", "Coefficient of performance of a Peltier cooler against current for several temperature differences")],
    },
    {
      id: "qc", group: "dev",
      cmd: `te sciplot --recipe ${C8}/recipes/tec_cooling_capacity_qc.json --no-show`,
      log: [["", `"recipe": "${C8}/recipes/tec_cooling_capacity_qc.json"`], ["ok", '"kind": "line", "rows": 54'], ["done", '"figures": [ "…/figures/04_tec_cooling_capacity_qc.svg", … ]']],
      figs: [fig("c8-qc.svg", "Peltier cooling capacity Q<sub>c</sub>(I)", "sciplot · recipe", "Cooling capacity of a Peltier module against current for several temperature differences")],
    },
    {
      id: "mass", chip: "SPB Pisarenko", group: "spb",
      cmd: `te spb effective-mass ${CU}/Cu2Se-series.csv --group-by curve_id --params ${CU}/Cu2Se_params.csv --legend inside --ylim 0 400 --no-show`,
      log: [["ok", "SPB effective mass multi-fit finished"], ["", "groups: 2"], ["", "Summary by group: outputs/models/spb/effective_mass_fit/fit_summary_by_group.csv"], ["done", "Plot: outputs/models/spb/effective_mass_fit/pisarenko_fit.svg"]],
      figs: [fig("spb-mass.svg", "Pisarenko curves at 300 and 750 K", "spb effective-mass", "Seebeck versus Hall carrier concentration with SPB curves at 300 and 750 K")],
    },
    {
      id: "perf", group: "spb",
      cmd: `te spb performance ${CU}/Cu2Se-300K.csv --kL 0.3 --xlim 5e19 5e21 --no-show`,
      log: [["ok", "m*/me fit: 2.3894"], ["", "Seebeck RMSE: 4.88 uV/K"], ["", "Mobility model: mu_H(eta) from mu0 = 34.3 cm^2/V/s, lambda = 0 (fit)"], ["done", "PF plot: outputs/models/spb/performance_fit/pf_fit.svg"], ["done", "ZT plot: outputs/models/spb/performance_fit/zt_fit.svg"]],
      figs: [
        fig("spb-pf.svg", "Power factor versus n<sub>H</sub>", "spb performance", "SPB power-factor fit versus carrier concentration"),
        fig("spb-zt.svg", "Predicted zT versus n<sub>H</sub>", "spb performance", "SPB zT prediction versus carrier concentration"),
      ],
    },
    {
      id: "cond", group: "spb",
      cmd: "te spb conductivity data/demo/spb_fitting/Cu2SSeTe/900K.csv --T 900 --kL 0.3 --ylim pf 0 15 --no-show",
      log: [["", "Mobility model: weighted mu_H(eta) from mu0 = 27.4 cm^2/V/s, lambda = 0 (fit)"], ["", "Lattice thermal conductivity: 0.3 W/m/K (specified)"], ["done", "SEEBECK plot: outputs/models/spb/conductivity_fit/conductivity_seebeck_fit.svg"], ["done", "PF plot: outputs/models/spb/conductivity_fit/conductivity_pf_fit.svg"], ["done", "ZT plot: outputs/models/spb/conductivity_fit/conductivity_zt_fit.svg"]],
      figs: [
        fig("spb-sigma-seebeck.svg", "Seebeck versus conductivity", "spb conductivity", "SPB Seebeck fit against electrical conductivity"),
        fig("spb-sigma-pf.svg", "Power factor versus conductivity", "spb conductivity", "SPB power-factor fit against electrical conductivity"),
        fig("spb-sigma-zt.svg", "zT versus conductivity", "spb conductivity", "SPB zT fit against electrical conductivity"),
      ],
    },
    {
      id: "callaway", chip: "Debye–Callaway κL", group: "phys",
      cmd: `te callaway ${PHYS}/paper_demo_kl_4_300K.csv --theta-d 146 --vs 1445 --mechanisms U B PD RES --spectral-xaxis meV --spectral-norm x --rattler-damping 0 --formats svg png --no-show`,
      log: [["ok", "Callaway fit complete -> R^2 = 0.9918, RMSE = 0.0153 W m^-1 K^-1"], ["", "Median phonon MFP at 300 K: 0.7 nm"], ["warn", "warning: Strong parameter collinearity between grain_size_nm and rattler_theta_e_k (r = -0.929); consider fixing one from independent Hall/optical/DFT data."]],
      figs: [
        fig("cal-fit.svg", "4–300 K κ<sub>L</sub>, mechanism by mechanism", "callaway", "Lattice thermal conductivity from 4 to 300 K with cumulative Umklapp, boundary, point-defect and resonant fits"),
        fig("cal-spectral.svg", "Spectral κ<sub>s</sub>(ħω) and cumulative MFP", "callaway", "Spectral lattice thermal conductivity in meV and cumulative mean free path at 300 K"),
      ],
      more: [fig("cal-contrib.svg", "Scattering rates and mechanism shares S<sub>m</sub>(T)", "callaway", "Relaxation rates of each mechanism and their temperature-dependent shares", true)],
    },
    {
      id: "cp", group: "phys",
      cmd: `te debye-einstein ${PHYS}/cp_rattler.csv --atoms-per-fu 4 --n-einstein 2 --volume-a3-per-fu 116.8 --formats svg png --no-show`,
      log: [["ok", "Debye-Einstein fit -> Theta_D=213.7K, gamma=0.80 mJ/molK^2, Theta_E1=36.0K (w=0.065), Theta_E2=79.1K (w=0.131)"]],
      figs: [fig("de-cp.svg", "C<sub>p</sub>/T<sup>3</sup> boson peak, Debye + two Einstein modes", "debye-einstein", "Low-temperature heat capacity over T cubed with Debye and two Einstein contributions", true)],
    },
    {
      id: "semimetal", chip: "Two-band semimetal", group: "phys",
      cmd: `te two-band ${C2}/data/Mg3_2Bi2_semimetal.csv --mode semimetal --fix-m1 0.53 --fix-m2 0.276 --fix-ndop 0 --formats svg png --no-show`,
      log: [["ok", "Two-Band (semimetal:hall-split) @ 300 K -> E_g=-0.100 eV, S_e=-150.0 uV/K, S_h=+89.0 uV/K, mu_e=364.4, mu_h=84.5 cm^2/Vs (mu_e/mu_h=4.31, A=11.47)"]],
      figs: [fig("tb-semimetal.svg", "Mg<sub>3.2</sub>Bi<sub>2</sub>: electron and hole split", "two-band --mode semimetal", "Point-by-point split of Seebeck and mobility into electron and hole bands with the band gap versus temperature", true)],
    },
    {
      id: "convergence", group: "phys",
      cmd: `te two-band ${C3}/data/kim2017_x075_full300K_pf.csv --mode convergence -T 300 --fix-m1 0.326 --fix-m2 0.916 --fix-delta-e 0.025 --formats svg png --no-show`,
      log: [["ok", "Two-Band (convergence) fit -> m*_1=0.33 m_e, m*_2=0.92 m_e, Delta_E=0.025 eV, b=2.74, RMSE(|S|)=31.95 uV/K"]],
      figs: [fig("tb-convergence.svg", "Light + heavy valence bands, S and PF vs n<sub>H</sub>", "two-band --mode convergence", "Seebeck and power factor against carrier concentration for a two-valence-band model", true)],
    },
    {
      id: "bipolar", group: "phys",
      cmd: `te two-band ${C3}/data/kim2017_x075_2.64E19_bipolar.csv --mode bipolar --fix-m1 1.14 --fix-m2 0.78 --fix-eg0 0.194 --formats svg png --no-show`,
      log: [["ok", "Two-Band (bipolar) fit -> E_g0=+0.194 eV (GS=0.161 eV), N_dop=3.50e+19 cm^-3, b=3.51, A_0=1.98, RMSE(S)=10.20 uV/K"], ["warn", "warning: Strong parameter collinearity between kL_A_W_m and kL_inf_W_mK (r = -0.989); consider fixing one from independent Hall/optical/DFT data."], ["warn", "warning: High Jacobian condition number (654.6); check parameter uncertainties and correlations."]],
      figs: [fig("tb-bipolar.svg", "Bipolar excitation and κ<sub>bi</sub>(T)", "two-band --mode bipolar", "Temperature-dependent Seebeck, conductivity and bipolar thermal conductivity from a two-band fit", true)],
    },
  ];
  const byId = (id) => demos.find((d) => d.id === id);
  const featured = demos.filter((d) => d.chip);
  const figOf = (id, i = 0) => byId(id).figs[i];

  /* ---------- Agent catalogue ----------
   * The agent (Claude Code, Codex, Cursor or Antigravity) reads AGENTS.md, loads one of the five
   * skills in .agents/skills/ for each part of a request, and runs `te` commands headless. */
  const ROLES = {
    lead: { name: "agent", idle: "reads AGENTS.md", runs: "routes by skill" },
    workspace: { name: "te-workspace", idle: "not loaded", runs: "init" },
    pipeline: { name: "te-data-pipeline", idle: "not loaded", runs: "analyze · sync · assess" },
    plotting: { name: "te-plotting", idle: "not loaded", runs: "plot-te · sciplot" },
    xrd: { name: "te-xrd", idle: "not loaded", runs: "plot-xrd · xrd-lattice" },
    physics: { name: "te-physics-models", idle: "not loaded", runs: "callaway · spb · two-band" },
  };
  const STATE_LABEL = {
    idle: "idle", listening: "reading", delegating: "routing", loaded: "loaded", running: "running",
    stopped: "exit 2", asking: "needs you", done: "done",
  };

  const agentDemos = [
    {
      id: "a-init", chip: "Set up a project folder", roles: ["workspace"], done: "Folder ready", live: "tree",
      prompt: "Set this empty folder up for a CuInTe2 doping study. I'll sort raw data by system, then by batch.",
      steps: [
        { t: "lead", text: "New folder with no configs/workspace.json → te-workspace" },
        { t: "skill", role: "workspace" },
        { t: "cmd", role: "workspace", cmd: "te init --check" },
        { t: "log", role: "workspace", text: "TEDEX Workspace Status: UNINITIALIZED (using fallback defaults)" },
        { t: "log", role: "workspace", text: "Confirm the following items with the user before running `te init --yes ...`:" },
        { t: "exit", role: "workspace", code: 2, note: "onboarding checklist, nothing written" },
        {
          t: "ask", role: "workspace",
          text: "Before I write anything: default folders (data/raw, data/processed, data/metadata, outputs/…), grouping by_system_batch, no batch prefix, Cu-Kα XRD and SVG figures. Create the workspace with these?",
          yes: "Create it", no: "Change a folder",
          yesSay: "Yes, create it.", noSay: "Wait, my XRD cards are on the shared lab drive.",
          noSteps: [
            { t: "report", role: "workspace", text: "Nothing written. Send the path and I'll add --xrd-cards-dir <path> to te init --yes." },
            { t: "lead", final: true, text: "Paused until you give me the XRD card folder." },
          ],
          noDone: "Waiting for a folder path",
        },
        { t: "cmd", role: "workspace", cmd: 'te init --yes --name "CuInTe2 Doping Study" --grouping by_system_batch' },
        { t: "log", role: "workspace", mark: "ok", text: "Initialized TEDEX workspace" },
        { t: "log", role: "workspace", text: "Grouping mode              : by_system_batch (prefix=none)" },
        { t: "exit", role: "workspace", code: 0, fill: ["config", "folders", "ledgers"], outputs: [["json", "configs/workspace.json"], ["json", "data/metadata/batches.json"], ["json", "data/metadata/samples.json"], ["markdown", "data/metadata/lab_metadata.md"], ["file", "outputs/cache/.gitignore"]] },
        { t: "cmd", role: "workspace", cmd: "te init --check" },
        { t: "log", role: "workspace", mark: "ok", text: "TEDEX Workspace Status: INITIALIZED" },
        { t: "exit", role: "workspace", code: 0, note: "workspace ready" },
        { t: "report", role: "workspace", text: "No Python or skill files were added to this folder." },
        { t: "lead", final: true, text: "Done. Put ZEM and LFA exports under data/raw/<system>/<batch_id>/, then ask me to sync and analyze." },
      ],
    },
    {
      id: "a-kl", chip: "Fit κL, a constant missing", roles: ["physics"], done: "Fit done",
      prompt: "Fit the 4–300 K lattice thermal conductivity in paper_demo_kl_4_300K.csv with Umklapp, boundary, point-defect and rattler scattering.",
      steps: [
        { t: "lead", text: "Phonon transport model → te-physics-models" },
        { t: "skill", role: "physics" },
        { t: "cmd", role: "physics", cmd: `te callaway ${PHYS}/paper_demo_kl_4_300K.csv --mechanisms U B PD RES --no-show` },
        { t: "log", role: "physics", text: "Missing Debye lattice parameters (`--theta-d` and `--vs`)." },
        { t: "log", role: "physics", text: "[Option 1 - Direct]      `--theta-d <K> --vs <m/s>`" },
        { t: "log", role: "physics", text: "[Option 2 - Ultrasonic]  `--vl <m/s> --vt <m/s>` plus `--atomic-volume-a3 <A^3>`" },
        { t: "log", role: "physics", text: "[Option 3 - Low-T Cp]    `--cp-csv <path>` (or `--cp-beta <mJ/molK^4>`) plus `--atoms-per-fu <N>`" },
        { t: "exit", role: "physics", code: 2, note: "Θ_D and v_s missing, nothing fitted" },
        {
          t: "ask", role: "physics",
          text: "Callaway needs a Debye temperature and an average sound velocity, and I won't guess material constants. Which of the three sets can you give me?",
          yes: "Θ_D 146 K, v_s 1445 m/s", no: "Only low-T Cp(T)",
          yesSay: "Use Θ_D = 146 K and v_s = 1445 m/s.", noSay: "I only have low-temperature Cp(T).",
          noSteps: [
            { t: "report", role: "physics", text: "Then it's option 3: send the Cp(T) file, atoms per formula unit and the cell volume, and debye-calc derives Θ_D and v_s first." },
            { t: "lead", final: true, text: "Paused until the Cp(T) file and cell volume are in." },
          ],
          noDone: "Waiting for Cp(T) data",
        },
        { t: "cmd", role: "physics", cmd: byId("callaway").cmd },
        { t: "log", role: "physics", mark: "ok", text: "Callaway fit complete -> R^2 = 0.9918, RMSE = 0.0153 W m^-1 K^-1" },
        { t: "log", role: "physics", text: "Median phonon MFP at 300 K: 0.7 nm" },
        { t: "log", role: "physics", mark: "warn", text: "warning: Strong parameter collinearity between grain_size_nm and rattler_theta_e_k (r = -0.929); consider fixing one from independent Hall/optical/DFT data." },
        { t: "exit", role: "physics", code: 0, count: 13, outputs: [["figure", "outputs/models/callaway/paper_demo_kl_4_300K_callaway_fit.svg"], ["figure", "outputs/models/callaway/paper_demo_kl_4_300K_callaway_spectral_mfp.svg"], ["markdown", "outputs/models/callaway/paper_demo_kl_4_300K_callaway_report.md"], ["json", "outputs/models/callaway/paper_demo_kl_4_300K_callaway_summary.json"]] },
        { t: "report", role: "physics", text: "Θ_E = 29.5 ± 1.7 K from the summary JSON. Grain size and Θ_E move together (r = −0.929), so the fit can't separate them on its own." },
        { t: "lead", final: true, text: "Fit done: R² = 0.992, rattler Θ_E ≈ 29.5 K. Send a SEM grain size and I'll refit with --grain-size-nm to pin down Θ_E." },
      ],
      figs: [figOf("callaway", 0), figOf("callaway", 1)],
    },
    {
      id: "a-xrd", chip: "In-situ XRD phase study", roles: ["xrd"], done: "Figures ready",
      prompt: "Map the 300–750 K in-situ XRD series, mark the 635 K transition, and zoom in on the (112) peak shift for five of the temperatures.",
      steps: [
        { t: "lead", text: "Diffraction layouts → te-xrd" },
        { t: "skill", role: "xrd" },
        { t: "cmd", role: "xrd", cmd: byId("vtmap").cmd },
        { t: "log", role: "xrd", text: "Output group: vt_xrd_cigt_8patterns" },
        { t: "log", role: "xrd", text: "Layout: vt_map" },
        { t: "exit", role: "xrd", code: 0, count: 2, outputs: [["figure", "…/vt_xrd_cigt/figures/vt_xrd_cigt_8patterns_XRD_vt_map.svg"]] },
        { t: "cmd", role: "xrd", cmd: byId("zoom").cmd },
        { t: "log", role: "xrd", text: "XRD patterns: 300 K, 450 K, 600 K, 650 K, 750 K" },
        { t: "log", role: "xrd", text: "Layout: zoom" },
        { t: "exit", role: "xrd", code: 0, count: 2, outputs: [["figure", "…/vt_xrd_cigt/figures/vt_xrd_cigt_5patterns_pick_1_3_5_6_8_XRD_zoom.svg"]] },
        { t: "report", role: "xrd", text: "2 runs, both exit 0 · --pick 13568 keeps each pattern tied to its legend.txt label" },
        { t: "lead", final: true, text: "Both figures are ready: the in-situ map with the 635 K line, and the (112) zoom across five temperatures." },
      ],
      figs: [figOf("vtmap"), figOf("zoom")],
    },
    {
      id: "a-band", chip: "Band model vs. the paper", roles: ["physics", "plotting"], done: "Figures ready",
      prompt: "For p-type Bi0.5Sb1.5Te3 at 300 K, fit the light + heavy valence-band model and compare its zT curve with SPB, SKB and the published curve.",
      steps: [
        { t: "lead", text: "Band model → te-physics-models · comparison figure → te-plotting" },
        { t: "skill", role: "physics" },
        { t: "cmd", role: "physics", cmd: byId("convergence").cmd },
        { t: "log", role: "physics", mark: "ok", text: "Two-Band (convergence) fit -> m*_1=0.33 m_e, m*_2=0.92 m_e, Delta_E=0.025 eV, b=2.74, RMSE(|S|)=31.95 uV/K" },
        { t: "exit", role: "physics", code: 0, count: 5, outputs: [["figure", "outputs/models/two_band/kim2017_x075_full300K_pf_two_band_convergence.svg"], ["json", "outputs/models/two_band/kim2017_x075_full300K_pf_two_band_convergence_summary.json"]] },
        { t: "skill", role: "plotting" },
        { t: "cmd", role: "plotting", cmd: `te sciplot --recipe ${C3}/recipes/kim2017_zt_compare.json --no-show` },
        { t: "log", role: "plotting", text: '"kind": "line", "rows": 775' },
        { t: "exit", role: "plotting", code: 0, count: 2, outputs: [["figure", `${C3}/figures/fig5a_zt_model_comparison.svg`]] },
        { t: "report", role: "plotting", text: "Four curves on the paper's axes, legend placed inside the frame" },
        { t: "lead", final: true, text: "With m*₁ = 0.33, m*₂ = 0.92 mₑ and ΔE = 25 meV held fixed, the fit gives b = 2.74. The comparison overlays it on SPB, SKB and the paper." },
      ],
      figs: [figOf("convergence"), fig("kim-zt.svg", "zT(n<sub>H</sub>): paper vs two-band, SPB and SKB", "sciplot · recipe", "zT against carrier concentration for four models")],
    },
  ];

  /* ---------- Showcase cases (from showcase/showcase_manifest.json) ---------- */
  const CASES = [
    {
      n: "01", short: "PbSe · SKB vs SPB", cat: "Electronic band physics", roles: ["physics", "plotting"],
      title: "Non-parabolic Kane band vs. parabolic band in narrow-gap PbSe",
      system: "n-type PbSe · 303–723 K",
      prompt: "Fit Pisarenko curves at 323, 523 and 723 K and the 303 K Hall mobility, comparing a single Kane band (SKB) with a single parabolic band (SPB), and show how each changes κL once κe is subtracted. Solid markers for the x = 0 base, hollow for the alloys.",
      metrics: [["E<sub>g</sub> at 303 K", "0.271 eV (α = 0.096)"], ["SKB m*<sub>d</sub>, 323 → 723 K", "0.28 → 0.35 → 0.45 m<sub>e</sub>"], ["μ<sub>0</sub> at 303 K, SKB vs SPB", "5092 vs 2090 cm² V⁻¹ s⁻¹"], ["RMSE(μ<sub>H</sub>), SKB vs SPB", "97.7 vs 139.0 cm² V⁻¹ s⁻¹"]],
      note: "SPB folds the band's non-parabolicity into a heavier apparent mass, so it underestimates μ<sub>0</sub> and misses the steeper mobility drop at high doping.",
      cmds: [`te skb ${C1}/data/rt_303K_x0_full.csv -T 303 --eg 0.271 --nv 4 --no-hall-factor --formats svg png --no-show`, `te sciplot --recipe ${C1}/recipes/pisarenko_x0_solid_hollow.json --no-show`],
      figs: [fig("pbse-pisarenko.svg", "Pisarenko at 323 / 523 / 723 K, SKB solid vs SPB dashed"), fig("pbse-mobility.svg", "303 K Hall mobility μ<sub>H</sub>(n<sub>H</sub>)")],
    },
    {
      n: "02", short: "Mg₃Bi₂ · semimetal", cat: "Semimetal & bipolar physics", roles: ["physics"],
      title: "Electron and hole transport across the semimetal-to-semiconductor crossover",
      system: "Mg<sub>3.2</sub>Bi<sub>2−x</sub>Sb<sub>x</sub>Te<sub>y</sub> · x = 0, 0.3, 0.5 · 100–350 K",
      prompt: "Split Hall, Seebeck and conductivity into electron and hole contributions from the semimetal (x = 0, overlapping bands) to the near-room-temperature cooling compositions, then break κ into κL + κe + κbi for x = 0.5.",
      metrics: [["E<sub>g</sub>(300 K), x = 0", "−0.100 eV (band overlap)"], ["Partial Seebeck, 300 K", "S<sub>e</sub> = −150.0, S<sub>h</sub> = +89.0 µV K⁻¹"], ["Weighted mobility ratio", "A(x = 0) = 11.5 → A<sub>0</sub>(x = 0.5) = 1.47"], ["RMSE(S), x = 0.5", "11.4 µV K⁻¹ (E<sub>g0</sub> = +0.126 eV)"]],
      note: "DOS masses are fixed at 0.53 and 0.276 m<sub>e</sub>; without them <code>--mode semimetal</code> exits with code 2. The summary flags A and κ<sub>∞</sub> in κ<sub>L</sub> = A/T + κ<sub>∞</sub> as collinear (r = −0.925) over the narrow window.",
      cmds: [byId("semimetal").cmd, `te two-band ${C2}/data/Mg3_2Bi1_498Sb0_5Te0_002.csv --mode bipolar --matthiessen --fit-nh --fix-m2 0.276 --fix-eg0 0.126 --fix-ndop 1.32e19 --formats svg png --no-show`],
      figs: [fig("tb-semimetal.svg", "x = 0: point-by-point Hall + S + σ inversion", "", "", true), fig("mg-cooling.svg", "x = 0.5 cooling leg: global bipolar fit and κ<sub>bi</sub>", "", "", true)],
    },
    {
      n: "03", short: "BiSbTe · band convergence", cat: "Band convergence modeling", roles: ["physics", "plotting"],
      title: "Light + heavy valence bands in p-Bi<sub>0.5</sub>Sb<sub>1.5</sub>Te<sub>3</sub>, benchmarked against the paper",
      system: "p-type Bi<sub>2−x</sub>Sb<sub>x</sub>Te<sub>3</sub>, x = 0.75 · 300–500 K",
      prompt: "Run SPB, SKB and a two-band model with ΔE = 0.025 eV on the 300 K doping series and the variable-temperature data, and overlay their Pisarenko, mobility and zT predictions on the published curve.",
      metrics: [["Band offset ΔE (fixed)", "0.025 eV, m*<sub>1</sub> = 0.33, m*<sub>2</sub> = 0.92 m<sub>e</sub>"], ["Peak zT, 300 K", "1.03 (paper) vs 1.01–1.02 (TEDEX)"], ["Bandgap E<sub>g0</sub>", "0.194 eV"]],
      note: "The bipolar fit flags the two κ<sub>L</sub> terms as collinear (r = −0.989) and a high Jacobian condition number, both printed as warnings.",
      cmds: [byId("convergence").cmd, byId("bipolar").cmd, `te sciplot --recipe ${C3}/recipes/kim2017_zt_compare.json --no-show`],
      figs: [fig("kim-zt.svg", "300 K zT(n<sub>H</sub>): paper vs two-band, SPB and SKB"), fig("tb-convergence.svg", "Two-band fit of S and PF vs n<sub>H</sub>", "", "", true), fig("tb-bipolar.svg", "High-T bipolar excitation and κ<sub>bi</sub>", "", "", true)],
    },
    {
      n: "04", short: "κL · rattler phonons", cat: "Phonon transport & heat capacity", roles: ["physics"],
      title: "Debye–Callaway resonant scattering, spectral MFP and the C<sub>p</sub>/T<sup>3</sup> boson peak",
      system: "Cage-like rattler chalcogenide · 4–300 K",
      prompt: "Fit 4–300 K κL with Umklapp, boundary, point-defect and resonant scattering; show the cumulative fit, spectral κs(ħω) in meV, the cumulative MFP and each mechanism's share; then fit the low-T Cp/T³ boson peak with Einstein modes.",
      metrics: [["Callaway fit", "R² = 0.9918, RMSE = 0.0153 W m⁻¹ K⁻¹"], ["Resonant mode Θ<sub>E</sub>", "29.5 ± 1.7 K (2.54 meV)"], ["Median MFP Λ<sub>50%</sub>, 300 K", "0.68 nm"], ["Point-defect disorder Γ", "0.1007"]],
      note: "Without Θ<sub>D</sub> and v<sub>s</sub> the fit stops at exit 2 with three ways to supply them. With them, the summary warns that grain size and Θ<sub>E</sub> are collinear (r = −0.929).",
      cmds: [byId("callaway").cmd, byId("cp").cmd],
      figs: [fig("cal-fit.svg", "Cumulative fit U → +B → +PD → +RES", "", ""), fig("cal-spectral.svg", "300 K spectral κ<sub>s</sub>(ħω) and cumulative MFP", "", ""), fig("de-cp.svg", "C<sub>p</sub>/T<sup>3</sup>: Sommerfeld + Debye + two Einstein modes", "", "", true)],
    },
    {
      n: "05", short: "XRD · in-situ suite", cat: "Crystal structure & phase evolution", roles: ["xrd"],
      title: "Six XRD layouts: peak-shift zoom, in-situ maps, Rietveld and Williamson–Hall",
      system: "Chalcopyrite CuIn<sub>1−x</sub>Ga<sub>x</sub>Te<sub>2</sub>–ZnSe · 300–750 K",
      prompt: "Make a full structural figure set: stacked patterns with a (112) zoom, a 300–750 K in-situ map marking the 635 K transition, a temperature-coloured waterfall, a two-phase Rietveld residual plot, a pseudo-Voigt split of the tetragonal doublet and a Williamson–Hall size and strain fit.",
      metrics: [["Layouts", "8: stack, separate, zoom, vt-map, vt-stack, rietveld, peak-fit, WH"], ["In-situ window", "300–750 K, T<sub>c</sub> = 635 K"], ["Outputs", "R<sub>wp</sub> / χ², pseudo-Voigt FWHM, D (nm) and ε, (a, b, c)"]],
      note: "<code>--pick 13568</code> selects patterns by folder order and keeps each one tied to its <code>legend.txt</code> label.",
      cmds: [byId("zoom").cmd, byId("vtmap").cmd, byId("rietveld").cmd, byId("wh").cmd],
      figs: [fig("xrd-zoom.svg", "Stack + (112) zoom"), fig("xrd-vtmap.webp", "In-situ (2θ, T) map"), fig("xrd-rietveld.webp", "Two-phase Rietveld residual"), fig("xrd-wh.svg", "Williamson–Hall regression")],
    },
    {
      n: "06", short: "sciplot · chart gallery", cat: "Scientific data visualization", roles: ["plotting"],
      title: "20+ publication chart kinds without hand-written matplotlib",
      system: "Cross-system screening, ML and device data",
      prompt: "Make κ breakdown and percentage bars, a zT waterfall, a (T, x) zT contour, a ternary composition map, an ML parity plot, an Arrhenius fit and a radar chart in one consistent style.",
      metrics: [["Chart kinds", "20+ 1D, 2D, ternary, statistical and diagnostic"], ["Legends", "Inside the axes, placed to avoid the data"], ["Exports", "SVG / PDF, high-DPI PNG and a normalized CSV"]],
      note: "Every kind works from command-line flags (<code>--figure contour …</code>) or from a JSON recipe that can be versioned and reused.",
      cmds: [byId("contour").cmd, byId("ternary").cmd, byId("parity").cmd, byId("arrhenius").cmd],
      figs: [fig("sci-contour.svg", "(T, x) zT contour"), fig("sci-ternary.svg", "Ternary composition map"), fig("sci-parity.svg", "ML parity with ±10% band"), fig("sci-arrhenius.svg", "Arrhenius fit and E<sub>a</sub>")],
    },
    {
      n: "07", short: "Classical TE + SPB", cat: "Classical TE transport & SPB", roles: ["plotting", "physics"],
      title: "Bulk transport, Hall characterization and SPB modeling in one figure set",
      system: "p → n chalcogenide doping series (300–575 K) · Cu<sub>2</sub>Se (300 / 750 K) · Cu<sub>2</sub>(S,Se,Te) (900 K)",
      prompt: "Make the standard figure set for a thermoelectric paper: a 2 × 3 transport summary (S, σ, PF, κ, κL, zT) for a p → n doping series and a single zT(T) figure, a room-temperature n_H / μ_H dual-axis plot, μ_H(T) from 300 to 800 K, and SPB zT predictions for Cu2Se with Hall data and for Cu2(S,Se,Te) at 900 K without it.",
      metrics: [["Conduction type, x = 0 → 0.007", "p (+337 µV K⁻¹) → n (−315 µV K⁻¹)"], ["Peak zT, p / n", "1.08 (524 K) / 1.00 (574 K)"], ["Cu<sub>2</sub>Se SPB, 300 / 750 K", "m* = 2.3 / 3.2 m<sub>e</sub>, peak zT 1.22"], ["900 K σ-axis SPB", "μ<sub>0</sub> = 27.4 cm² V⁻¹ s⁻¹ (κ<sub>L</sub> = 0.45)"]],
      note: "<code>plot-te</code> reads the sample labels from <code>legend.txt</code> in the data folder. The 900 K fit needs no Hall data: it recovers the weighted mobility from Seebeck against conductivity.",
      cmds: [byId("summary").cmd, byId("hall").cmd, byId("vtmob").cmd, `te spb performance ${C7}/data/cu2se_spb_series.csv --params ${C7}/data/cu2se_spb_params.csv --xlim 1e20 2.5e21 --legend inside --formats svg png --no-show`, `te spb conductivity ${C7}/data/cu2ssete_900K.csv --temperature 900 --kL 0.45 --legend inside --formats svg png --no-show`],
      figs: [fig("c7-summary.svg", "2 × 3 transport summary across the p → n transition", "", "", true), fig("c7-zt.svg", "zT(T) for the doping series"), fig("c7-hall.svg", "Room-temperature n<sub>H</sub> and μ<sub>H</sub>"), fig("c7-vtmob.svg", "μ<sub>H</sub>(T), 300–800 K"), fig("c7-spb-zt.svg", "Cu<sub>2</sub>Se SPB zT(n<sub>H</sub>) at 300 and 750 K"), fig("c7-spb-sigma-zt.svg", "Cu<sub>2</sub>(S,Se,Te) SPB zT(σ) at 900 K")],
    },
    {
      n: "08", short: "TE devices · TEG & TEC", cat: "TE device & module engineering", roles: ["plotting"],
      title: "Module tests: generator power and efficiency, Peltier COP and cooling capacity",
      system: "Thermoelectric generator (TEG) and Peltier cooler (TEC) modules at several ΔT",
      prompt: "Plot the module test data: TEG voltage and power against current at ΔT = 150–500 K on two axes, TEG efficiency against current at ΔT = 350–550 K, and the Peltier cooler's COP and cooling capacity against current at several ΔT, all with legends inside the frame and one consistent style.",
      metrics: [["TEG at ΔT = 500 K", "V<sub>oc</sub> = 2.12 V, P<sub>max</sub> = 4.40 mW"], ["Peak TEG efficiency, ΔT = 550 K", "η<sub>max</sub> = 12.3% at I ≈ 3.1 A"], ["Peak Peltier COP, ΔT = 5 K", "COP<sub>max</sub> = 21.3"], ["Max cooling capacity, ΔT = 0 K", "Q<sub>c,max</sub> = 5.97 W at 19.9 A"]],
      note: "Each voltage curve and its power curve share one colour per ΔT. An explicit <code>group_order</code> keeps ΔT = 5, 10, 15, 20 K in physical order instead of string order.",
      cmds: [byId("teg").cmd, byId("eff").cmd, byId("cop").cmd, byId("qc").cmd],
      figs: [fig("c8-iv.svg", "TEG V(I) solid and P(I) dashed, ΔT = 150–500 K"), fig("c8-eff.svg", "TEG conversion efficiency η(I)"), fig("c8-cop.svg", "TEC coefficient of performance COP(I)"), fig("c8-qc.svg", "TEC cooling capacity Q<sub>c</sub>(I)")],
    },
  ];

  const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const stripTags = (s) => String(s).replace(/<[^>]+>/g, "");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Console ---------- */
  const consoleEl = page.querySelector("[data-ws-console]");
  const term = page.querySelector("[data-ws-term]");
  const history = page.querySelector("[data-ws-history]");
  const typed = page.querySelector("[data-ws-typed]");
  const inputPs = page.querySelector(".ws-term-input .ws-ps");
  const termTitle = page.querySelector("[data-ws-term-title]");
  const stage = page.querySelector("[data-ws-stage]");
  const empty = page.querySelector("[data-ws-empty]");
  const chipBox = page.querySelector("[data-ws-chips]");
  const pauseBtn = page.querySelector("[data-ws-pause]");
  const board = page.querySelector("[data-ws-board]");
  const modeBtns = Array.from(page.querySelectorAll("[data-ws-mode] button"));
  const modeDesc = page.querySelector("[data-ws-mode-desc]");
  const agentNote = page.querySelector("[data-ws-agent-note]");

  // Pixel lab cat under the terminal (assets/lab-cat.js).
  const labCat = window.LabCat ? window.LabCat.mount(page.querySelector(".ws-term")) : { set() {} };

  const MODES = {
    cli: {
      desc: "Pick a command. The console types it, the tool logs, and the figure lands. More commands are in the gallery below.",
      title: "tedex", ps: "$", empty: "Figures land here.", chips: "Choose a command to run",
    },
    agent: {
      desc: 'Ask in plain language. The agent loads the skill that fits, runs the same <code>te</code> commands, and stops to ask when a tool exits with code 2. <a href="#agent-workspace" data-ws-jump="ws-skills">The five skills</a>',
      title: "claude · tedex", ps: "›", empty: "Files the agent writes land here.", chips: "Choose a request for the agent",
    },
  };

  let mode = "cli";
  let runToken = 0;
  let current = -1;
  let autoplay = !reduceMotion;
  let visible = false;
  let running = false;
  let autoTimer = null;
  let chips = [];
  let pendingAsk = null;
  const catalogue = () => (mode === "agent" ? agentDemos : featured);

  function buildChips() {
    chipBox.innerHTML = "";
    chipBox.setAttribute("aria-label", MODES[mode].chips);
    chips = catalogue().map((demo, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ws-chip";
      if (mode === "agent") {
        b.classList.add("ws-chip-agent");
        b.innerHTML = `<span class="ws-chip-dots" aria-hidden="true">${demo.roles.map((r) => `<i data-role="${r}"></i>`).join("")}</span>${escapeHtml(demo.chip)}`;
      } else {
        b.dataset.group = demo.group;
        b.textContent = demo.chip;
      }
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => { setAutoplay(false); run(i); });
      chipBox.appendChild(b);
      return b;
    });
  }

  function setAutoplay(on) {
    autoplay = on;
    pauseBtn.textContent = on ? "Pause" : "Auto-play";
    pauseBtn.setAttribute("aria-pressed", String(!on));
    clearTimeout(autoTimer);
    if (pendingAsk) pendingAsk.arm(on);
    if (on && !running && visible) autoTimer = setTimeout(next, 900);
  }
  pauseBtn.addEventListener("click", () => setAutoplay(!autoplay));
  const next = () => run((current + 1) % catalogue().length);

  function addLine(html, cls = "", role = "") {
    const line = document.createElement("div");
    line.className = `ws-term-line ${cls}`.trim();
    if (role) line.dataset.role = role;
    line.innerHTML = html;
    history.appendChild(line);
    // Keep the scrollback short: the last two command runs, or the current agent request.
    const runs = history.querySelectorAll(".ws-term-cmd");
    const keep = mode === "agent" ? 1 : 2;
    if (runs.length > keep) {
      while (history.firstChild && history.firstChild !== runs[runs.length - keep]) history.removeChild(history.firstChild);
    }
    term.scrollTop = term.scrollHeight;
    return line;
  }

  function colorCommand(cmd) {
    return escapeHtml(cmd)
      .replace(/^te (\S+)( (?:effective-mass|performance|conductivity|metadata|markdown))?/, (m, c, sub) =>
        `<span class="ws-t-bin">te</span> <span class="ws-t-sub">${c}${sub || ""}</span>`)
      .replace(/(\s)(--?[a-z][\w-]*)/g, '$1<span class="ws-t-flag">$2</span>');
  }

  const MARKS = {
    ok: '<span class="ws-t-ok">✓</span> ',
    done: '<span class="ws-t-done">→</span> ',
    warn: '<span class="ws-t-warn">!</span> ',
  };

  function buildSet(figs) {
    const set = document.createElement("div");
    set.className = `ws-fig-set is-${figs.length}${figs.some((f) => f.wide) ? " has-wide" : ""}`;
    figs.forEach((f) => {
      const el = document.createElement("figure");
      el.className = "ws-fig";
      el.innerHTML = `<img src="${FIG}${f.src}" alt="${escapeHtml(f.alt)}" /><figcaption><span>${f.kicker}</span>${f.title}</figcaption>`;
      set.appendChild(el);
    });
    return set;
  }

  async function swapStage(set, token) {
    const old = stage.querySelector(".ws-fig-set");
    // Wait for images so they float out fully drawn.
    await Promise.all(Array.from(set.querySelectorAll("img")).map((img) => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
    if (token !== runToken) return;
    if (old) {
      if (reduceMotion) old.remove();
      else old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-18px) scale(0.97)" }], { duration: 260, easing: "ease-in", fill: "forwards" }).finished.then(() => old.remove());
    }
    empty.hidden = true;
    stage.classList.remove("is-busy", "is-stale");
    stage.appendChild(set);
    if (reduceMotion) return;
    Array.from(set.children).forEach((el, i) => {
      el.animate([
        { opacity: 0, transform: "translate(-34%, 14%) scale(0.55) rotate(-4deg)", filter: "blur(6px)" },
        { opacity: 1, transform: "translate(2%, -2%) scale(1.02) rotate(0.6deg)", filter: "blur(0)", offset: 0.72 },
        { opacity: 1, transform: "none", filter: "blur(0)" },
      ], { duration: 1000, delay: 160 + i * 240, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    });
  }

  function clearStage() {
    stage.querySelectorAll(".ws-fig-set").forEach((s) => s.remove());
    stage.classList.remove("is-busy", "is-stale");
    empty.textContent = MODES[mode].empty;
    empty.hidden = false;
  }

  // Long commands type faster so every run takes about the same time.
  async function typeInto(text, token, fast) {
    if (reduceMotion) { typed.textContent = text; return; }
    const budget = fast ? 3000 : 3400;
    const scale = Math.min(1, budget / (text.length * (fast ? 24 : 34)));
    for (let i = 0; i < text.length; i++) {
      if (token !== runToken) return;
      typed.textContent = text.slice(0, i + 1);
      const ch = text[i];
      const ms = fast ? (ch === " " ? 40 : 14 + Math.random() * 18) : (ch === " " ? 64 : 20 + Math.random() * 26);
      await sleep(ms * scale);
      term.scrollTop = term.scrollHeight;
    }
    await sleep(fast ? 380 : 520);
  }

  async function runCli(demo, token) {
    typed.textContent = "";
    consoleEl.classList.add("is-typing");
    labCat.set("coding", demo.chip || demo.figs[0].kicker);
    await typeInto(demo.cmd, token, false);
    if (token !== runToken) return;
    consoleEl.classList.remove("is-typing");
    addLine(`<span class="ws-ps" aria-hidden="true">$</span>${colorCommand(demo.cmd)}`, "ws-term-cmd");
    typed.textContent = "";
    stage.classList.add("is-busy");
    labCat.set("synth", demo.chip || demo.figs[0].kicker);

    for (const [kind, text] of demo.log) {
      if (!reduceMotion) await sleep(kind === "done" ? 460 : 340);
      if (token !== runToken) return;
      addLine((MARKS[kind] || "  ") + escapeHtml(text), `ws-term-out${kind === "warn" ? " is-warn" : ""}`);
    }
    await swapStage(buildSet(demo.figs), token);
    if (token !== runToken) return;
    labCat.set("done", demo.chip || demo.figs[0].kicker);
  }

  /* ---------- Agent board ---------- */
  const cards = {};
  Object.entries(ROLES).forEach(([key, r]) => {
    const card = document.createElement("article");
    card.className = "ws-role";
    card.dataset.role = key;
    card.innerHTML = `
      <header><span class="ws-role-dot" aria-hidden="true"></span><b>${r.name}</b><span class="ws-role-state"></span></header>
      <p class="ws-role-now"></p>
      <footer><span class="ws-role-writes"><span>${r.runs}</span></span><span class="ws-role-files"></span></footer>`;
    board.appendChild(card);
    cards[key] = {
      card,
      state: card.querySelector(".ws-role-state"),
      now: card.querySelector(".ws-role-now"),
      files: card.querySelector(".ws-role-files"),
      count: 0,
    };
  });

  function setRole(key, state, now) {
    const c = cards[key];
    c.card.dataset.state = state;
    c.state.textContent = STATE_LABEL[state];
    if (now !== undefined) { c.now.textContent = now; c.now.title = now; }
  }
  function addFiles(key, n) {
    const c = cards[key];
    c.count += n;
    if (key !== "lead") c.files.textContent = `${c.count} file${c.count === 1 ? "" : "s"}`;
    if (n && !reduceMotion) c.files.animate([{ transform: "scale(1.25)" }, { transform: "none" }], { duration: 320, easing: "ease-out" });
  }
  function resetBoard() {
    Object.entries(cards).forEach(([key, c]) => {
      c.count = 0;
      c.files.textContent = key === "lead" ? "" : "0 files";
      setRole(key, "idle", ROLES[key].idle);
    });
  }
  resetBoard();

  /* ---------- Agent runs ---------- */
  const roleTag = (key) => `<span class="ws-a-tag" data-role="${key}">${ROLES[key].name}</span>`;
  const STEP_DELAY = { lead: 760, skill: 520, cmd: 560, log: 360, exit: 520, report: 560, ask: 620 };

  // Mode B folder that fills in as `te init --yes` writes it.
  const TREE = [
    { key: "", text: "CuInTe2_Project/", root: true },
    { key: "folders", text: "├── configs/" },
    { key: "config", text: "│   └── workspace.json", note: "paths · grouping · units" },
    { key: "folders", text: "├── data/" },
    { key: "folders", text: "│   ├── raw/", note: "<system>/<batch_id>/" },
    { key: "folders", text: "│   ├── processed/" },
    { key: "folders", text: "│   ├── references/", note: "literature/ · xrd_cards/" },
    { key: "folders", text: "│   └── metadata/" },
    { key: "ledgers", text: "│       ├── batches.json · samples.json" },
    { key: "ledgers", text: "│       └── lab_metadata.md" },
    { key: "folders", text: "└── outputs/", note: "figures/ · models/ · reports/ · cache/" },
  ];
  function buildTree() {
    const set = document.createElement("div");
    set.className = "ws-fig-set is-1";
    const rows = TREE.map((row) =>
      `<li class="${row.root ? "is-root is-new" : ""}" data-key="${row.key}"><span>${escapeHtml(row.text)}</span>${row.note ? `<em>${escapeHtml(row.note)}</em>` : ""}</li>`).join("");
    set.innerHTML = `<figure class="ws-fig ws-artifact ws-treeart">
      <div class="ws-artifact-head"><span>CuInTe2_Project/ · Mode B data folder</span><em>empty at start</em></div>
      <ul>${rows}</ul>
      <figcaption><span>te init --yes · by_system_batch</span>Only configuration, data and outputs: no code, no skill files</figcaption>
    </figure>`;
    return set;
  }
  function fillTree(keys) {
    keys.forEach((key, k) => stage.querySelectorAll(`.ws-treeart li[data-key="${key}"]`).forEach((li, i) => {
      setTimeout(() => li.classList.add("is-new"), reduceMotion ? 0 : 120 + i * 120 + k * 260);
    }));
  }

  function ask(step, token) {
    return new Promise((resolve) => {
      const box = addLine(
        `<span class="ws-a-ask-q">${roleTag(step.role)}${escapeHtml(step.text)}</span><span class="ws-a-ask-actions"><button type="button">${escapeHtml(step.yes)}</button><button type="button">${escapeHtml(step.no)}</button></span>`,
        "ws-a-line ws-a-ask", step.role);
      const btns = Array.from(box.querySelectorAll("button"));
      let timer = null;
      let poll = null;
      const finish = (i) => {
        clearTimeout(timer);
        clearInterval(poll);
        pendingAsk = null;
        box.classList.remove("is-auto");
        btns.forEach((b, n) => { b.disabled = true; b.classList.toggle("is-chosen", n === i); });
        resolve(i);
      };
      btns.forEach((b, i) => b.addEventListener("click", () => finish(i)));
      // On auto-play the first answer is chosen after a pause; otherwise it waits for a click.
      pendingAsk = {
        arm(on) {
          clearTimeout(timer);
          box.classList.toggle("is-auto", on);
          if (on) timer = setTimeout(() => finish(0), 4200);
        },
      };
      pendingAsk.arm(autoplay);
      poll = setInterval(() => { if (token !== runToken) finish(-1); }, 150);
    });
  }

  // Plays a list of steps; resolves "ok", "declined" or "aborted".
  async function playSteps(steps, token) {
    for (const step of steps) {
      if (token !== runToken) return "aborted";
      if (!reduceMotion) await sleep(STEP_DELAY[step.t] || 420);
      if (token !== runToken) return "aborted";
      const r = step.role;
      if (step.t === "lead") {
        setRole("lead", step.final ? "done" : "delegating", step.text);
        addLine(`${roleTag("lead")}${escapeHtml(step.text)}`, "ws-a-line ws-a-lead", "lead");
      } else if (step.t === "skill") {
        setRole(r, "loaded", "SKILL.md read");
        addLine(`${roleTag(r)}<span class="ws-a-load">loaded .agents/skills/${ROLES[r].name}/SKILL.md</span>`, "ws-a-line ws-a-skill", r);
      } else if (step.t === "cmd") {
        setRole(r, "running", step.cmd.replace(/^te /, ""));
        addLine(`${roleTag(r)}<span class="ws-ps" aria-hidden="true">$</span>${colorCommand(step.cmd)}`, "ws-a-line ws-a-cmd", r);
        labCat.set("synth", ROLES[r].name, "Agent working");
      } else if (step.t === "log") {
        addLine((MARKS[step.mark] || "  ") + escapeHtml(step.text), `ws-a-line ws-a-out${step.mark === "warn" ? " is-warn" : ""}`, r);
      } else if (step.t === "exit") {
        const outs = step.outputs || [];
        const n = step.count || outs.length;
        const what = step.note || `${n} file${n === 1 ? "" : "s"} written`;
        addLine(`<span class="${step.code ? "ws-t-warn" : "ws-t-done"}">←</span> exit ${step.code} · ${escapeHtml(what)}`, `ws-a-line ws-a-json${step.code ? " is-exit2" : ""}`, r);
        outs.forEach(([kind, path]) => addLine(`<span class="ws-a-kind">${kind}</span><span class="ws-a-path">${escapeHtml(path)}</span>`, "ws-a-line ws-a-file", r));
        if (step.code) setRole(r, "stopped", "stopped with a checklist");
        addFiles(r, outs.length ? n : 0);
        if (step.fill) fillTree(step.fill);
      } else if (step.t === "ask") {
        setRole(r, "asking", "waiting for your answer");
        labCat.set("idle", "", "Waiting for your answer");
        const answer = await ask(step, token);
        if (answer < 0 || token !== runToken) return "aborted";
        addLine(`<span class="ws-ps" aria-hidden="true">›</span>${escapeHtml(answer === 0 ? step.yesSay : step.noSay)}`, "ws-a-user ws-a-reply");
        if (answer === 1) {
          setRole(r, "running", "writing up what is needed");
          const result = await playSteps(step.noSteps, token);
          return result === "aborted" ? result : "declined";
        }
        setRole(r, "running", "continuing with your answer");
        labCat.set("synth", ROLES[r].name, "Agent working");
      } else if (step.t === "report") {
        setRole(r, "done", step.text);
        addLine(`<span class="ws-t-ok">✓</span> ${escapeHtml(step.text)}`, "ws-a-line ws-a-report", r);
      }
    }
    return "ok";
  }

  async function runAgent(demo, token) {
    resetBoard();
    if (stage.querySelector(".ws-fig-set")) stage.classList.add("is-stale");
    typed.textContent = "";
    consoleEl.classList.add("is-typing");
    setRole("lead", "listening", "reading your request");
    labCat.set("coding", "", "Reading the request");
    await typeInto(demo.prompt, token, true);
    if (token !== runToken) return;
    consoleEl.classList.remove("is-typing");
    addLine(`<span class="ws-ps" aria-hidden="true">›</span><span class="ws-a-prompt">${escapeHtml(demo.prompt)}</span>`, "ws-term-cmd ws-a-user");
    typed.textContent = "";
    labCat.set("synth", "agent", "Agent working");
    if (demo.live === "tree") {
      await swapStage(buildTree(), token);
      if (token !== runToken) return;
    }
    stage.classList.add("is-busy");

    const result = await playSteps(demo.steps, token);
    if (result === "aborted" || token !== runToken) return;
    if (demo.figs && result !== "declined") await swapStage(buildSet(demo.figs), token);
    else stage.classList.remove("is-busy", "is-stale");
    if (token !== runToken) return;
    const declined = result === "declined";
    labCat.set(declined ? "idle" : "done", "", declined ? demo.steps.find((s) => s.t === "ask").noDone : demo.done);
  }

  async function run(index, override) {
    const token = ++runToken;
    clearTimeout(autoTimer);
    running = true;
    const list = catalogue();
    const demo = override || list[index];
    current = override ? Math.max(current, 0) : index;
    chips.forEach((c, i) => { const on = list[i] === demo; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
    if (mode === "agent") await runAgent(demo, token);
    else await runCli(demo, token);
    if (token !== runToken) return;
    running = false;
    if (autoplay && visible) autoTimer = setTimeout(next, mode === "agent" ? 9000 : 7000);
  }

  function setMode(nextMode) {
    if (nextMode === mode) return;
    mode = nextMode;
    runToken++;
    running = false;
    current = -1;
    clearTimeout(autoTimer);
    consoleEl.dataset.mode = mode;
    modeBtns.forEach((b) => { const on = b.dataset.mode === mode; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    board.hidden = mode !== "agent";
    agentNote.hidden = mode !== "agent";
    modeDesc.innerHTML = MODES[mode].desc;
    termTitle.textContent = MODES[mode].title;
    inputPs.textContent = MODES[mode].ps;
    history.innerHTML = "";
    typed.textContent = "";
    consoleEl.classList.remove("is-typing");
    clearStage();
    resetBoard();
    buildChips();
    labCat.set("idle");
  }

  modeBtns.forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.mode === mode) return;
    setMode(b.dataset.mode);
    run(0);
  }));
  modeDesc.addEventListener("click", (e) => {
    const link = e.target.closest("[data-ws-jump]");
    if (!link) return;
    e.preventDefault();
    document.getElementById(link.dataset.wsJump).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  modeDesc.innerHTML = MODES.cli.desc;
  empty.textContent = MODES.cli.empty;
  buildChips();

  // Play only while the console is on screen (and the Workspace view is open).
  const consoleObserver = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && current === -1) run(0);
    else if (visible && autoplay && !running) { clearTimeout(autoTimer); autoTimer = setTimeout(next, 1600); }
    else if (!visible) clearTimeout(autoTimer);
  }, { threshold: 0.35 });
  consoleObserver.observe(consoleEl);
  if (reduceMotion) setAutoplay(false);

  /* ---------- Syntax highlighting (tiny, purpose-built) ---------- */
  const RULES = {
    py: /(#.*$)|(r?"(?:[^"\\]|\\.)*")|\b(def|for|in|if|not|or|and|continue|return|import|from|None|True|False)\b|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/gm,
    json: /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:e-?\d+)?)/g,
  };

  function highlightLine(line, lang) {
    if (lang === "md") {
      if (/^#{1,6}\s/.test(line)) return `<span class="tk-h">${escapeHtml(line)}</span>`;
      if (/^<!--/.test(line)) return `<span class="tk-c">${escapeHtml(line)}</span>`;
      return escapeHtml(line)
        .replace(/`([^`]+)`/g, '<span class="tk-s">`$1`</span>')
        .replace(/\|/g, '<span class="tk-p">|</span>')
        .replace(/^(- )(Raw|Processed):/, '$1<span class="tk-k">$2</span>:');
    }
    if (lang === "sh") {
      if (/^\$ /.test(line)) return `<span class="tk-f">$</span> <span class="tk-h">${escapeHtml(line.slice(2))}</span>`;
      return escapeHtml(line).replace(/`([^`]+)`/g, '<span class="tk-s">`$1`</span>');
    }
    const re = RULES[lang];
    let out = "";
    let last = 0;
    line.replace(re, (m, ...g) => {
      const at = g[g.length - 2];
      out += escapeHtml(line.slice(last, at));
      last = at + m.length;
      if (lang === "py") {
        const [c, s, k, n, f] = g;
        if (c) out += `<span class="tk-c">${escapeHtml(c)}</span>`;
        else if (s) out += `<span class="tk-s">${escapeHtml(s)}</span>`;
        else if (k) out += `<span class="tk-k">${k}</span>`;
        else if (n) out += `<span class="tk-n">${n}</span>`;
        else if (f) out += `<span class="tk-f">${f}</span>`;
      } else {
        const [key, colon, s, lit, n] = g;
        if (key) out += `<span class="tk-key">${escapeHtml(key)}</span>${colon}`;
        else if (s) out += `<span class="tk-s">${escapeHtml(s)}</span>`;
        else if (lit) out += `<span class="tk-k">${lit}</span>`;
        else if (n) out += `<span class="tk-n">${n}</span>`;
      }
      return m;
    });
    return out + escapeHtml(line.slice(last));
  }

  function parseRanges(spec) {
    const set = new Set();
    (spec || "").split(",").filter(Boolean).forEach((part) => {
      const [a, b] = part.split("-").map(Number);
      for (let n = a; n <= (b || a); n++) set.add(n);
    });
    return set;
  }

  page.querySelectorAll(".ws-code").forEach((pre) => {
    const code = pre.querySelector("code");
    const hl = parseRanges(pre.dataset.hl);
    const lines = code.textContent.split("\n");
    code.innerHTML = lines.map((l, i) =>
      `<span class="ws-ln${hl.has(i + 1) ? " is-hl" : ""}" style="--i:${i}">${highlightLine(l, pre.dataset.lang) || " "}</span>`).join("");
  });

  /* ---------- Database walkthrough ---------- */
  const codes = Array.from(page.querySelectorAll(".ws-db-panel .ws-code"));
  const notes = [
    "Excerpt. Excel lock files (~$…) are skipped, and .xlsx is accepted only for LFA files.",
    "Excerpt. Missing batches are created the same way and marked “fill manually”.",
    "Illustrative record. The Raw/Processed lines are read-only; the importer ignores them.",
    "The same record after import. The round trip is covered by tests/test_lab_markdown_roundtrip.py.",
    "Excerpt. The map holds 20 header spellings; derived columns use the SPB helpers.",
    "Real record from a literature workbook of 31 GeSe-based samples.",
    "Real values from the same sample, rounded for display.",
  ];
  const steps = Array.from(page.querySelectorAll(".ws-db-step"));
  const tabBox = page.querySelector("[data-ws-tabs]");
  const note = page.querySelector("[data-ws-note]");
  let activeStep = -1;

  const tabs = codes.map((pre, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ws-code-tab";
    b.setAttribute("role", "tab");
    b.id = `ws-code-tab-${i}`;
    pre.setAttribute("role", "tabpanel");
    pre.setAttribute("aria-labelledby", b.id);
    pre.tabIndex = 0;
    const file = pre.dataset.file;
    b.innerHTML = `<span>${String(i + 1).padStart(2, "0")}</span>${file.split("/").pop()}`;
    b.title = file;
    b.addEventListener("click", () => setStep(i, { fromTab: true }));
    tabBox.appendChild(b);
    return b;
  });

  function setStep(i, opts = {}) {
    if (i === activeStep) return;
    activeStep = i;
    steps.forEach((s, n) => s.classList.toggle("is-active", n === i));
    tabs.forEach((t, n) => { t.classList.toggle("is-active", n === i); t.setAttribute("aria-selected", String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    codes.forEach((c, n) => { c.classList.toggle("is-active", n === i); c.hidden = n !== i; });
    note.innerHTML = `<code>${codes[i].dataset.file}</code> · ${escapeHtml(notes[i] || "")}`;
    if (opts.fromTab) tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    else tabs[i].parentElement.scrollTo({ left: tabs[i].offsetLeft - 24, behavior: reduceMotion ? "auto" : "smooth" });
  }
  steps.forEach((s, i) => s.addEventListener("click", () => setStep(i)));
  tabBox.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (activeStep + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setStep(n, { fromTab: true });
    tabs[n].focus();
  });
  setStep(0);

  // On wide screens the code panel is sticky and follows the step in the middle of the viewport.
  const wide = window.matchMedia("(min-width: 981px)");
  const stepObserver = new IntersectionObserver((entries) => {
    if (!wide.matches) return;
    entries.forEach((e) => { if (e.isIntersecting) setStep(steps.indexOf(e.target)); });
  }, { rootMargin: "-42% 0px -52% 0px" });
  steps.forEach((s) => stepObserver.observe(s));

  /* ---------- Showcase ---------- */
  const caseTabs = page.querySelector("[data-ws-case-tabs]");
  const casePanel = page.querySelector("[data-ws-case-panel]");
  let activeCase = -1;
  const caseBtns = CASES.map((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ws-case-tab";
    b.setAttribute("role", "tab");
    b.id = `ws-case-tab-${i}`;
    b.innerHTML = `<span class="ws-case-n">${c.n}</span><span class="ws-case-short">${escapeHtml(c.short)}</span><span class="ws-chip-dots" aria-hidden="true">${c.roles.map((r) => `<i data-role="${r}"></i>`).join("")}</span>`;
    b.addEventListener("click", () => setCase(i));
    caseTabs.appendChild(b);
    return b;
  });
  caseTabs.addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const n = (activeCase + step + CASES.length) % CASES.length;
    setCase(n);
    caseBtns[n].focus();
  });

  function setCase(i) {
    if (i === activeCase) return;
    activeCase = i;
    const c = CASES[i];
    caseBtns.forEach((b, n) => { b.classList.toggle("is-active", n === i); b.setAttribute("aria-selected", String(n === i)); b.tabIndex = n === i ? 0 : -1; });
    casePanel.setAttribute("aria-labelledby", caseBtns[i].id);
    const skills = c.roles.map((r) => `<span class="ws-case-skill" data-role="${r}">${ROLES[r].name}</span>`).join("");
    const metrics = c.metrics.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const figs = c.figs.map((f) =>
      `<figure class="ws-case-fig${f.wide ? " is-wide" : ""}"><div><img src="${FIG}${f.src}" alt="${escapeHtml(stripTags(f.title))}" loading="lazy" /></div><figcaption>${f.title}</figcaption></figure>`).join("");
    const cmds = c.cmds.map((cmd) => `<span class="ws-term-line"><span class="ws-ps" aria-hidden="true">$</span>${colorCommand(cmd)}</span>`).join("");
    casePanel.innerHTML = `
      <header class="ws-case-head">
        <p class="ws-case-cat">Case ${c.n} · ${c.cat}</p>
        <h4>${c.title}</h4>
        <p class="ws-case-sys">${c.system}</p>
        <div class="ws-case-skills">${skills}</div>
      </header>
      <blockquote class="ws-case-prompt"><span>Request</span>${escapeHtml(c.prompt)}</blockquote>
      <dl class="ws-case-metrics">${metrics}</dl>
      <div class="ws-case-figs${c.figs.filter((f) => !f.wide).length === 3 ? " cols-3" : ""}">${figs}</div>
      <p class="ws-case-note">${c.note}</p>
      <div class="ws-case-cmds" aria-label="Commands for this case">${cmds}</div>`;
    if (!reduceMotion) casePanel.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 280, easing: "ease-out" });
  }
  setCase(0);

  /* ---------- Gallery ---------- */
  const gallery = page.querySelector("[data-ws-gallery]");
  const galleryCards = [];
  demos.forEach((demo) => {
    [...demo.figs, ...(demo.more || [])].forEach((f) => {
      const card = document.createElement("figure");
      card.className = "ws-gcard";
      card.dataset.group = demo.group;
      card.innerHTML = `
        <div class="ws-gcard-img"><img src="${FIG}${f.src}" alt="${escapeHtml(f.alt)}" loading="lazy" /></div>
        <figcaption>
          <span class="ws-gcard-kicker">${f.kicker}</span>
          <h4>${f.title}</h4>
          <code class="ws-gcard-cmd">${colorCommand(demo.cmd)}</code>
          <button type="button" class="ws-gcard-run">Run in console <span aria-hidden="true">↑</span></button>
        </figcaption>`;
      card.querySelector(".ws-gcard-run").addEventListener("click", () => {
        setAutoplay(false);
        setMode("cli");
        consoleEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        const i = featured.indexOf(demo);
        if (i >= 0) run(i); else run(-1, demo);
      });
      gallery.appendChild(card);
      galleryCards.push(card);
    });
  });

  const filterBtns = Array.from(page.querySelectorAll("[data-ws-filter] button"));
  filterBtns.forEach((btn) => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });
    galleryCards.forEach((c) => { c.hidden = f !== "all" && c.dataset.group !== f; });
  }));

  /* ---------- Scroll reveals ---------- */
  const revealTargets = page.querySelectorAll(".ws-section-head, .ws-mode-card, .ws-skill, .ws-db-map, .ws-pipe-track, .ws-ag-rules li, .ws-ag-panel, .ws-case, .ws-eng-card, .ws-eng-figure, .ws-gcard");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => { el.classList.add("ws-reveal"); revealObserver.observe(el); });
  }
})();
