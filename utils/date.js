import { format, formatDistance, formatRelative, subDays } from 'date-fns';

export function formatDate(date) {
  return format(date, 'MMM do, yyyy')
}
export function formatTime(date) {
  return format(date, 'a hh:mm')
}
