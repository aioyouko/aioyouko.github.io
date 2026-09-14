import papers from "../data/publications.json";
import { ImageBlock } from "./Content";

const highlights = [
  { doi: "10.1021/jacs.5c17198", topic: "Thermoelectrics", journal: "JACS · 2026", title: "Disorder that changes heat transport", description: "Structural heterogeneity in medium-entropy AgMnSbPbTe₄ connects crystal chemistry with thermoelectric performance.", image: "AgMnSbPbTe₄ structure & thermal transport" },
  { doi: "10.1002/adma.202518137", topic: "Radiation detection", journal: "Advanced Materials · 2026", title: "Spectroscopy across grain boundaries", description: "Exploring how CsPbBr₃ perovskite detectors perform in the presence of grain boundaries.", image: "CsPbBr₃ detector & spectroscopy" },
  { doi: "10.1038/s41563-025-02433-1", topic: "Perovskites", journal: "Nature Materials · 2026", title: "Driving a new structural phase", description: "A coherent Higgs mode drives a metastable tetragonal phase in two-dimensional halide perovskites.", image: "Two-dimensional perovskite phase transition" },
];
export function ResearchHighlights() {
  return <div className="highlight-grid">{highlights.map(h => {
    const paper = papers.find(p => p.doi === h.doi);
    return <article className="highlight-card" key={h.doi}>
      <ImageBlock label={h.image}/>
      <div className="highlight-body">
        <p className="highlight-meta">{h.topic} <span>{h.journal}</span></p>
        <h3>{h.title}</h3><p>{h.description}</p>
        <a href={`https://doi.org/${h.doi}`} aria-label={`Read paper: ${paper?.title ?? h.title}`}>Read paper <span aria-hidden="true">↗</span></a>
      </div>
    </article>;
  })}</div>;
}
