type HighlightArtwork = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  figure: string;
  source: string;
};

export const highlightImages: Record<string, HighlightArtwork> = {
  "10.1021/jacs.5c17198": {
    src: "/kanatzidis-demo/images/research/studies/agmn-sbpbte-2026.png",
    alt: "AgMnSbPbTe₄ strain maps and lattice thermal conductivity with an inset atomic structure",
    width: 1277, height: 687,
    credit: "Liu et al. · JACS (2026)",
    figure: "Graphical abstract",
    source: "https://www.osti.gov/servlets/purl/3364121",
  },
  "10.1002/adma.202518137": {
    src: "/kanatzidis-demo/images/research/studies/cspbbr3-grain-boundaries-2026.jpg",
    alt: "CsPbBr₃ ingot and wafers with different grain-boundary orientations, photoluminescence spectrum, and gamma-ray detector schematic",
    width: 1073, height: 978,
    credit: "Imam et al. · Advanced Materials (2026)",
    figure: "Figure 1 · Author manuscript",
    source: "https://www.repository.cam.ac.uk/bitstreams/c953e88b-6004-488e-b7bc-c6e43b95b26c/download",
  },
  "10.1038/s41563-025-02433-1": {
    src: "/kanatzidis-demo/images/research/perovskites-paper.png",
    alt: "Optical absorption, crystal phases and coherent lattice excitation of two-dimensional (BA)₂PbI₄ perovskites",
    width: 1125, height: 690,
    credit: "Shukla et al. · Nature Materials (2026)",
    figure: "Figure 1 · Repository proof",
    source: "https://www.osti.gov/servlets/purl/3372079",
  },
};
