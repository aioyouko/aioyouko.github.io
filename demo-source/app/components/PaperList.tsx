import { PublicationJournal } from "./PublicationJournal";
import { PublicationTitle, PublicationCitation } from "./PublicationText";
import papers from "../data/publications.json";

export function Citation({ text, publicationId }: { text: string; publicationId?: string }) {
  return <details className="citation-details"><summary>Citation & authors</summary><p><PublicationCitation id={publicationId} text={text}/></p></details>;
}
export function PaperList({ dois }: { dois: string[] }) {
  const selected = dois.map(doi => papers.find(p => p.doi === doi)).filter(p => !!p);
  return <div className="paper-list">{selected.map(p =>
    <article className="paper-row" key={p.id}>
      <span className="paper-year">{p.year}</span>
      <div>
        <h3><a href={`https://doi.org/${p.doi}`}><PublicationTitle id={p.id} text={p.title}/> <span aria-hidden="true">↗</span></a></h3>
        <PublicationJournal id={p.id}/>
        <Citation text={p.citation} publicationId={p.id}/>
      </div>
    </article>
  )}</div>;
}
