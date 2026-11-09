import formattingData from "../data/publication-formatting.json";
export type TextRun = { text: string; script?: "sub" | "sup" };
type Formatting = { title: TextRun[]; citation: TextRun[]; searchText: string; source: string };
const formatting = formattingData as Record<string, Formatting>;
export function ScientificText({ runs }: { runs: TextRun[] }) {
  return <>{runs.map((run, index) => run.script === "sub" ? <sub key={index}>{run.text}</sub> : run.script === "sup" ? <sup key={index}>{run.text}</sup> : run.text)}</>;
}
export function PublicationTitle({ id, text }: { id: string; text: string }) {
  return <ScientificText runs={formatting[id]?.title ?? [{ text }]}/>;
}
export function PublicationCitation({ id, text }: { id?: string; text: string }) {
  const runs = (id && formatting[id]?.citation) || [{ text }];
  return <ScientificText runs={runs.map((run, index) => index === 0 ? { ...run, text: run.text.replace(/^\d+[).]\s*/, "") } : run)}/>;
}
export function normalizePublicationSearch(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(/[−–]/g, "-").replace(/\s+/g, "");
}
export function publicationMatches(id: string, citation: string, query: string) {
  const term = normalizePublicationSearch(query);
  return normalizePublicationSearch(citation).includes(term) || normalizePublicationSearch(formatting[id]?.searchText ?? "").includes(term);
}
