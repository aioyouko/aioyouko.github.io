type ResearchArtwork = {
  file: string; source: string; alt: string; caption: string;
  width: number; height: number; citation: string; doi: string; figure: string;
  license?: { label: string; href: string };
};

export const researchImages: Record<string, ResearchArtwork> = {
  "exploratory-synthesis": {
    file: "exploratory-synthesis-paper.jpg", width: 967, height: 666,
    alt: "Crystal-structure progression across the ACu₂Q₂(MQ₂)n homologous semiconductor series",
    caption: "Systematic insertion of structural units connects parent compounds to a family of new chalcogenides.",
    citation: "Viti et al. · J. Am. Chem. Soc. 148, 705–713 (2026)",
    figure: "Graphical abstract · repository manuscript",
    doi: "10.1021/jacs.5c15180", source: "https://www.osti.gov/servlets/purl/3372186",
  },
  // The homepage uses the 2014 SnSe single-crystal study as its thermoelectric cover.
  "thermoelectrics-snse-2014": {
    file: "studies/snse-crystals-2014.jpg", width: 260, height: 312,
    alt: "SnSe single-crystal structure, bonding, crystal photograph and zT along the a, b and c axes, from Zhao et al., Nature (2014).",
    caption: "Layered SnSe single crystals connect crystal structure and bonding with direction-dependent thermoelectric performance.",
    citation: "Zhao et al. · Nature 508, 373–377 (2014)", figure: "Figure 1 · publisher preview",
    doi: "10.1038/nature13184", source: "https://www.nature.com/articles/nature13184/figures/1",
  },
  "thermoelectrics": {
    file: "thermoelectrics-paper.png", width: 685, height: 586,
    alt: "Van der Waals-like gaps in LiMnSbTe₃ and plots of thermal conductivity, carrier mobility, zT and single-leg device efficiency",
    caption: "Local gaps in LiMnSbTe₃ scatter heat-carrying phonons while supporting electrical transport.",
    citation: "Dong et al. · Nature Communications 16, 11501 (2025)", figure: "Figure 1",
    doi: "10.1038/s41467-025-66518-w", source: "https://www.nature.com/articles/s41467-025-66518-w",
    license: {label: "CC BY-NC-ND 4.0", href: "https://creativecommons.org/licenses/by-nc-nd/4.0/"},
  },
  "radiation-detection": {
    file: "radiation-detection-paper.png", width: 1185, height: 915,
    alt: "LiInP₂Se₆ layered crystal structure, vapor-grown crystals and Raman spectrum from a study of direct neutron detection",
    caption: "Layered LiInP₂Se₆: crystal structure, growth and characterization for direct neutron detection.",
    citation: "Chica et al. · Nature 577, 346–349 (2020)", figure: "Figure 1 · repository manuscript",
    doi: "10.1038/s41586-019-1886-8", source: "https://www.osti.gov/servlets/purl/1599041",
  },
  "perovskites": {
    file: "perovskites-paper.png", width: 1125, height: 690,
    alt: "Crystal phases, octahedral tilts and coherent phonon excitation in two-dimensional (BA)₂PbI₄ perovskites",
    caption: "Crystal structure and light-driven lattice dynamics connect two-dimensional perovskite chemistry with optical response.",
    citation: "Shukla et al. · Nature Materials 25, 405–411 (2026)", figure: "Figure 1 · repository proof",
    doi: "10.1038/s41563-025-02433-1", source: "https://www.osti.gov/servlets/purl/3372079",
  },
  "ion-exchange": {
    file: "ion-exchange-paper.jpg", width: 730, height: 415,
    alt: "KMS-1 layered sulfide exchanging potassium for rubidium and cesium, with the resulting interlayer spacings",
    caption: "KMS-1 accommodates exchanged ions by changing the spacing between its sulfide layers.",
    citation: "Manos & Kanatzidis · Chemical Science 7, 4804–4824 (2016)", figure: "Figure 3",
    doi: "10.1039/C6SC01039C", source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6016724/",
    license: {label: "CC BY 3.0", href: "https://creativecommons.org/licenses/by/3.0/"},
  },
  "nonlinear-optics": {
    file: "nonlinear-optics-paper.jpg", width: 1394, height: 987,
    alt: "Polarization-dependent second-harmonic response of γ-NaAsSe₂ and comparison of nonlinear susceptibility and bandgap",
    caption: "Second-harmonic generation measurements reveal the strong infrared nonlinear response of γ-NaAsSe₂.",
    citation: "He et al. · Advanced Optical Materials 10, 2101729 (2022)", figure: "Figure 3 · author preprint",
    doi: "10.1002/adom.202101729", source: "https://arxiv.org/abs/2111.13725",
    license: {label: "Preprint: CC0", href: "https://creativecommons.org/publicdomain/zero/1.0/"},
  },
};
