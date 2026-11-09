import { notFound } from 'next/navigation';
import { Page, SourceLink } from '../../components/Content';
import { equipmentCategories, resourcePath } from '../../data/equipment';
import '../resources.css';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return equipmentCategories.map(category => ({ slug: category.slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = equipmentCategories.find(item => item.slug === slug);
  return { title: `${category?.title ?? 'Laboratory Resources'} | Kanatzidis Research Group`, description: category?.summary };
}

export default async function ResourceCategory({ params }: Props) {
  const { slug } = await params;
  const category = equipmentCategories.find(item => item.slug === slug);
  if (!category) notFound();

  return <Page active="resources" eyebrow="Laboratory resources" title={category.title} description={category.summary}>
    <section className="section resource-section"><div className="shell resource-detail">
      <a className="resource-back" href={resourcePath('/resources')}>← All laboratory resources</a>
      <section aria-labelledby="equipment-heading">
        <div className="resource-inventory-heading"><h2 id="equipment-heading">Equipment</h2><span>{category.items.length} entries</span></div>
        <dl className="resource-equipment-list">{category.items.map(item => <div className="resource-equipment-row" key={item.id} id={item.id}><dt>{item.name}</dt><dd>{item.description}</dd></div>)}</dl>
      </section>
      <p className="source-note">Equipment names and capabilities follow the published laboratory inventory. Please contact the group to confirm current availability and access. <SourceLink path="resources.html">Original equipment specifications</SourceLink></p>
      <div className="resource-detail-footer"><a href={resourcePath('/resources')}>← All laboratory resources</a><a href={resourcePath('/contact')}>Contact the laboratory →</a></div>
    </div></section>
  </Page>;
}
