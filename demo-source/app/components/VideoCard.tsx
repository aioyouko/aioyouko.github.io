"use client";

import { useState } from "react";

export function VideoCard({ title, href }: { title: string; href: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const id = new URL(href).searchParams.get("v");
  const videoId = id && /^[\w-]{11}$/.test(id) ? id : null;

  return <article className="video-card lab-video-card">
    {videoId && <div className="video-preview">
      {playing ? <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={event => event.currentTarget.focus()}
      /> : <button type="button" className="video-preview-button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
        {!thumbnailFailed && <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          width="480" height="360" alt="" loading="lazy" decoding="async"
          onError={() => setThumbnailFailed(true)}
        />}
        <span className="video-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
        <span className="video-preview-label" aria-hidden="true">{thumbnailFailed ? "YouTube video · Play" : "Play video"}</span>
      </button>}
    </div>}
    <div className="video-card-copy">
      <h3>{title}</h3>
      <a className="video-youtube-link" href={href} target="_blank" rel="noreferrer" aria-label={`Watch on YouTube: ${title}`}>Watch on YouTube <span aria-hidden="true">↗</span></a>
    </div>
  </article>;
}
