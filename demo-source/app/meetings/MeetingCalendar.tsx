"use client";
import { useState, useSyncExternalStore } from 'react';
import { calendarDays, formatMeetingDate, shiftMonth, type Meeting } from './schedule';
function currentDay() {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part = (type:string) => parts.find(p=>p.type===type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
function subscribeToDay(onChange:()=>void) {
  const timer=window.setInterval(onChange,60_000);
  window.addEventListener('focus',onChange);
  return ()=>{window.clearInterval(timer);window.removeEventListener('focus',onChange);};
}
const serverDay=()=>'';
const dateLabel=(date:string)=>formatMeetingDate(date,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
function MeetingDetails({meeting}:{meeting:Meeting}) {
  return <><strong>{meeting.presenters}</strong><span>{meeting.cancelled ? meeting.location : `${meeting.time} · ${meeting.location}`}</span></>;
}
export function MeetingCalendar({meetings}:{meetings:Meeting[]}) {
  const today=useSyncExternalStore(subscribeToDay,currentDay,serverDay);
  const [chosenMonth,setChosenMonth]=useState<string|null>(null);
  const [selectedDate,setSelectedDate]=useState<string|null>(null);
  const [dismissedTooltip,setDismissedTooltip]=useState<string|null>(null);
  const month=chosenMonth ?? (today ? today.slice(0,7) : meetings[0]?.date.slice(0,7) ?? '2026-01');
  const monthRows=meetings.filter(m=>m.date.startsWith(month));
  const nextMeeting=today ? meetings.find(m=>m.date>=today&&!m.cancelled) : undefined;
  const activeDate=selectedDate?.startsWith(month) ? selectedDate : monthRows.find(m=>!m.cancelled&&(!today||m.date>=today))?.date;
  const heading=formatMeetingDate(`${month}-01`,{month:'long',year:'numeric'});
  const months=[...new Set([...meetings.map(m=>m.date.slice(0,7)),month,...(today?[today.slice(0,7)]:[])])].sort();
  const byDate=new Map(meetings.map(m=>[m.date,m]));
  function changeMonth(value:string){setChosenMonth(value);setSelectedDate(null);}
  return <section className="meeting-scheduler" aria-label="Group meeting schedule">
    <div className="schedule-toolbar"><div className="schedule-month"><p className="eyebrow dark">Group meeting schedule</p><h2 id="calendar-month" aria-live="polite">{heading}</h2></div><div className="schedule-controls">
      <select aria-label="Jump to month" value={month} onChange={e=>changeMonth(e.target.value)}>{months.map(value=><option key={value} value={value}>{formatMeetingDate(`${value}-01`,{month:'short',year:'numeric'})}</option>)}</select>
      <button type="button" onClick={()=>changeMonth(today.slice(0,7))} disabled={!today}>Today</button><div className="month-arrows"><button type="button" aria-label="Previous month" onClick={()=>changeMonth(shiftMonth(month,-1))}>←</button><button type="button" aria-label="Next month" onClick={()=>changeMonth(shiftMonth(month,1))}>→</button></div>
    </div></div>
    <div className="schedule-layout"><div className="calendar-panel">
      <div className="calendar-weekdays" aria-hidden="true">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day=><span key={day}>{day}</span>)}</div>
      <div className="calendar-grid" role="group" aria-labelledby="calendar-month">{calendarDays(month).map((date,index)=>{
        const inMonth=date.startsWith(month), meeting=inMonth?byDate.get(date):undefined, isToday=date===today;
        return <div key={date} className={`calendar-cell${!inMonth?' outside-month':''}${meeting?' has-meeting':''}${meeting?.cancelled?' is-cancelled':''}${date===activeDate?' is-selected':''}`} data-column={index%7}>
          {meeting ? <div className="calendar-event" onMouseEnter={()=>setDismissedTooltip(null)} onKeyDown={e=>{if(e.key==='Escape')setDismissedTooltip(date);}}>
            <button type="button" className="calendar-date-button" aria-label={`${dateLabel(date)}: ${meeting.presenters}. ${meeting.cancelled?meeting.location:`${meeting.time}, ${meeting.location}`}`} aria-pressed={date===activeDate} aria-current={isToday?'date':undefined} onFocus={()=>setDismissedTooltip(null)} onClick={()=>{setSelectedDate(date);setDismissedTooltip(null);}}>
              <span className={`calendar-number${isToday?' is-today':''}`}>{Number(date.slice(-2))}</span><span className="calendar-event-label">{meeting.cancelled?'No meeting':meeting.time.replace(':00','')}</span><span className="calendar-event-mark" aria-hidden="true"/>
            </button><div className="meeting-tooltip" role="tooltip" hidden={dismissedTooltip===date}><small>{formatMeetingDate(date,{weekday:'short',month:'short',day:'numeric'})}</small><MeetingDetails meeting={meeting}/></div>
          </div> : <span className={`calendar-number${isToday?' is-today':''}`} aria-label={dateLabel(date)} aria-current={isToday?'date':undefined}>{Number(date.slice(-2))}</span>}
        </div>;
      })}</div>
      <div className="calendar-legend"><span><i className="legend-meeting"/>Group meeting</span><span><i className="legend-cancelled"/>No meeting</span><p>Hover or select a date for details.</p></div>
    </div><div className="monthly-agenda" aria-label={`${heading} meeting list`}><div className="agenda-heading"><h3>This month</h3><span>{monthRows.filter(m=>!m.cancelled).length} meetings</span></div>
      {monthRows.length ? <ul>{monthRows.map(meeting=><li key={meeting.date} className={`${meeting.cancelled?'agenda-cancelled ':''}${meeting.date===activeDate?'agenda-selected':''}`}><button type="button" aria-pressed={meeting.date===activeDate} onClick={()=>setSelectedDate(meeting.date)}><span className="agenda-date"><strong>{meeting.date.slice(-2)}</strong><span>{formatMeetingDate(meeting.date,{weekday:'short'})}</span></span><span className="agenda-details"><MeetingDetails meeting={meeting}/>{meeting.date===nextMeeting?.date&&<small className="next-meeting-label">UP NEXT</small>}</span></button></li>)}</ul> : <div className="agenda-empty"><h4>No published meetings</h4><p>No schedule has been posted for this month.</p>{nextMeeting&&<button type="button" className="agenda-jump" onClick={()=>changeMonth(nextMeeting.date.slice(0,7))}>Go to the next meeting →</button>}</div>}
      <p className="agenda-timezone">All times are local to Evanston.</p>
    </div></div>
    <details className="meeting-disclosure full-schedule"><summary>View full published schedule <span>{meetings.length} dates</span></summary><div className="table-scroll"><table className="schedule-table compact-schedule"><caption>Group meeting schedule · all published dates</caption><thead><tr><th scope="col">Date</th><th scope="col">Time / location</th><th scope="col">Presenters / status</th></tr></thead><tbody>{meetings.map(m=><tr key={m.date} className={m.cancelled?'no-meeting':''}><th scope="row">{formatMeetingDate(m.date,{month:'short',day:'numeric',year:'numeric'})}</th><td>{m.cancelled?m.location:`${m.time} · ${m.location}`}</td><td>{m.presenters}</td></tr>)}</tbody></table></div></details>
  </section>;
}
