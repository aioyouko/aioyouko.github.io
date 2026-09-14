# Homepage group-photo archive

The homepage hero keeps the 2026 group photo fixed. The historical carousel contains 28 photos from 2025 back to 1993, excluding 2026 from automatic playback.

## Sources and coverage

- Official archive: https://chemgroups.northwestern.edu/kanatzidis/alumni.html
- Exact original image URLs and intrinsic dimensions: `app/data/group-photos.json`.
- Available years: 1993, 1994, 1996, 1997, 2000–2004, 2006–2019 and 2021–2026. The official archive has no photos for 1995, 1998, 1999, 2005 or 2020.
- Twenty-five older photos were downloaded from the official archive and saved as WebP files with a maximum dimension of 1800 px, preserving their framing. The existing 2023–2026 assets remain unchanged. The 2021 image is the official archive's online group meeting photo.
- Only web image assets are included in the website. Every displayed photo links to its original source.

## Browsing and playback

The gallery provides a year selector, Older / Play-Pause / Newer controls, decade shortcuts and a playback progress line. It starts with 2025 and cycles through the historical archive every 6.5 seconds, using a 700 ms fade. A slide advances only after its image loads. Only the selected and preceding images are mounted, and complete photos fit inside a stable 4:3 frame.

Manual selection and keyboard focus on browsing controls pause autoplay. Hover, a hidden browser tab or less than 25% of the figure being visible suspends the timer. Reduced-motion settings disable automatic playback initially and remove animations. Timers and observers are cleaned up when the component unmounts.

## Validation

The production build and TypeScript checks pass. Isolated React component checks cover image-load gating, timed advance, hover/visibility/focus pause, playback controls, year and decade selection, archive wraparound, reduced motion and cleanup. The exported homepage contains the fixed 2026 hero, 28 historical year options, the selected 2025 image and the original source links. All 29 image files and dimensions were checked, and a contact sheet was inspected. Browser layout and animation timing were not visually verified because browser access was unavailable.
