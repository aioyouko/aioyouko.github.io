import schedule from '../data/meetings.json';
import { Page, SourceLink } from '../components/Content';
import { MeetingCalendar } from './MeetingCalendar';
import { normalizeMeeting, formatMeetingDate } from './schedule';
import './meetings.css';
export const metadata={title:'Group Meetings | Kanatzidis Research Group'};
export default function Meetings(){
  const meetings=schedule.group.map(normalizeMeeting).sort((a,b)=>a.date.localeCompare(b.date));
  return <div className="meetings-page"><Page eyebrow="Group meetings" title="Group meetings" description="Research presentations and conversations across the group."><section className="section meetings-section"><div className="shell">
    <div className="meeting-overview"><div className="meeting-cadence"><span className="meeting-weekday" aria-hidden="true">MON</span><div><h2>Mondays, 3:00 PM</h2><p>Tech K242 <span>·</span> Evanston time <span>·</span> 30-minute presentations</p></div></div><a className="source-link" href="mailto:m-kanatzidis@northwestern.edu">Ask about attending ↗</a></div>
    <MeetingCalendar meetings={meetings}/>
    <details className="meeting-disclosure schedule-notes"><summary>Schedule notes</summary><div><p>The published calendar lists 3:00 PM; the original homepage lists 5:00 PM. This page follows the calendar, with individual time changes shown on each meeting.</p>{schedule.unresolved.length>0&&<p>Christmas and New Year holiday dates are unconfirmed in the original calendar and have not been added to the schedule.</p>}<SourceLink path="calendar.html">Check the original calendar</SourceLink></div></details>
    <section className="meeting-disclosure joint-archive" aria-labelledby="joint-meeting-heading"><header className="joint-archive-heading"><div><span className="archive-eyebrow">NU DOE thermoelectrics</span><h2 id="joint-meeting-heading">Joint meeting archive</h2></div><span className="archive-count">{schedule.joint.length} meetings</span></header><div><p>Published schedule · Fridays, 10:00–11:00 AM · Tech K242. Contact the group for remote attendance details.</p><div className="table-scroll"><table className="schedule-table compact-schedule"><caption>Published joint-meeting schedule</caption><thead><tr><th scope="col">Date</th><th scope="col">Location</th><th scope="col">Presenters / status</th></tr></thead><tbody>{schedule.joint.map(row=><tr key={row.date}><th scope="row">{formatMeetingDate(normalizeMeeting(row).date,{month:'short',day:'numeric',year:'numeric'})}</th><td>{row.location}</td><td>{row.presenters}</td></tr>)}</tbody></table></div></div></section>
    <div className="profile-actions meeting-source-links"><SourceLink path="calendar.html">Original group calendar</SourceLink><a className="source-link" href="https://www.registrar.northwestern.edu/calendars/">Northwestern academic calendars ↗</a></div>
  </div></section></Page></div>;
}
