import { backend } from '../constants/Environment';
import _ from 'lodash'


export async function getGroupById(groupId) {
    try {
        let url = `http://${backend}:3000/groups/${groupId}`;
        let response = await fetch(url);
        if(response.status === 200){
            let group = await response.json();
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
  try{
    let url = `http://${backend}:3000/groups`;
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
    if(response.status === 201)
      return true;
    return false;
  } catch (error) {
    console.error(error);
    return false
  }
}


export async function updateGroup(groupId, group, groupMembers) {
  try{
    let url = `http://${backend}:3000/groups/${groupId}`;
    let response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          group,
          groupMembers
      }),
    });
    if(response.status === 200)
      return true;
    return false;
  } catch(error) {
    console.error(error);
    return false;
  }
}

export async function deleteGroupById(groupId) {
  try{
    let url = `http://${backend}:3000/groups/${groupId}`;
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if(response.status === 204)
      return true;
    return false;
  } catch(error) {
    console.error(error);
    return false;
  }
}