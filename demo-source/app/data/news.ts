export type NewsItem = {
  slug: string;
  /** ISO publication/announcement date, not the award year. */
  publishedOn: string;
  category: string;
  title: string;
  summary: string;
  url: string;
  /** Optional editorial order in the awards carousel; smaller numbers go first. */
  featuredOrder?: number;
};

const entries: NewsItem[] = [
  {
    slug: "first-solid-state-perovskite", publishedOn: "2026-03-26", category: "Research perspective",
    title: "The origins of solid-state halide perovskite solar cells",
    summary: "An ACS Energy Letters viewpoint revisits the Northwestern discoveries behind solid-state halide perovskite photovoltaics.",
    url: "https://pubs.acs.org/doi/10.1021/acsenergylett.6c00236",
  },
  {
    slug: "einstein-award", publishedOn: "2025-07-16", category: "Award", featuredOrder: 2,
    title: "Albert Einstein World Award of Science",
    summary: "The World Cultural Council names Mercouri Kanatzidis the recipient of its 2025 Albert Einstein World Award of Science.",
    url: "https://chemistry.northwestern.edu/about/news/2025/kanatzidis-wcc-albert-einstein-award.html",
  },
  {
    slug: "national-academy", publishedOn: "2024-05-02", category: "Honor", featuredOrder: 3,
    title: "Election to the National Academy of Sciences",
    summary: "Mercouri Kanatzidis is elected to the National Academy of Sciences in recognition of distinguished achievements in original research.",
    url: "https://news.northwestern.edu/stories/2024/05/mercouri-kanatzidis-and-aaron-naber-elected-to-national-academy-of-sciences/",
  },
  {
    slug: "kanatzidisite", publishedOn: "2023-07-03", category: "Honor",
    title: "A mineral named Kanatzidisite",
    summary: "A new mineral discovered in Hungary is named in recognition of Kanatzidis’s contributions to chalcogenide chemistry.",
    url: "https://news.northwestern.edu/stories/2023/07/new-mineral-kanatzidisite-named-after-mercouri-kanatzidis",
  },
  {
    slug: "arts-and-sciences", publishedOn: "2023-04-21", category: "Honor",
    title: "American Academy of Arts and Sciences",
    summary: "Mercouri Kanatzidis is elected to the American Academy of Arts and Sciences.",
    url: "https://news.weinberg.northwestern.edu/2023/04/21/mercouri-kanatzidis-has-been-elected-member-of-the-american-academy-of-arts-and-sciences/",
  },
  {
    slug: "nichols-medal", publishedOn: "2025-10-01", category: "Award", featuredOrder: 1,
    title: "2026 William H. Nichols Medal",
    summary: "Mercouri Kanatzidis is named the 2026 Nichols Medalist for his pioneering work on halide perovskites for next-generation photovoltaics.",
    url: "https://www.anl.gov/article/argonnes-mercouri-kanatzidis-receives-william-h-nichols-medal",
  },
  {
    slug: "eth-doctorate", publishedOn: "2025-11-22", category: "Honor", featuredOrder: 4,
    title: "Honorary doctorate from ETH Zurich",
    summary: "ETH Zurich recognizes Mercouri Kanatzidis for pioneering advances in solid-state chemistry and innovative materials design.",
    url: "https://chemistry.northwestern.edu/about/news/2025/kanatzidis-ethzurich.html",
  },
];

// Every news list shares this ordering, independently of where an entry is added.
export const news = [...entries].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
export const featuredNews = news.filter(item => item.featuredOrder !== undefined)
  .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
export const newsYears = [...new Set(news.map(item => item.publishedOn.slice(0, 4)))];

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
