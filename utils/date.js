import { format, formatDistance, formatRelative, subDays } from 'date-fns';

export function formatDate(date) {
  return format(date, 'MMM do, yyyy')
}
export function formatTime(date) {
  return format(date, 'a hh:mm')
}
export function formatMonth(date) {
  return format(date, 'MMM do')
}
export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
