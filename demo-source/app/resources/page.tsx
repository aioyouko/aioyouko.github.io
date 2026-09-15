import { VideoCard } from '../components/VideoCard';
import { Page, SourceLink } from '../components/Content';
import links from '../data/links.json';
import { equipmentCategories, resourcePath } from '../data/equipment';
import './resources.css';

export const metadata = { title: 'Laboratory Resources | Kanatzidis Research Group' };

export default function Resources() {
  return <Page active="resources" eyebrow="Laboratory resources" title="Tools for materials discovery." description="Synthesis, crystal growth, structural characterization and physical-property measurements.">
    <section className="section resource-section"><div className="shell">
      <div className="resource-categories">{equipmentCategories.map((category, index) => <article className="resource-category" key={category.slug}>
        <a href={resourcePath(`/resources/${category.slug}`)}>
          <span className="resource-category-number" aria-hidden="true">0{index + 1}</span>
          <div className="resource-category-copy"><h2>{category.title}</h2><p>{category.summary}</p><span className="resource-category-link">View equipment <span aria-hidden="true">→</span></span></div>
        </a>
      </article>)}</div>
      <p className="source-note">Equipment listings follow the original laboratory inventory. Contact the group about current availability and access. <SourceLink path="resources.html">Original equipment specifications</SourceLink></p>
      <section className="directory-section"><h2>Northwestern shared facilities</h2><div className="resource-link-grid">{links.facilities.map(link => <a key={link.href} href={link.href}>{link.text.replace('Northwesten', 'Northwestern')} ↗</a>)}</div></section>
      <section className="directory-section"><h2>Laboratory videos</h2><div className="video-grid">{links.videos.map(video => <VideoCard key={video.href} title={video.text} href={video.href}/>)}</div></section>
      <div className="profile-actions"><a className="text-link dark-link" href={resourcePath('/meetings')}>Group meetings →</a><a className="text-link dark-link" href={resourcePath('/contact')}>Contact the laboratory →</a></div>
    </div></section>
  </Page>;
}
