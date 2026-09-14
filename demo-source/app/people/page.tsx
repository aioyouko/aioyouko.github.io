import { Page, SourceLink } from "../components/Content";
import { PeopleDirectory } from "../components/PeopleDirectory";
import people from "../data/people.json";

export const metadata = { title: "People | Kanatzidis Research Group" };
export default function People() {
  return <Page active="people" eyebrow="People" title="Meet the group." description="Researchers in materials chemistry, energy conversion, optics and radiation detection.">
    <section className="section"><div className="shell">
      <section className="member-name-section directory-principal">
        <div className="member-name-heading"><h2>Principal investigator</h2></div>
        <ul className="member-name-list"><li><a href="/kanatzidis-demo/people/mercouri-kanatzidis">Mercouri G. Kanatzidis</a></li></ul>
      </section>
      <PeopleDirectory people={people.map(({name, slug, area, category}) => ({name, slug, area, category}))}/>
      <p className="source-note">Affiliations follow the original group directory. Individual profiles note conflicting or unavailable details. <SourceLink path="group.html">View source directory</SourceLink></p>
    </div></section>
  </Page>;
}
