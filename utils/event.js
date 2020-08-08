import _ from 'lodash';
import { formatHeaderDate } from './date';

export function formatEventList(list) {
  let grouped = _.chain(list).sortBy('DateTime').reverse().groupBy(function(item){
    return formatHeaderDate(new Date(item.DateTime))
  }).value();

  let result = _.reduce(grouped, function(result, value, key) {
    result.push({'title': key, 'data': value});
    return result;
  }, []);
  return result;
}
