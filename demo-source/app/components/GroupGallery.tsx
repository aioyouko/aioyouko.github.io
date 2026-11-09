"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import photos from "../data/group-photos.json";

// The current group stays fixed in the homepage hero; only past years rotate here.
const archive = photos.filter(photo => photo.year < 2026);
const decades = [...new Set(archive.map(photo => Math.floor(photo.year / 10) * 10))];
const SLIDE_DURATION = 6500;

function PlaybackIcon({ playing }: { playing: boolean }) {
  return <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="currentColor">
    {playing ? <><rect x="5" y="4" width="3" height="12" rx="1"/><rect x="12" y="4" width="3" height="12" rx="1"/></> : <path d="M6 3.5v13L16 10z"/>}
  </svg>;
}

export function GroupGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [readyYear, setReadyYear] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const selected = archive[selectedIndex];
  const previous = archive[previousIndex];
  const ready = readyYear === selected.year;
  const running = isPlaying && inView && pageVisible && !hovered && ready;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(preference.matches);
    setIsPlaying(!preference.matches);
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setIsPlaying(false);
    };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25), { threshold: 0.25 });
    if (frameRef.current) observer.observe(frameRef.current);
    return () => {
      document.removeEventListener("visibilitychange", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Also handles an image that finished loading before React hydrated the page.
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) setReadyYear(selected.year);
  }, [selected.year]);

  const showPhoto = useCallback((index: number) => {
    if (index === selectedIndex) return;
    setPreviousIndex(selectedIndex);
    setReadyYear(null);
    setSelectedIndex(index);
  }, [selectedIndex]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => showPhoto((selectedIndex + 1) % archive.length), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [running, selectedIndex, showPhoto]);

  function selectPhoto(index: number) {
    setIsPlaying(false);
    showPhoto(index);
  }

  return <div className="group-gallery" id="group-photos" role="region" aria-roledescription="carousel" aria-label="Group photos through the years" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div className="gallery-heading"><h3>Our group through the years</h3><a className="gallery-current-link" href="#top">2026 · Current group <span aria-hidden="true">↗</span></a></div>
    <div className="gallery-navigation">
      <div className="gallery-toolbar" role="group" aria-label="Slideshow controls">
        <div className="gallery-year-picker">
          <label htmlFor="gallery-year">Archive year</label>
          <div className="gallery-select-wrap"><select id="gallery-year" value={selected.year} aria-controls="gallery-current-photo" onFocus={() => setIsPlaying(false)} onChange={event => selectPhoto(archive.findIndex(photo => photo.year === Number(event.target.value)))}>
            {archive.map(photo => <option value={photo.year} key={photo.year}>{photo.year}</option>)}
          </select><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></div>
        </div>
        <div className="gallery-playback">
          <button className="gallery-step" type="button" onFocus={() => setIsPlaying(false)} onClick={() => selectPhoto((selectedIndex + 1) % archive.length)} aria-label="View older group photo" aria-controls="gallery-current-photo" title="Older photo">←</button>
          <button className="gallery-play-toggle" type="button" onClick={() => setIsPlaying(playing => !playing)} aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"} aria-controls="gallery-current-photo"><PlaybackIcon playing={isPlaying}/><span>{isPlaying ? "Pause" : "Play"}</span></button>
          <button className="gallery-step" type="button" onFocus={() => setIsPlaying(false)} onClick={() => selectPhoto((selectedIndex - 1 + archive.length) % archive.length)} aria-label="View newer group photo" aria-controls="gallery-current-photo" title="Newer photo">→</button>
        </div>
      </div>
      <div className="gallery-decades" role="group" aria-label="Jump to a decade">{decades.map(decade => <button type="button" key={decade} aria-pressed={Math.floor(selected.year / 10) * 10 === decade} aria-controls="gallery-current-photo" onFocus={() => setIsPlaying(false)} onClick={() => selectPhoto(archive.findIndex(photo => Math.floor(photo.year / 10) * 10 === decade))}>{decade}s</button>)}</div>
      <div className="gallery-progress" aria-hidden="true"><span key={`${selected.year}-${running}`} className={running && !reducedMotion ? "is-running" : ""} style={{ animationDuration: `${SLIDE_DURATION}ms` }}/></div>
    </div>
    <figure ref={frameRef} id="gallery-current-photo" className="gallery-slide" aria-roledescription="slide" aria-label={`${selected.year}, ${selectedIndex + 1} of ${archive.length}`}>
      <a className="gallery-photo" href={selected.source} target="_blank" rel="noreferrer" onFocus={() => setIsPlaying(false)} aria-label={`Open original ${selected.year} group photo in a new tab`}>
        {previousIndex !== selectedIndex && <img className="gallery-image-previous" src={`/kanatzidis-demo/images/group/${previous.year}.webp`} alt="" aria-hidden="true" width={previous.width} height={previous.height}/>}
        <img ref={imageRef} key={selected.year} className={`gallery-image-current${ready || selectedIndex === previousIndex ? " is-ready" : ""}`} src={`/kanatzidis-demo/images/group/${selected.year}.webp`} alt={`Kanatzidis Group photograph, ${selected.year}`} width={selected.width} height={selected.height} loading="lazy" decoding="async" onLoad={() => setReadyYear(selected.year)}/>
      </a>
      <figcaption><span aria-live={isPlaying ? "off" : "polite"} aria-atomic="true"><strong>Kanatzidis Group · {selected.year}</strong><span className="gallery-position">{String(selectedIndex + 1).padStart(2, "0")} / {archive.length} · {archive[archive.length - 1].year}–{archive[0].year}</span></span><a href={selected.source} target="_blank" rel="noreferrer" onFocus={() => setIsPlaying(false)}>View original ↗</a></figcaption>
    </figure>
  </div>;
}
