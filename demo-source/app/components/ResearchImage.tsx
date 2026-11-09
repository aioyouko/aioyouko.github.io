import { researchImages } from "../data/research-images";

export function ResearchImage({slug, eager = false}: {slug: string; eager?: boolean}) {
  const image = researchImages[slug];
  if (!image) return null;
  return <div className="research-cover"><img src={`/kanatzidis-demo/images/research/${image.file}`} alt={image.alt} width={image.width} height={image.height} loading={eager ? "eager" : "lazy"}/></div>;
}

export function ResearchFigure({slug, eager = false}: {slug: string; eager?: boolean}) {
  const image = researchImages[slug];
  if (!image) return null;
  return <figure className="research-figure">
    <ResearchImage slug={slug} eager={eager}/>
    <figcaption>
      <p className="research-figure-caption">{image.caption}</p>
      <p className="research-figure-citation">{image.citation}<br/>{image.figure}</p>
      <div className="research-figure-links">
        <a href={`/kanatzidis-demo/images/research/${image.file}`} target="_blank" rel="noreferrer">View full figure ↗</a>
        <a href={`https://doi.org/${image.doi}`} target="_blank" rel="noreferrer">Read paper ↗</a>
        <a href={image.source} target="_blank" rel="noreferrer">Figure source ↗</a>
        {image.license && <a href={image.license.href} target="_blank" rel="noreferrer">{image.license.label}</a>}
      </div>
    </figcaption>
  </figure>;
}
