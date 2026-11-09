import { notFound } from "next/navigation";
import people from "../../data/people.json";
import backgroundData from "../../data/profile-backgrounds.json";
import { profileSummaries } from "../../data/content";
import { Page } from "../../components/Content";
import { MemberProfile, type ProfileBackground } from "../../components/MemberProfile";

type Props = { params: Promise<{ slug: string }> };
const backgrounds: Record<string, ProfileBackground> = backgroundData;
const roles: Record<string, string> = {
  "Undergraduate students": "Undergraduate student",
  "Graduate students": "Graduate student",
  "Visiting scholars": "Visiting scholar",
  "Postdoctoral researchers": "Postdoctoral researcher",
  "Other facilities": "Affiliated member",
};
const affiliations: Record<string, string> = {
  "duck-young-chung": "Argonne National Laboratory",
  "xiuquan-zhou": "Argonne National Laboratory",
  "christos-malliakas": "IMSERC, Northwestern University",
  "heyang-chen": "Northwestern University · Visiting from Nanyang Technological University",
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${people.find(person => person.slug === slug)?.name ?? "Member"} | Kanatzidis Research Group` };
}
export default async function Profile({ params }: Props) {
  const { slug } = await params;
  const person = people.find(member => member.slug === slug);
  if (!person) notFound();
  return <Page active="people" eyebrow="People" title={person.name} description={person.category}>
    <MemberProfile name={person.name} role={person.slug === "duck-young-chung" ? "Principal Materials Engineer" : roles[person.category] ?? person.category} affiliation={affiliations[person.slug] ?? "Northwestern University"}
      area={person.slug === "xiuquan-zhou" ? undefined : person.area} summary={profileSummaries[person.slug]} background={backgrounds[person.slug] ?? { education: [], experience: [], notes: [] }}
      email={person.email} office={person.office} source={person.source} note={person.note} profileAvailable={person.profileAvailable}/>
  </Page>;
}
export function generateStaticParams() { return people.map(person => ({ slug: person.slug })); }
