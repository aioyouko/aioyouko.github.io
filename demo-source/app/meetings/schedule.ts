export type MeetingInput = { date: string; location: string; presenters: string; time?: string };
export type Meeting = { date: string; location: string; presenters: string; time: string; cancelled: boolean };
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// Use UTC for calendar arithmetic so viewers in other timezones see the same date.
export function normalizeMeeting(row: MeetingInput): Meeting {
  let date = row.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const match = /^(\w+) (\d{1,2}), (\d{4})$/.exec(date);
    if (!match || !months.includes(match[1])) throw new Error(`Invalid meeting date: ${date}`);
    date = `${match[3]}-${String(months.indexOf(match[1])+1).padStart(2,'0')}-${match[2].padStart(2,'0')}`;
  }
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) throw new Error(`Invalid meeting date: ${date}`);
  const exception = /\s*@\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)/i.exec(row.location);
  return {date, presenters: row.presenters.split('/').map(n=>n.trim()).join(' / '), location: row.location.replace(/\s*@.*$/, '').replaceAll('*','').trim(), time: row.time || (exception ? `${exception[1].includes(':') ? exception[1] : exception[1]+':00'} ${exception[2].toUpperCase()}` : '3:00 PM'), cancelled: row.presenters.toLowerCase() === 'no meeting'};
}
export function formatMeetingDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {...options, timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
}
export function shiftMonth(month: string, offset: number) {
  const [year, number] = month.split('-').map(Number);
  return new Date(Date.UTC(year, number-1+offset, 1, 12)).toISOString().slice(0,7);
}
export function calendarDays(month: string) {
  const [year, number] = month.split('-').map(Number);
  const offset = (new Date(Date.UTC(year, number-1, 1, 12)).getUTCDay()+6)%7;
  const count = new Date(Date.UTC(year, number, 0, 12)).getUTCDate();
  return Array.from({length:Math.ceil((offset+count)/7)*7}, (_, i)=>new Date(Date.UTC(year,number-1,1-offset+i,12)).toISOString().slice(0,10));
}
