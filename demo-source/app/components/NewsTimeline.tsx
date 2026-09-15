import { news, newsYears, formatNewsDate } from "../data/news";
import { NewsThumbnail } from "./NewsThumbnail";
import "./news.css";

export function LatestNews() {
  return <div className="latest-news" id="news-list">
    <div className="latest-news-header"><h3>Latest news</h3><span>Newest first</span></div>
    <ol className="latest-news-list">{news.slice(0, 3).map(item => <li key={item.slug}>
      <div className="latest-news-meta"><time dateTime={item.publishedOn}>{formatNewsDate(item.publishedOn)}</time><span>{item.category}</span></div>
      <h4><a href={item.url} target="_blank" rel="noreferrer">{item.title} <span aria-hidden="true">↗</span></a></h4>
    </li>)}</ol>
    <a className="latest-news-more" href="/kanatzidis-demo/news#latest-news">Browse the news archive <span aria-hidden="true"> →</span></a>
  </div>;
}

export function NewsTimeline() {
  return <section className="news-archive" id="latest-news" aria-labelledby="news-archive-heading">
    <div className="news-archive-header"><div><h2 id="news-archive-heading">News through the years</h2><p>Newest first · Dates refer to the original announcements.</p></div>
      <nav className="news-year-links" aria-label="Jump to a news year">{newsYears.map(year => <a key={year} href={`#news-${year}`}>{year}</a>)}</nav>
    </div>
    {newsYears.map(year => <section className="news-year" key={year} id={`news-${year}`} aria-labelledby={`news-year-${year}`}>
      <h3 id={`news-year-${year}`}>{year}</h3><ol>{news.filter(item => item.publishedOn.startsWith(year)).map(item => <li key={item.slug}>
        <article className="news-timeline-item">
          <NewsThumbnail slug={item.slug} title={item.title} href={item.url}/>
          <div><div className="latest-news-meta"><time dateTime={item.publishedOn}>{formatNewsDate(item.publishedOn)}</time><span>{item.category}</span></div>
            <h4><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></h4><p>{item.summary}</p>
            <a className="news-read-link" href={item.url} target="_blank" rel="noreferrer">Read story <span aria-hidden="true"> ↗</span></a>
          </div>
        </article>
      </li>)}</ol>
    </section>)}
  </section>;
}
