export const resourceBasePath = '/kanatzidis-demo';
export const resourcePath = (path: string) => `${resourceBasePath}${path}`;
export type Equipment = { id: string; name: string; description: string };
export type EquipmentCategory = { slug: string; title: string; summary: string; items: Equipment[] };

export const equipmentCategories: EquipmentCategory[] = [
  {
    slug: 'synthesis-crystal-growth', title: 'Synthesis & crystal growth',
    summary: 'Controlled atmospheres, high-temperature synthesis, crystal growth and sample preparation.',
    items: [
      { id: 'spark-plasma-sintering', name: 'Dr. Sinter-Lab SPS-515 S', description: 'Spark plasma sintering system with a hydraulic press for sample consolidation.' },
      { id: 'crystal-saw', name: 'Struers Accutom-50', description: 'Precision cutting saw for preparing crystal samples.' },
      { id: 'gloveboxes', name: 'Nitrogen-atmosphere gloveboxes', description: 'Air- and moisture-sensitive materials handling.' },
      { id: 'schlenk-lines', name: 'Schlenk and high-vacuum lines', description: 'Controlled-atmosphere handling and synthesis.' },
      { id: 'high-temperature-furnaces', name: 'Computer-controlled high-temperature furnaces', description: 'Programmable heating for solid-state synthesis.' },
      { id: 'bridgman-furnaces', name: 'Three-zone Bridgman furnaces', description: 'Vertical crystal growth with controlled temperature zones.' },
      { id: 'rocking-furnaces', name: 'Rocking furnaces', description: 'High-temperature processing with sample rocking.' },
      { id: 'induction-furnace', name: 'RF induction furnace', description: 'Radio-frequency heating for materials synthesis.' },
      { id: 'arc-welding', name: 'Arc-welding station', description: 'Arc-welding equipment for laboratory sample preparation.' },
      { id: 'melt-spinner', name: 'Glovebox melt-spinning apparatus', description: 'Lab-built rapid-quenching setup inside an argon glovebox.' },
    ],
  },
  {
    slug: 'structure-thermal-analysis', title: 'Structure & thermal analysis',
    summary: 'Diffraction, thermal analysis, surface area and porosity measurements.',
    items: [
      { id: 'powder-diffractometer', name: 'Rigaku MiniFlex600', description: 'Powder X-ray diffraction with Cu Kα radiation.' },
      { id: 'single-crystal-diffractometers', name: 'STOE IPDS 2 / 2T', description: 'Single-crystal X-ray diffraction with image-plate detectors and low-temperature capabilities.' },
      { id: 'gas-sorption', name: 'Micromeritics ASAP 2020', description: 'Gas-sorption analysis for surface area, porosity and adsorption isotherms.' },
      { id: 'thermal-analyzers', name: 'Shimadzu TGA-50, DSC-50 & DTA-50', description: 'Thermogravimetric analysis, differential scanning calorimetry and differential thermal analysis.' },
      { id: 'inel-detector', name: 'INEL position-sensitive X-ray detector', description: 'Computer-controlled X-ray detection using Cu Kα radiation.' },
    ],
  },
  {
    slug: 'electrical-thermal-transport', title: 'Electrical & thermal transport',
    summary: 'Seebeck coefficient, electrical resistivity, Hall effect and thermal diffusivity.',
    items: [
      { id: 'zem-3', name: 'ULVAC ZEM-3', description: 'Seebeck coefficient and electrical-resistance measurements.' },
      { id: 'laser-flash', name: 'NETZSCH LFA 457', description: 'Laser-flash analysis for thermal diffusivity measurements.' },
      { id: 'mmr-resistivity', name: 'MMR electrical-resistivity equipment', description: 'Electrical-resistivity measurements over a temperature range of 80–400 K.' },
      { id: 'hall-effect', name: 'Room-temperature Hall-effect system', description: 'Lab-built apparatus for Hall-effect measurements.' },
      { id: 'four-probe', name: 'High-temperature four-probe conductivity apparatus', description: 'Lab-built in-line four-probe system for conductivity measurements.' },
    ],
  },
  {
    slug: 'optical-characterization', title: 'Optical characterization',
    summary: 'Infrared and Raman spectroscopy, optical absorption and photoemission measurements.',
    items: [
      { id: 'nicolet-6700', name: 'Nicolet 6700 FT-IR spectrometer', description: 'Mid-infrared spectroscopy of materials.' },
      { id: 'photoemission-ac2', name: 'Riken Keiki AC-2', description: 'Photoemission yield spectroscopy in air for work-function and valence-band measurements.' },
      { id: 'ambient-photoemission', name: 'KP Technology APS', description: 'Ambient-pressure photoemission spectroscopy for work-function measurements.' },
      { id: 'nicolet-740', name: 'Nicolet 740 FT-IR spectrometer', description: 'Wide-range infrared spectroscopy with microscope-based sampling and reflectivity measurements.' },
      { id: 'uv-vis-nir', name: 'Shimadzu UV–visible–near-IR spectrophotometer', description: 'Optical spectroscopy of solids for band-gap measurements.' },
      { id: 'ft-raman', name: 'Bio-Rad / Digilab FT-Raman spectrometer', description: 'Fourier-transform Raman spectroscopy.' },
      { id: 'xenon-lamp', name: 'Hamamatsu 150 W xenon lamp', description: 'Xenon light source for photochemical experiments.' },
      { id: 'photochemical-setups', name: 'Photochemical reaction setups', description: 'Xenon-lamp systems with optical filters for photochemical studies.' },
    ],
  },
];
