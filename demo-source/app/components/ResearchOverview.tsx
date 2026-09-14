import { ResearchFigure } from "./ResearchImage";
import { SourceLink } from "./Content";

type ResearchOverviewProps = {
  research: { slug: string; summary: string; intro: string; topics: string[] };
  featured?: { href: string; label: string };
};

export function ResearchOverview({ research, featured }: ResearchOverviewProps) {
  return <section className="section" id="overview">
    <div className="shell detail-grid">
      <div>
        <p className="eyebrow dark">Research focus</p>
        <h2>{research.summary}</h2>
        <p className="body-copy">{research.intro}</p>
        <ul className="topic-list" id="materials">{research.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
        {featured && <a className="text-link dark-link research-feature-jump" href={featured.href}>{featured.label} ↓</a>}
        <SourceLink path="research.html">Read the original research description</SourceLink>
      </div>
      <ResearchFigure slug={research.slug} eager/>
    </div>
  </section>;
}
