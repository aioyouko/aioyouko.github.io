import bibliography from "../data/publication-bibliography.json";

type BibliographicLine = {journal: string; details: string; kind?: string};
const records: Record<string, BibliographicLine> = bibliography;

export function publicationJournalSearchText(id: string) {
  const entry = records[id];
  return entry ? `${entry.journal} ${entry.details}` : "";
}

export function PublicationJournal({id}: {id: string}) {
  const entry = records[id];
  if (!entry) return null;
  return <p className="publication-journal">
    <strong>{entry.journal}</strong>
    {entry.details && <><span aria-hidden="true"> · </span><span>{entry.details}</span></>}
    {entry.kind && <small>{entry.kind}</small>}
  </p>;
}
