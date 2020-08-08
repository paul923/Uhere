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

  console.log(result);
  return result;
}

const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};
