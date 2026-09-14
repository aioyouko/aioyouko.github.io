"use client";
import { useState } from "react";
const photos = [
  {year:2026,source:"GroupPhoto_2026_labeled.png"},
  {year:2025,source:"GroupPhoto_2025_labeled.png"},
  {year:2024,source:"GroupPhoto_2024_Large.jpg"},
  {year:2023,source:"GroupPhoto_2023_Large.jpg"},
];
export function GroupGallery(){
  const [selected,setSelected]=useState(photos[1]);
  return <div className="group-gallery" id="group-photos">
    <div className="gallery-heading"><h3>Our group through the years</h3><span>2023–2026</span></div>
    <div className="gallery-years" role="group" aria-label="Choose group photo year">{photos.map(photo=><button type="button" key={photo.year} aria-pressed={selected.year===photo.year} onClick={()=>setSelected(photo)}>{photo.year}</button>)}</div>
    <figure>
      <a className="gallery-photo" href={`https://chemgroups.northwestern.edu/kanatzidis/resources/${selected.source}`} target="_blank" rel="noreferrer" aria-label={`Open original ${selected.year} group photo in a new tab`}><img src={`/kanatzidis-demo/images/group/${selected.year}.webp`} alt={`Kanatzidis Group photograph, ${selected.year}`} width="1800" height={selected.year===2026?1275:selected.year===2025?1029:selected.year===2024?1117:1350} loading="lazy"/></a>
      <figcaption><span aria-live="polite">Kanatzidis Group · {selected.year}</span><a href={`https://chemgroups.northwestern.edu/kanatzidis/resources/${selected.source}`} target="_blank" rel="noreferrer">View original ↗</a></figcaption>
    </figure>
  </div>;
}
