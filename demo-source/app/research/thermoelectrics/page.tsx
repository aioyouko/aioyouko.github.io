import { ResearchOverview } from "../../components/ResearchOverview";
import { research } from "../../data/content";
import type { Metadata } from "next";
import { PaperList } from "../../components/PaperList";
import { Page } from "../../components/Content";

export const metadata: Metadata = {
  title: "Thermoelectric Materials | Kanatzidis Research Group",
  description:
    "Electronic transport and phonon engineering in SnSe, Bi₂Te₃, PbTe and diamond-like compounds, with exploration of new structures, transport mechanisms and high-entropy thermoelectrics.",
};

const strategies = [
  {
    number: "01",
    title: "Discover new crystal structures",
    description:
      "Use exploratory synthesis to discover new compounds and connect their bonding and local structure with electronic and thermal transport.",
    signal: "New materials",
  },
  {
    number: "02",
    title: "Uncover new transport mechanisms",
    description:
      "Connect electronic structure and lattice dynamics with charge and heat flow to identify new routes to high thermoelectric performance.",
    signal: "New mechanisms",
  },
  {
    number: "03",
    title: "Explore high-entropy design",
    description:
      "Investigate multicomponent compositions and chemical disorder as tools for controlling crystal structure and balancing electronic and phonon transport.",
    signal: "Compositional complexity",
  },
];

const milestones = [
  {
    year: "2011",
    value: "zT 1.8 · 800 K",
    material: "Na-doped PbTe–PbS",
    description:
      "Shape-controlled PbS nanostructures reduced lattice heat transport while electronic-structure changes improved the power factor.",
    journal: "J. Am. Chem. Soc.",
    href: "https://doi.org/10.1021/ja206380h",
  },
  {
    year: "2012",
    value: "zT ≈ 2.2 · 915 K",
    material: "PbTe–SrTe",
    description:
      "A hierarchical architecture scattered phonons from the atomic scale through the mesoscale while preserving useful charge transport.",
    journal: "Nature",
    href: "https://doi.org/10.1038/nature11439",
  },
  {
    year: "2014",
    value: "zT ≈ 2.6 · 923 K · b axis",
    material: "SnSe single crystals",
    description:
      "The layered crystal revealed exceptionally low thermal conductivity and a new route to high thermoelectric performance.",
    journal: "Nature",
    href: "https://doi.org/10.1038/nature13184",
  },
  {
    year: "2021",
    value: "zT ≈ 3.1 · 783 K",
    material: "Polycrystalline SnSe",
    description:
      "Purifying the starting material and removing surface oxides exposed the intrinsic performance of dense polycrystalline SnSe.",
    journal: "Nature Materials",
    href: "https://doi.org/10.1038/s41563-021-01064-6",
  },
];

const publications = [
  {
    year: "2011",
    theme: "Combining electronic and nanoscale design",
    journal: "Journal of the American Chemical Society",
    locator: "133(41), 16588–16597",
    title: <>High Performance Na-doped PbTe–PbS Thermoelectric Materials: Electronic Density of States Modification and Shape-Controlled Nanostructures</>,
    result: "zT 1.8 at 800 K",
    summary: "In PbTe containing 12% PbS and 2% Na doping, controlled PbS precipitates suppress lattice heat transport, while changes in the electronic density of states improve the power factor.",
    significance: "Shows how one chemical system can improve electrical transport and reduce heat conduction together.",
    doi: "10.1021/ja206380h",
    figure: {"file": "/kanatzidis-demo/images/research/studies/pbte-pbs-2011.png", "width": 750, "height": 522, "label": "Supporting Figure S6", "caption": "Carrier transport across Na-doped PbTe–PbS compositions.", "alt": "Hall coefficient versus temperature for PbTe and PbTe–PbS at different sodium doping levels.", "source": "https://acs.figshare.com/articles/journal_contribution/High_Performance_Na_doped_PbTe_PbS_Thermoelectric_Materials_Electronic_Density_of_States_Modification_and_Shape_Controlled_Nanostructures/2599465", "sourceLabel": "Girard et al. · ACS supporting information", "license": {"label": "CC BY-NC 4.0", "href": "https://creativecommons.org/licenses/by-nc/4.0/"}},
  },
  {
    year: "2012",
    theme: "Scattering phonons at every scale",
    journal: "Nature",
    locator: "489, 414–418",
    title: <>High-performance bulk thermoelectrics with all-scale hierarchical architectures</>,
    result: "zT ≈ 2.2 at 915 K",
    summary: "PbTe–SrTe combines atomic disorder, nanoscale precipitates, and mesoscale grain boundaries. These features scatter heat-carrying phonons over different length scales while retaining useful electrical transport.",
    significance: "Established a multiscale design strategy that connects chemistry, microstructure, and bulk thermoelectric performance.",
    doi: "10.1038/nature11439",
    figure: {"file": "/kanatzidis-demo/images/research/studies/hierarchical-pbte-2012.jpg", "width": 263, "height": 312, "label": "Figure 1", "caption": "Hierarchical structures scatter phonons at multiple scales.", "alt": "Atomic, nanoscale and mesoscale structures in PbTe–SrTe, with thermoelectric figure of merit versus temperature.", "source": "https://www.nature.com/articles/nature11439/figures/1", "sourceLabel": "Biswas et al. · Nature · publisher preview", "license": null},
  },
  {
    year: "2014",
    theme: "Letting the crystal itself block heat",
    journal: "Nature",
    locator: "508, 373–377",
    title: <>Ultralow thermal conductivity and high thermoelectric figure of merit in SnSe crystals</>,
    result: "zT 2.6 ± 0.3 at 923 K · b axis",
    summary: "SnSe single crystals exhibit strongly anharmonic, direction-dependent bonding and exceptionally weak lattice heat conduction. The reported performance along the b axis highlights the importance of crystallographic direction.",
    significance: "Opened a route to high performance through intrinsic bonding and crystal structure, expanding the search for lead- and tellurium-free materials.",
    doi: "10.1038/nature13184",
    figure: {"file": "/kanatzidis-demo/images/research/studies/snse-crystals-2014.jpg", "width": 260, "height": 312, "label": "Figure 1", "caption": "Layered SnSe structure and direction-dependent performance.", "alt": "SnSe crystal structure and bonding, crystal photograph, and zT along the a, b and c axes.", "source": "https://www.nature.com/articles/nature13184/figures/1", "sourceLabel": "Zhao et al. · Nature · publisher preview", "license": null},
  },
  {
    year: "2021",
    theme: "Unlocking polycrystalline SnSe",
    journal: "Nature Materials",
    locator: "20(10), 1378–1384",
    title: <>Polycrystalline SnSe with a thermoelectric figure of merit greater than the single crystal</>,
    result: "zT ≈ 3.1 at 783 K",
    summary: "Trace tin oxides on SnSe powders were identified as a major obstacle to performance. Purifying the reagents and removing these oxides allowed hole-doped polycrystalline samples to combine better electrical transport with very low lattice thermal conductivity.",
    significance: "Makes chemical purity and surface control central to developing high-performance polycrystalline SnSe.",
    doi: "10.1038/s41563-021-01064-6",
    figure: {"file": "/kanatzidis-demo/images/research/studies/polycrystalline-snse-2021.png", "width": 685, "height": 193, "label": "Figure 1", "caption": "Removing surface oxides unlocks polycrystalline SnSe.", "alt": "Tin purification, hydrogen reduction and spark plasma sintering, with thermal conductivity and zT comparisons before and after oxide removal.", "source": "https://www.nature.com/articles/s41563-021-01064-6/figures/1", "sourceLabel": "Zhou et al. · Nature Materials", "license": {"label": "CC BY 4.0", "href": "https://creativecommons.org/licenses/by/4.0/"}},
  },
  {
    year: "2025",
    theme: "Local gaps in a cubic semiconductor",
    journal: "Nature Communications",
    locator: "16, Article 11501",
    title: <>Stabilization of high-performance rock-salt LiMnSbTe<sub>3</sub> thermoelectrics with embedded van der Waals-like gaps</>,
    result: "zT 1.5 at 873 K · Mn-deficient composition",
    summary: "Combining MnTe and LiSbTe₂ produces a cubic semiconductor containing locally ordered, van der Waals-like gaps. These internal features scatter phonons while supporting carrier transport; adjusting the Mn content further improves performance.",
    significance: "Extends selective phonon scattering to a new compound by combining a high-symmetry host with distinctive local structure.",
    doi: "10.1038/s41467-025-66518-w",
    figure: {"file": "/kanatzidis-demo/images/research/thermoelectrics-paper.png", "width": 685, "height": 586, "label": "Figure 1", "caption": "Local gaps connect crystal design with thermoelectric performance.", "alt": "Van der Waals-like gaps in LiMnSbTe3 with thermal conductivity, carrier mobility, and thermoelectric performance comparisons.", "source": "https://www.nature.com/articles/s41467-025-66518-w/figures/1", "sourceLabel": "Dong et al. · Nature Communications", "license": {"label": "CC BY-NC-ND 4.0", "href": "https://creativecommons.org/licenses/by-nc-nd/4.0/"}},
  },
  {
    year: "2026",
    theme: "Structural complexity for glasslike heat transport",
    journal: "Journal of the American Chemical Society",
    locator: "148(2), 2456–2470",
    title: <>Structural Heterogeneity in Medium-Entropy AgMnSbPbTe<sub>4</sub> for Glassy Thermal Transport and High Thermoelectric Performance</>,
    result: "Peak zT 1.72 at 800 K",
    summary: "AgMnSbPbTe₄ contains nanoscale precipitates and local strain within a compositionally uniform bulk material. This structural complexity strongly limits lattice heat transport, while band convergence and preserved carrier mobility support electrical performance.",
    significance: "Connects medium-entropy chemistry with local structural control as a route to balancing electron and phonon transport.",
    doi: "10.1021/jacs.5c17198",
    figure: {"file": "/kanatzidis-demo/images/research/studies/agmn-sbpbte-2026.png", "width": 1277, "height": 687, "label": "Graphical abstract", "caption": "Local strain and glasslike lattice heat transport.", "alt": "Nanoscale structural and strain maps of AgMnSbPbTe4 alongside lattice thermal conductivity and a distorted-lattice schematic.", "source": "https://www.osti.gov/servlets/purl/3364121", "sourceLabel": "Liu et al. · Author manuscript · OSTI", "license": null},
  },
];

export default function ThermoelectricsPage() {
  const direction = research.find(item => item.slug === "thermoelectrics")!;
  return <Page active="research" eyebrow="Research" title={direction.title} description={direction.subtitle}>
    <ResearchOverview research={direction} featured={{href:"#publications-list",label:"Featured: Representative thermoelectric studies"}}/>

    <section className="section research-feature" id="strategy" aria-labelledby="thermo-feature-title">
      <div className="shell">
        <div className="research-feature-heading">
          <div>
            <p className="eyebrow dark">Materials design</p>
            <h2 id="thermo-feature-title">New structures and mechanisms for high-performance thermoelectrics.</h2>
            <p className="body-copy">Our search for high-performance thermoelectrics combines materials discovery with studies of electronic and phonon transport. We explore how new crystal structures, bonding environments and high-entropy compositions can balance a large Seebeck coefficient, strong electrical conductivity and low thermal conductivity.</p>
            <p className="research-formula">zT = S<sup>2</sup>σT / κ</p>
            <p className="feature-context">S is the Seebeck coefficient, σ the electrical conductivity, T the absolute temperature and κ the total thermal conductivity.</p>
          </div>
          <aside className="feature-timeline" id="milestones" aria-label="Selected thermoelectric milestones">
            <p className="eyebrow dark">Selected milestones</p>
            <ol>{milestones.map(milestone => <li key={milestone.year}>
              <span>{milestone.year} · {milestone.material}</span>
              <p>{milestone.value}<br/><a className="source-link" href={milestone.href} target="_blank" rel="noreferrer">{milestone.journal} <span aria-hidden="true">↗</span></a></p>
            </li>)}</ol>
          </aside>
        </div>
        <div className="feature-insights">{strategies.map(strategy => <article key={strategy.number}>
          <span>{strategy.number} / Design strategy</span><h3>{strategy.title}</h3><p>{strategy.description}</p>
        </article>)}</div>
      </div>
    </section>

    <section className="section paper-section thermo-reading-section" id="publications-list">
      <div className="shell">
        <p className="eyebrow dark">Selected publications · 2011–2026</p>
        <h2>Representative studies</h2>
        <p className="body-copy">Selected work from the group and its collaborators spans established PbTe and SnSe systems and emerging complex tellurides, highlighting crystal-structure discovery, local structural control and entropy-based design.</p>
        <div className="thermo-reading-grid">
          {publications.map(publication => <article className="thermo-reading-card" key={publication.doi}>
            <p className="thermo-reading-year">{publication.year} <span>Research highlight</span></p>
            <h3>{publication.theme}</h3>
            <figure className="thermo-study-figure">
              <a className="thermo-study-image" href={publication.figure.file} target="_blank" rel="noreferrer" aria-label={`View full figure: ${publication.theme}`}>
                <img src={publication.figure.file} alt={publication.figure.alt} width={publication.figure.width} height={publication.figure.height} loading="lazy" decoding="async" />
                <span className="thermo-study-expand" aria-hidden="true">View figure ↗</span>
              </a>
              <figcaption>
                <span><strong>{publication.figure.label}</strong> · {publication.figure.caption}</span>
                <a href={publication.figure.source} target="_blank" rel="noreferrer">{publication.figure.sourceLabel} <span aria-hidden="true">↗</span></a>
                {publication.figure.license && <a href={publication.figure.license.href} target="_blank" rel="noreferrer">{publication.figure.license.label}</a>}
              </figcaption>
            </figure>
            <p className="thermo-reading-title"><a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">{publication.title} <span aria-hidden="true">↗</span></a></p>
            <p className="thermo-reading-journal"><strong>{publication.journal}</strong> {publication.locator} ({publication.year})</p>
            <p className="thermo-reading-result"><span>Reported result</span><strong>{publication.result}</strong></p>
            <p className="thermo-reading-summary">{publication.summary}</p>
            <p className="thermo-reading-significance"><strong>Why it matters</strong> {publication.significance}</p>
            <a className="thermo-reading-link" href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer" aria-label={`Read paper: ${publication.theme}`}>Read paper <span aria-hidden="true">↗</span></a>
          </article>)}
        </div>
        <p className="thermo-reading-note">Values are reported for the compositions, temperatures, and crystal directions specified in each study; zT describes material performance rather than device conversion efficiency.</p>
        <div className="directory-section">
          <p className="eyebrow dark">Further reading · 2025–2026</p>
          <h2>More recent discoveries</h2>
          <PaperList dois={["10.1021/jacs.5c16757", "10.1038/s41467-025-60571-1"]}/>
        </div>
        <a className="text-link dark-link" href="/kanatzidis-demo/publications">Browse the publication archive →</a>
      </div>
    </section>

    <section className="section"><div className="shell"><a className="text-link dark-link" href="/kanatzidis-demo/research">← All research directions</a></div></section>
  </Page>;
}
