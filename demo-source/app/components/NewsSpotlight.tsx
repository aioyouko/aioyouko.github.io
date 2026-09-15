"use client";

import { useEffect, useId, useRef, useState } from "react";
import { featuredNews, formatNewsDate } from "../data/news";
import { newsImages } from "../data/news-images";
import "./news.css";

const SLIDE_DURATION = 7000;

export function NewsSpotlight() {
  const id = useId();
  const region = useRef<HTMLElement>(null);
  const activeImage = useRef<HTMLImageElement>(null);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [readySlug, setReadySlug] = useState<string | null>(null);
  const current = featuredNews[selected];
  const running = playing && !hovered && inView && visible && readySlug === current?.slug;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!preference.matches);
    const updateMotion = () => { if (preference.matches) setPlaying(false); };
    const updateVisibility = () => setVisible(!document.hidden);
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25);
    }, { threshold: 0.25 });
    if (region.current) observer.observe(region.current);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeImage.current?.complete && activeImage.current.naturalWidth > 0) setReadySlug(current.slug);
  }, [current?.slug]);

  useEffect(() => {
    if (!running || featuredNews.length < 2) return;
    const timer = window.setTimeout(() => setSelected(index => (index + 1) % featuredNews.length), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [running, selected]);

  function select(index: number) {
    setPlaying(false);
    setSelected((index + featuredNews.length) % featuredNews.length);
  }

  if (!current) return null;

  return <section ref={region} className="news-spotlight" role="region" aria-roledescription="carousel" aria-label="Awards and honors"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={event => { if (!(event.target as HTMLElement).closest("[data-news-playback]")) setPlaying(false); }}
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        select(selected + (event.key === "ArrowLeft" ? -1 : 1));
      }
    }}>
    <div className="spotlight-header"><h2>Awards & honors</h2><span>In the spotlight</span></div>
    <div className="spotlight-slides" id={`${id}-slides`} aria-live={playing ? "off" : "polite"} aria-atomic="true">
      {featuredNews.map((item, index) => {
        const artwork = newsImages[item.slug];
        const active = index === selected;
        return <article key={item.slug} className={`spotlight-slide${active ? " is-active" : ""}`} inert={!active} aria-hidden={!active}
          role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${featuredNews.length}: ${item.title}`}>
          <div className="spotlight-copy">
            <p className="spotlight-meta">{item.category}<span aria-hidden="true"> · </span><time dateTime={item.publishedOn}>{formatNewsDate(item.publishedOn)}</time></p>
            <h3>{item.title}</h3><p className="spotlight-summary">{item.summary}</p>
            <a className="spotlight-story" href={item.url} target="_blank" rel="noreferrer">Read the announcement <span aria-hidden="true">↗</span></a>
          </div>
          <figure className={`spotlight-figure spotlight-figure-${item.slug}`}>
            <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Read story: ${item.title}`} style={{ backgroundColor: artwork.background }}>
              <img ref={active ? activeImage : undefined} src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height}
                loading="lazy" decoding="async" onLoad={() => { if (active) setReadySlug(item.slug); }}
                style={{ objectFit: artwork.fit ?? "cover", objectPosition: artwork.position ?? "center" }}/>
            </a>
            <figcaption><a href={artwork.source} target="_blank" rel="noreferrer">{artwork.credit} <span aria-hidden="true">↗</span></a></figcaption>
          </figure>
        </article>;
      })}
    </div>
    {featuredNews.length > 1 && <div className="spotlight-controls" role="group" aria-label="Featured news controls">
      <div className="spotlight-dots">{featuredNews.map((item, index) => <button key={item.slug} type="button" onClick={() => select(index)} aria-label={`Show ${item.title}`} aria-current={index === selected ? "true" : undefined} aria-controls={`${id}-slides`}><span/></button>)}</div>
      <span className="spotlight-count" aria-hidden="true">{String(selected + 1).padStart(2, "0")} / {String(featuredNews.length).padStart(2, "0")}</span>
      <button type="button" className="spotlight-play" data-news-playback="true" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause featured news" : "Play featured news"} aria-controls={`${id}-slides`}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">{playing ? <><path d="M4 3h3v10H4zM9 3h3v10H9z"/></> : <path d="m4 2 10 6-10 6z"/>}</svg><span>{playing ? "Pause" : "Play"}</span>
      </button>
      <button type="button" className="spotlight-arrow" onClick={() => select(selected - 1)} aria-label="Previous featured news" aria-controls={`${id}-slides`}>←</button>
      <button type="button" className="spotlight-arrow" onClick={() => select(selected + 1)} aria-label="Next featured news" aria-controls={`${id}-slides`}>→</button>
    </div>}
  </section>;
}
