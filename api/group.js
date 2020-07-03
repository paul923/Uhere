import { backend } from '../constants/Environment';
import _ from 'lodash'


export async function getGroupById(groupId) {
    try {
        let url = `http://${backend}:3000/group/groups/${groupId}`;
        let response = await fetch(url);
        let json = await response.json();
        if(json.status !== 200){
            let group = json.response;
            let sortedGroups = 
                {
                  GroupId: _.get(_.find(group, 'GroupId'), 'GroupId'),
                  UserId: _.get(_.find(group, 'UserId'), 'UserId'),
                  GroupName: _.get(_.find(group, 'GroupName'), 'GroupName'),
                  Members: _.map(group, function (obj) {
                    let member = _.omit(obj, ["UserId","GroupId", "GroupName"]);
                    member['UserId'] = member["MemberId"];
                    delete member["MemberId"];
                    return member;
                  })
                }
            ;
            console.log("sortedGroup",sortedGroups)
            return sortedGroups;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function postGroup(group, members) {
    let url = `http://${backend}:3000/user/group`;
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          group,
          members: members
        }),
    });
    let responseJson = await response.json();
    console.log(responseJson.response);
    return responseJson;
}


export async function updateGroupName(group) {
  let url = `http://${backend}:3000/user/group/name`;
  let response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        group
    }),
  });
  let responseJson = await response.json();
  if(!responseJson)
      return null;
  return responseJson;
}

export async function deleteGroupById(groupId) {
    let url = `http://${backend}:3000/group/groups/${groupId}`;
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    let responseJson = await response.json();
    if(!responseJson)
        return null;
    return responseJson;
}