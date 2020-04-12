import _ from 'lodash';
import { formatDate } from './date';

export function formatEventList(list) {
  let grouped = _.groupBy(list, function(item){
    return formatDate(new Date(item.DateTime))
  })

  let result = _.reduce(grouped, function(result, value, key) {
    result.push({'title': key, 'data': value});
    return result;
  }, []);
  return result;
}
