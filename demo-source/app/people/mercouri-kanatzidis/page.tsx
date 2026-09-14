import { Page } from "../../components/Content";
import { MemberProfile } from "../../components/MemberProfile";
import backgrounds from "../../data/profile-backgrounds.json";

export const metadata = { title: "Mercouri G. Kanatzidis | Kanatzidis Research Group" };
export default function PI() {
  return <Page active="people" eyebrow="Principal investigator" title="Mercouri G. Kanatzidis" description="Charles E. and Emma H. Morrison Professor of Chemistry">
    <MemberProfile name="Mercouri G. Kanatzidis" role="Principal investigator" affiliation="Northwestern University · Argonne National Laboratory" area="Solid-state inorganic chemistry" overviewTitle="Biography"
      summary="Mercouri Kanatzidis earned his undergraduate chemistry degree at Aristotle University and his PhD at the University of Iowa in 1984. After postdoctoral research at the University of Michigan and Northwestern, he joined Michigan State University in 1987. He moved to Northwestern in 2006 and also holds an appointment at Argonne National Laboratory. His research spans chalcogenides, thermoelectrics, halide perovskites and radiation detectors."
      background={backgrounds["mercouri-kanatzidis"]} email="m-kanatzidis@northwestern.edu" office="Tech K258" phone={{ label: "+1 847 467 1541", href: "tel:+18474671541" }}
      source="https://chemgroups.northwestern.edu/kanatzidis/kanatzidis.html"
      portrait={{ src: "/kanatzidis-demo/images/mercouri-kanatzidis.jpg", alt: "Mercouri G. Kanatzidis in his laboratory at Northwestern University", width: 970, height: 650, credit: "Northwestern Now staff", source: "https://news.northwestern.edu/stories/2023/07/new-mineral-kanatzidisite-named-after-mercouri-kanatzidis" }}
      recognition={[{ year: "2025", title: "Albert Einstein World Award of Science" }, { year: "2024", title: "National Academy of Sciences" }, { year: "2023", title: "American Academy of Arts and Sciences" }]}
      extraLinks={[{ label: "Curriculum vitae (PDF)", href: "https://chemgroups.northwestern.edu/kanatzidis/CV_Kanatzidis.pdf" }, { label: "Publications", href: "/kanatzidis-demo/publications" }, { label: "Awards & news", href: "/kanatzidis-demo/news" }]}/>
  </Page>;
}
