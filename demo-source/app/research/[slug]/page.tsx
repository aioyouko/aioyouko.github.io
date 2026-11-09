import { SynthesisStudies } from "../../components/SynthesisStudies";
import { ResearchOverview } from "../../components/ResearchOverview";
import { PerovskiteFeature } from "../../components/PerovskiteFeature";
import { notFound } from "next/navigation";
import { Page } from "../../components/Content";
import { PaperList } from "../../components/PaperList";
import { research } from "../../data/content";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params; const r=research.find(r=>r.slug===slug);return {title:`${r?.title??"Research"} | Kanatzidis Research Group`,description:r?.summary};}
export default async function ResearchPage({params}:Props){const {slug}=await params;const r=research.find(r=>r.slug===slug);if(!r)notFound();return <Page active="research" eyebrow="Research" title={r.title} description={r.subtitle}><ResearchOverview research={r} featured={r.slug === "perovskites" ? {href:"#solid-state-origins",label:"Featured: The first solid-state perovskite solar cell"} : r.slug === "exploratory-synthesis" ? {href:"#selected-structures",label:"Explore the structures behind the studies"} : undefined}/>{r.slug === "perovskites" && <PerovskiteFeature/>}{r.slug === "exploratory-synthesis" ? <SynthesisStudies/> : <section className="section paper-section"><div className="shell"><p className="eyebrow dark">Selected publications</p><h2>Explore the research</h2><PaperList dois={r.dois}/><a className="text-link dark-link" href="/kanatzidis-demo/publications">Browse the publication archive →</a></div></section>}<section className="section"><div className="shell"><a className="text-link dark-link" href="/kanatzidis-demo/research">← All research directions</a></div></section></Page>}

export function generateStaticParams(){return research.filter(r=>r.slug!=="thermoelectrics").map(r=>({slug:r.slug}));}
