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

export function combineDateAndTime(date, time) {
  var timeString = time.getHours() + ':' + time.getMinutes() + ':00';
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Jan is 0, dec is 11
  var day = date.getDate();
  var dateString = '' + year + '-' + month + '-' + day;
  var combined = new Date(dateString + ' ' + timeString);

  return combined;
};
