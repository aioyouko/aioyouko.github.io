import papers from "../data/publications.json";
import { PublicationTitle } from "./PublicationText";
import { PublicationJournal } from "./PublicationJournal";
import { Citation } from "./PaperList";

const studies = [
  {
    id: "structure-insertion", doi: "10.1021/jacs.5c15180", number: "01", concept: "Structural expansion",
    heading: "Extend the building blocks",
    formula: <>ACu<sub>2</sub>Q<sub>2</sub>(MQ<sub>2</sub>)<sub><i>n</i></sub></>,
    description: <>Inserting MQ<sub>2</sub> units widens the connected octahedral motifs within a chalcogenide host. The parent structure determines whether this progression produces two-dimensional layers or a three-dimensional network.</>,
    significance: "Structural evolution becomes a guide to electronic design: intermediate compounds can have narrower band gaps than either parent.",
    reading: "Follow increasing n from left to right. The upper and lower panels trace the layered and three-dimensional branches of the family.",
    image: "insertion-structure.png", width: 1431, height: 1493, figure: "Figure 3 · Author manuscript",
    credit: "Viti et al.", source: "https://www.osti.gov/servlets/purl/3372186",
    alt: "Complete Figure 3: octahedral insertion across the ACu2Q2(MQ2)n series, showing layered and three-dimensional branches, n values, structural units and chemical compositions.",
  },
  {
    id: "structure-dimensions", doi: "10.1021/jacs.5c07366", number: "02", concept: "Dimensional reduction",
    heading: "Reduce the dimensionality",
    formula: <>A<sub><i>n</i></sub>Cu<sub>4−<i>n</i></sub>SnS<sub>4</sub></>,
    description: <>Replacing copper with alkali metals changes how the covalent framework connects. Composition and alkali-ion size provide two routes from three-dimensional networks to layers, chains and isolated units.</>,
    significance: "Lower covalent dimensionality is associated with a systematic widening of the band gap across this semiconductor family.",
    reading: "Read across for increasing alkali substitution and down for changing alkali-ion size. Green entries identify compounds newly reported in this study.",
    image: "dimensional-structure.png", width: 1500, height: 861, figure: "Figure 2 · Repository proof",
    credit: "Viti et al.", source: "https://www.osti.gov/servlets/purl/3364207",
    alt: "Complete Figure 2: AnCu4−nSnS4 crystal structures arranged by alkali substitution and ion size, with 3D, 2D, 1D and 0D motifs, atom-color legend and space-group table.",
  },
  {
    id: "structure-assembly", doi: "10.1126/science.aea8088", number: "03", concept: "Homologous assembly",
    heading: "A shared formula. An expanding family.",
    formula: <>BaSbQ<sub>3</sub> <span>Q = Te<sub>1−<i>x</i></sub>S<sub><i>x</i></sub></span></>,
    description: <>Changing the sulfur-to-tellurium ratio alters the size and assembly of modular building blocks while preserving the Ba:Sb:Q ratio. Rocksalt-like slabs and polytelluride fragments connect into a family of distinct structures.</>,
    significance: "Differences between the two anions provide a route to structural diversity within a conserved overall stoichiometry.",
    reading: "The central column tracks the growing building block. Faded structures inside dashed boxes are hypothetical members; the figure distinguishes them from known phases.",
    image: "homologous-structure.png", width: 720, height: 1280, figure: "Figure 1 · Accepted manuscript",
    credit: "Zhao et al.", source: "https://www.osti.gov/servlets/purl/3372204",
    alt: "Complete Figure 1: BaSbQ3 homologous structures, modular building blocks and atom-color legend; hypothetical phases are faded and enclosed by dashed boxes.",
  },
];

export function SynthesisStudies() {
  return <section className="section synthesis-studies" id="selected-structures" aria-labelledby="synthesis-studies-title">
    <div className="shell">
      <div className="synthesis-section-intro">
        <p className="eyebrow dark">Selected studies · Crystal chemistry</p>
        <h2 id="synthesis-studies-title">Crystal structure by design</h2>
        <p className="body-copy">Explore how insertion, substitution and assembly create new chalcogenides—and connect their structures to electronic behavior.</p>
      </div>
      <nav className="synthesis-study-nav" aria-label="Explore structural design approaches">{studies.map(study =>
        <a key={study.id} href={`#${study.id}`}><span>{study.number}</span>{study.concept}<span aria-hidden="true">↓</span></a>
      )}</nav>
      <div className="synthesis-study-list">{studies.map(study => {
        const paper = papers.find(p => p.doi === study.doi)!;
        const image = `/kanatzidis-demo/images/research/synthesis-studies/${study.image}`;
        return <article className={`synthesis-study${study.number === "03" ? " synthesis-study-tall" : ""}`} id={study.id} key={study.id} aria-labelledby={`${study.id}-title`}>
          <div className="synthesis-study-copy">
            <p className="synthesis-study-kicker"><span>{study.number}</span>{study.concept} · {paper.year}</p>
            <h3 id={`${study.id}-title`}>{study.heading}</h3>
            <p className="synthesis-study-formula">{study.formula}</p>
            <p className="synthesis-study-description">{study.description}</p>
            <p className="synthesis-study-significance">{study.significance}</p>
            <div className="synthesis-study-guide"><span>Reading the structure</span><p>{study.reading}</p></div>
            <div className="synthesis-study-paper">
              <h4><a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer"><PublicationTitle id={paper.id} text={paper.title}/></a></h4>
              <PublicationJournal id={paper.id}/>
              <Citation text={paper.citation} publicationId={paper.id}/>
              <a className="synthesis-paper-link" href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer">Read the paper <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <figure className="synthesis-study-figure">
            <a className="synthesis-study-image" href={image} target="_blank" rel="noreferrer" aria-label={`View full structure figure: ${study.heading}`}>
              <img src={image} alt={study.alt} width={study.width} height={study.height} loading="lazy" decoding="async"/>
            </a>
            <figcaption><span><strong>{study.figure}</strong><br/>{study.credit} · <a href={study.source} target="_blank" rel="noreferrer">Source via DOE OSTI ↗</a></span><a href={image} target="_blank" rel="noreferrer">View full figure ↗</a></figcaption>
          </figure>
        </article>;
      })}</div>
      <a className="text-link dark-link" href="/kanatzidis-demo/publications">Browse the publication archive →</a>
    </div>
  </section>;
}
