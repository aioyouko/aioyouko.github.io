const article = "https://doi.org/10.1021/acsenergylett.6c00236";
const pdf = "https://pubs.acs.org/aelccp/article-pdf/11/4/3006/64809247/nz6c00236.pdf";
const original = "https://doi.org/10.1038/nature11067";

function OriginsFigure({ file, number, width, height, alt, caption }: {
  file: string; number: number; width: number; height: number; alt: string; caption: string;
}) {
  const image = `/kanatzidis-demo/images/research/perovskite-origins/${file}.png`;
  return <figure className="origins-figure">
    <a className="origins-image" href={image} target="_blank" rel="noreferrer" aria-label={`View complete Figure ${number}: ${caption}`}>
      <img src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <span aria-hidden="true">View figure ↗</span>
    </a>
    <figcaption><strong>Figure {number}</strong> · {caption}<br/>
      <a href={`https://www.nature.com/articles/nature11067/figures/${number}`} target="_blank" rel="noreferrer">Chung et al., Nature (2012) ↗</a>
    </figcaption>
  </figure>;
}

export function PerovskiteFeature() {
  return <section className="section research-feature perovskite-origins" id="solid-state-origins" aria-labelledby="perovskite-feature-title">
    <div className="shell">
      <div className="research-feature-heading">
        <div>
          <p className="eyebrow dark">Featured viewpoint · March 2026</p>
          <h2 id="perovskite-feature-title">The First Solid-State Halide Perovskite Solar Cell</h2>
          <p className="feature-byline">Mercouri G. Kanatzidis · <i>ACS Energy Letters</i> 11 (4), 3006–3013</p>
          <p className="body-copy">In this Viewpoint, Kanatzidis revisits the chemistry behind the group’s 2012 solar cell: solution-processed CsSnI<sub>3</sub> carried holes and contributed to light harvesting in a device without a liquid electrolyte.</p>
          <p className="origins-intro">The original energy-level diagram brings that device concept into focus: TiO<sub>2</sub>, N719 dye and CsSnI<sub>3</sub> form the interfaces for electron and hole transfer.</p>
          <div className="feature-actions"><a className="button button-primary" href={article}>Read the Viewpoint ↗</a><a className="text-link dark-link" href={pdf}>Open PDF ↗</a></div>
        </div>
        <OriginsFigure file="energy-levels" number={2} width={654} height={516}
          alt="Energy levels of TiO2, N719 dye and CsSnI3 relative to vacuum, with electron and hole transfer arrows and band gaps."
          caption="Energy alignment in the solid-state cell." />
      </div>

      <div className="origins-evidence">
        <article>
          <p className="eyebrow dark">Inside the device</p>
          <h3>A semiconductor within the scaffold</h3>
          <OriginsFigure file="device-cross-section" number={3} width={771} height={667}
            alt="Five microscopy panels showing the CsSnI3 and TiO2 cross section, elemental maps, lattice fringes and electron diffraction, with original scale bars."
            caption="Microscopy and elemental maps of the CsSnI₃/TiO₂ structure." />
          <p>Solution processing brings CsSnI<sub>3</sub> into the porous TiO<sub>2</sub> framework. The cross section and elemental maps show its distribution through the scaffold, creating close contact for charge collection.</p>
        </article>
        <article>
          <p className="eyebrow dark">From light to current</p>
          <h3>More than a hole transporter</h3>
          <OriginsFigure file="optical-response" number={4} width={785} height={489}
            alt="Absorbance and incident photon-to-current efficiency versus wavelength, comparing a CsSnI2.95F0.05-containing cell with the conventional dye-based cell."
            caption="Absorption and wavelength-dependent photocurrent response." />
          <p>The perovskite-containing device extends absorption toward longer wavelengths. Its photocurrent spectrum complements this optical evidence, connecting semiconductor chemistry with device response.</p>
          <p className="origins-caveat">These comparison devices retained N719 dye. The Viewpoint separately discusses dye-free controls that also generated photocurrent.</p>
        </article>
      </div>

      <p className="origins-source">Figures 2–4 are from the original research discussed in the Viewpoint: Chung et al., <a href={original}>All-solid-state dye-sensitized solar cells with high efficiency</a>, <i>Nature</i> 485, 486–489 (2012). © 2012 Macmillan Publishers Limited. <a href="https://www.torontomu.ca/content/dam/solar/Papers/AllSolidStateDSSCs.pdf" target="_blank" rel="noreferrer">Public university copy ↗</a></p>

      <aside className="feature-timeline origins-timeline" aria-label="Milestones discussed in the Viewpoint">
        <p className="eyebrow dark">From chemistry to photovoltaics</p>
        <ol>
          <li><span>2008–2011</span><p>Phase control, near-infrared emission and defect-driven self-doping clarify tin-perovskite semiconductivity.</p></li>
          <li><span>2012</span><p>CsSnI<sub>3</sub> enables a fully solid-state mesoscopic solar cell.</p></li>
          <li><span>2013–2014</span><p>FAPbI<sub>3</sub> and mixed Sn–Pb compositions expand the absorber chemistry, with band gap bowing opening further possibilities.</p></li>
        </ol>
      </aside>
      <p className="feature-context">The author’s historical account also acknowledges Grätzel’s architectural foundations and parallel advances by Miyasaka, Park, Snaith and others.</p>
      <div className="feature-references"><span>Original research</span><a href={original}>2012 · Solid-state devices ↗</a><a href="https://doi.org/10.1021/ic401215x">2013 · Sn and Pb iodide chemistry ↗</a><a href="https://doi.org/10.1021/ja5033259">2014 · Sn–Pb band gap bowing ↗</a></div>
    </div>
  </section>;
}
