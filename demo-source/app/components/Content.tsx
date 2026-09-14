import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export const originalSite = "https://chemgroups.northwestern.edu/kanatzidis/";
export function ImageBlock({ label, className = "" }: { label: string; className?: string }) {
  return <div className={`image-block ${className}`} role="img" aria-label={`${label} — image placeholder`}><span className="image-block-mark" aria-hidden="true">＋</span><span>{label}</span><small>Image placeholder</small></div>;
}
export function SourceLink({ path, children = "Original group website" }: { path: string; children?: ReactNode }) {
  return <a className="source-link" href={originalSite + path}>{children} <span aria-hidden="true">↗</span></a>;
}
export function Page({ title, eyebrow, description, active, children }: { title: string; eyebrow: string; description?: string; active?: "research" | "people" | "publications" | "news" | "resources"; children: ReactNode }) {
 return <><SiteHeader active={active}/><main id="main-content"><section className="page-intro"><div className="shell"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/kanatzidis-demo/">Home</a><span aria-hidden="true">/</span><span>{eyebrow}</span></nav><p className="eyebrow light"><span aria-hidden="true"/>{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div></section>{children}</main><SiteFooter/></>;
}
