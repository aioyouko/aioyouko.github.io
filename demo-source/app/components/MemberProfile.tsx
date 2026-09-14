export type BackgroundEntry = {
  title: string;
  organization: string;
  period?: string;
  location?: string;
  description?: string;
};
export type ProfileBackground = {
  education: BackgroundEntry[];
  experience: BackgroundEntry[];
  notes: string[];
};
type ProfileProps = {
  name: string;
  role: string;
  affiliation?: string;
  area?: string;
  summary?: string;
  overviewTitle?: string;
  background: ProfileBackground;
  email?: string;
  office?: string;
  phone?: { label: string; href: string };
  source: string;
  note?: string;
  profileAvailable?: boolean;
  portrait?: { src: string; alt: string; width: number; height: number; credit: string; source: string };
  recognition?: { year: string; title: string }[];
  extraLinks?: { label: string; href: string }[];
};

function Timeline({ entries }: { entries: BackgroundEntry[] }) {
  return <ol className="member-profile-timeline">{entries.map((entry, index) => <li key={`${entry.title}-${index}`}>
    <div className="member-profile-entry-heading"><h3>{entry.title}</h3>{entry.period && <span>{entry.period}</span>}</div>
    <p className="member-profile-organization">{entry.organization}</p>
    {entry.location && <p className="member-profile-location">{entry.location}</p>}
    {entry.description && <p className="member-profile-description">{entry.description}</p>}
  </li>)}</ol>;
}

export function MemberProfile(profile: ProfileProps) {
  const { background } = profile;
  const hasOverview = Boolean(profile.summary || profile.area);
  const hasContact = Boolean(profile.email || profile.office || profile.phone);
  const notes = [...background.notes, ...(profile.note ? [profile.note] : [])];
  const sections = [
    ...(hasOverview ? [{ id: "research", label: profile.overviewTitle ?? "Research" }] : []),
    ...(background.education.length ? [{ id: "education", label: "Education" }] : []),
    ...(background.experience.length ? [{ id: "experience", label: "Experience" }] : []),
    ...(profile.recognition?.length ? [{ id: "recognition", label: "Recognition" }] : []),
    ...(hasContact ? [{ id: "contact-details", label: "Contact" }] : []),
  ];
  return <section className="section member-profile-section"><div className="shell member-profile-layout">
    <aside className="member-profile-sidebar" aria-label={`${profile.name} profile details`}>
      {profile.portrait && <figure className="member-profile-portrait">
        <img src={profile.portrait.src} alt={profile.portrait.alt} width={profile.portrait.width} height={profile.portrait.height}/>
        <figcaption><a href={profile.portrait.source} target="_blank" rel="noreferrer">Photo: {profile.portrait.credit} ↗</a></figcaption>
      </figure>}
      <div className="member-profile-at-a-glance"><p className="eyebrow dark">At a glance</p><dl>
        <div><dt>Role</dt><dd>{profile.role}</dd></div>
        {profile.affiliation && <div><dt>Affiliation</dt><dd>{profile.affiliation}</dd></div>}
        {profile.area && <div><dt>Research area</dt><dd>{profile.area}</dd></div>}
      </dl></div>
      {sections.length > 0 && <nav className="member-profile-nav" aria-label="On this profile"><p>On this page</p>{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.label}<span aria-hidden="true">↘</span></a>)}</nav>}
      {profile.extraLinks?.map(link => <a className="member-profile-extra" key={link.href} href={link.href}>{link.label} ↗</a>)}
    </aside>
    <div className="member-profile-content">
      {hasOverview && <section id="research" className="member-profile-block"><h2>{profile.overviewTitle ?? "Research"}</h2>{profile.summary ? <p className="member-profile-overview">{profile.summary}</p> : <p className="member-profile-overview">{profile.area}</p>}</section>}
      {background.education.length > 0 && <section id="education" className="member-profile-block"><h2>Education</h2><Timeline entries={background.education}/></section>}
      {background.experience.length > 0 && <section id="experience" className="member-profile-block"><h2>Research & professional experience</h2><Timeline entries={background.experience}/></section>}
      {profile.recognition && profile.recognition.length > 0 && <section id="recognition" className="member-profile-block"><h2>Selected recognition</h2><ul className="member-profile-recognition">{profile.recognition.map(item => <li key={`${item.year}-${item.title}`}><span>{item.year}</span><p>{item.title}</p></li>)}</ul></section>}
      {hasContact && <section id="contact-details" className="member-profile-block"><h2>Contact</h2><dl className="member-profile-contact">
        {profile.email && <div><dt>Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>}
        {profile.phone && <div><dt>Phone</dt><dd><a href={profile.phone.href}>{profile.phone.label}</a></dd></div>}
        {profile.office && <div><dt>Office</dt><dd>{profile.office}</dd></div>}
      </dl></section>}
      {profile.profileAvailable === false && <p className="member-profile-availability">This member is listed in the group directory. A detailed biography is not available from the original website.</p>}
      {notes.length > 0 && <div className="member-profile-notes"><h2>Profile notes</h2>{notes.map(note => <p key={note}>{note}</p>)}</div>}
      <p className="member-profile-source">Source: <a href={profile.source} target="_blank" rel="noreferrer">Original group {profile.profileAvailable === false ? "directory" : "profile"} ↗</a></p>
      <div className="profile-actions member-profile-actions"><a className="text-link dark-link" href="/kanatzidis-demo/people">← Group directory</a><a className="text-link dark-link" href="/kanatzidis-demo/research">Explore our research →</a></div>
    </div>
  </div></section>;
}
