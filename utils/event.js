import _ from 'lodash';
import { formatHeaderDate } from './date';

export function formatEventList(list) {
  let grouped = _.chain(list).sortBy('DateTime').reverse().groupBy(function(item){
    return formatHeaderDate(new Date(item.DateTime))
  }).value();
  let upcomingEvents = _.chain(list).filter(function(item){
    let date = new Date(item.DateTime);
    return isToday(date)
  }).sortBy('DateTime').value();
  let result = _.reduce(grouped, function(result, value, key) {
    result.push({'title': key, 'data': value});
    return result;
  }, []);
  result.unshift({'title': "Upcoming Events", 'data': upcomingEvents});

  return result;
}

export function formatNotification(list) {
  let grouped = _.chain(list).sortBy('DateTime').reverse().groupBy(function(item){
    return formatHeaderDate(new Date(item.DateTime))
  }).value();
  let result = _.reduce(grouped, function(result, value, key) {
    result.push({'title': key, 'data': value});
    return result;
  }, []);

  return result;
}

const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

const special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
const deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
export function stringifyNumber(n) {
  if (n < 20) return special[n];
  if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
}
