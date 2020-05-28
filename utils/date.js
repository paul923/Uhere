import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import * as Localization from 'expo-localization';

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
}

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


export function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

export function convertDateToLocalTimezone(date) {
  var localizedDate = date.toLocaleString("en-US", {timeZone: Localization.timezone});
  return new Date(localizedDate);
}
