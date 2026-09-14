type NewsArtwork = {
  src: string; alt: string; width: number; height: number;
  credit: string; source: string;
  fit?: "contain" | "cover"; background?: string; position?: string;
};

export const newsImages: Record<string, NewsArtwork> = {
  "first-solid-state-perovskite": {
    src: "/kanatzidis-demo/images/research/perovskite-origins/energy-levels.png", width: 654, height: 516,
    alt: "Energy-level diagram from the 2012 solid-state solar-cell study discussed in the Viewpoint.",
    credit: "Chung et al. · Nature, 2012 · Fig. 2", source: "https://doi.org/10.1038/nature11067", fit: "contain", background: "#fff",
  },
  "einstein-award": {
    src: "/kanatzidis-demo/images/news/einstein-award.jpg", width: 566, height: 798,
    alt: "Mercouri Kanatzidis in the official 2025 Albert Einstein World Award of Science announcement.",
    credit: "World Cultural Council", source: "https://chemistry.northwestern.edu/about/news/2025/kanatzidis-wcc-albert-einstein-award.html", fit: "contain", background: "#676767",
  },
  "national-academy": {
    src: "/kanatzidis-demo/images/news/national-academy.jpg", width: 970, height: 650,
    alt: "Mercouri Kanatzidis, left, and Aaron Naber, right, pictured in Northwestern’s 2024 National Academy of Sciences announcement.",
    credit: "Northwestern Now", source: "https://news.northwestern.edu/stories/2024/05/mercouri-kanatzidis-and-aaron-naber-elected-to-national-academy-of-sciences/",
  },
  "kanatzidisite": {
    src: "/kanatzidis-demo/images/news/kanatzidisite.jpg", width: 970, height: 650,
    alt: "Mercouri Kanatzidis in the laboratory, from Northwestern’s report on the mineral named in his honor.",
    credit: "Northwestern Now", source: "https://news.northwestern.edu/stories/2023/07/new-mineral-kanatzidisite-named-after-mercouri-kanatzidis", position: "50% 35%",
  },
  "arts-and-sciences": {
    src: "/kanatzidis-demo/images/mercouri-kanatzidis-faculty.jpg", width: 326, height: 420,
    alt: "Faculty portrait of Mercouri Kanatzidis, elected to the American Academy of Arts and Sciences in 2023.",
    credit: "Faculty portrait · Northwestern Chemistry", source: "https://chemistry.northwestern.edu/people/faculty/profiles/mercouri-kanatzidis.html", fit: "contain", background: "#e5eeee",
  },
  "nichols-medal": {
    src: "/kanatzidis-demo/images/news/nichols-medal.png", width: 659, height: 731,
    alt: "Mercouri Kanatzidis with an inset of the William H. Nichols Medal, from the ACS 2026 award announcement.",
    credit: "ACS · The Indicator, January 2026", source: "https://www.njacs.org/theindicator/2026-01.pdf#page=13", fit: "contain", background: "#82776c",
  },
  "eth-doctorate": {
    src: "/kanatzidis-demo/images/news/eth-doctorate.png", width: 255, height: 185,
    alt: "Mercouri Kanatzidis receiving his honorary doctorate at ETH Zurich in 2025.",
    credit: "Northwestern Chemistry · ETH Zurich", source: "https://chemistry.northwestern.edu/about/news/2025/kanatzidis-ethzurich.html", position: "50% 40%",
  },
};
