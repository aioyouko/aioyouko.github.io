import { newsImages } from "../data/news-images";
import { ImageBlock } from "./Content";

export function NewsThumbnail({ slug, title, href }: { slug: string; title: string; href: string }) {
  const artwork = newsImages[slug];
  if (!artwork) return <ImageBlock label={title}/>;
  return <figure className="news-thumbnail">
    <a className={`news-thumbnail-link${slug === "first-solid-state-perovskite" ? " news-thumbnail-figure" : ""}`} href={href} target="_blank" rel="noreferrer" aria-label={`Read story: ${title}`} style={{ backgroundColor: artwork.background }}>
      <img src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} loading="lazy" decoding="async" style={{objectFit: artwork.fit ?? "cover", objectPosition: artwork.position ?? "center"}}/>
    </a>
    <figcaption><a href={artwork.source} target="_blank" rel="noreferrer">{artwork.credit} <span aria-hidden="true">↗</span></a></figcaption>
  </figure>;
}
