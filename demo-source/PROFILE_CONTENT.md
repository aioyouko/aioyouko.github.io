# Structured member profiles

All 45 member routes and the principal-investigator route use `MemberProfile`. The name-only directory is retained. Profile sections include Research or Biography, Education, Research & professional experience, Contact, and relevant notes. Navigation includes only sections that have content. Unsupported portrait placeholders have been removed; the principal investigator's existing sourced photograph remains.

## Content model and sources

- `app/data/people.json` retains directory identities, contact details, original source URLs and existing status notes.
- `app/data/profile-backgrounds.json` contains 66 education records and 60 research/appointment records across 46 profiles, with separate title, organization, period, location and description fields.
- Content was organized from the degree blocks and biographical paragraphs of the original member pages linked in `people.json`. The principal investigator's source is https://chemgroups.northwestern.edu/kanatzidis/kanatzidis.html.
- Dates are included only when provided. Single years are not expanded into employment ranges. Joined dates, expected graduation years, class years and relative durations retain their meaning. Unnamed employers remain unnamed; unspecified roles and missing degrees are not inferred.
- Research Fellow and postdoctoral appointments are separate from academic degrees. Undergraduate and master's research are labeled as research experience rather than employment. Dual degrees remain grouped together.
- The two profiles listing EPFL without an associated degree or role retain that affiliation in a note rather than assigning an invented degree or appointment.
- Existing completed-defense and IMSERC-directory discrepancies remain visible. Members lacking a source biography have no empty or fabricated education/experience sections.

## Validation

Production build and TypeScript checks pass. Rendered-page checks cover all 46 routes, every education/experience entry, section navigation, contact links, source links, existing notes and missing-biography cases. The member directory retains 46 name-only links. Browser visual verification remains unavailable under the current browser-access restriction.
