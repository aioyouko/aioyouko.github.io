"use client";

import { useState } from "react";
import { ImageBlock } from "./Content";

type Member = { name: string; slug: string; area: string; category: string };
const categories = ["Postdoctoral researchers", "Graduate students", "Visiting scholars", "Undergraduate students", "Other facilities"];
export function PeopleDirectory({ people }: { people: Member[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All members");
  const normalized = query.trim().toLocaleLowerCase();
  const filtered = people.filter(person =>
    (category === "All members" || person.category === category) &&
    `${person.name} ${person.area}`.toLocaleLowerCase().includes(normalized)
  );
  return <div className="people-directory">
    <div className="directory-tools">
      <form role="search" onSubmit={event => event.preventDefault()}>
        <label htmlFor="member-search">Find a group member</label>
        <input id="member-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name or research area"/>
      </form>
      <a className="text-link dark-link" href="/kanatzidis-demo/people/alumni">Alumni directory →</a>
    </div>
    <div className="member-filters" role="group" aria-label="Filter by member category">
      {["All members", ...categories].map(label => <button key={label} type="button" aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}
    </div>
    <p className="directory-count" role="status">{filtered.length} {filtered.length === 1 ? "member" : "members"}{query && ` matching “${query}”`}</p>
    {filtered.length === 0 && <div className="empty-state"><h2>No members found</h2><p>Try another name or research area, or clear the filters.</p><button className="button button-primary" onClick={() => { setQuery(""); setCategory("All members"); }}>Clear filters</button></div>}
    {categories.map(group => {
      const members = filtered.filter(person => person.category === group);
      if (!members.length) return null;
      return <section className="directory-section" key={group}>
        <div className="directory-heading"><h2>{group}</h2><span>{members.length} {members.length === 1 ? "person" : "people"}</span></div>
        <div className="member-grid">{members.map(person => <a className="member-card" key={person.slug} href={`/kanatzidis-demo/people/${person.slug}`}>
          <ImageBlock label={`${person.name} portrait`}/>
          <div><h3>{person.name}</h3><p>{person.area || group}</p><span className="member-link">View profile →</span></div>
        </a>)}</div>
      </section>;
    })}
  </div>;
}
