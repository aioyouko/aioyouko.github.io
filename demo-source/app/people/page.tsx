import { Page, SourceLink } from "../components/Content";
import { PeopleDirectory } from "../components/PeopleDirectory";
import people from "../data/people.json";

export const metadata = { title: "People | Kanatzidis Research Group" };
export default function People() {
  return <Page active="people" eyebrow="People" title="Meet the group." description="Researchers in materials chemistry, energy conversion, optics and radiation detection.">
    <section className="section"><div className="shell">
      <div className="pi-feature">
        <figure className="directory-pi-portrait"><img src="/kanatzidis-demo/images/mercouri-kanatzidis-faculty.jpg" alt="Mercouri G. Kanatzidis" width={326} height={420}/><figcaption><a href="https://chemistry.northwestern.edu/people/faculty/profiles/mercouri-kanatzidis.html" target="_blank" rel="noreferrer">Photo: Northwestern Chemistry</a></figcaption></figure>
        <div><p className="eyebrow dark">Principal investigator</p><h2>Mercouri G. Kanatzidis</h2><p>Charles E. and Emma H. Morrison Professor of Chemistry</p><p>Northwestern University · Argonne National Laboratory</p><a className="text-link dark-link" href="/kanatzidis-demo/people/mercouri-kanatzidis">Biography & contact →</a></div>
      </div>
      <PeopleDirectory people={people.map(({name, slug, area, category}) => ({name, slug, area, category}))}/>
      <p className="source-note">Affiliations follow the original group directory. Individual profiles note conflicting or unavailable details. <SourceLink path="group.html">View source directory</SourceLink></p>
    </div></section>
  </Page>;
}
