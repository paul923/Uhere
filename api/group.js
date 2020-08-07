import { backend } from '../constants/Environment';
import _ from 'lodash'


export async function getGroupById(groupId) {
  try {
    let url = `http://${backend}:3000/groups/${groupId}`;
    let response = await fetch(url);
    let group = await response.json();
    if (group.success) {
      let results = group.body.results
      group.body.results = {
        GroupId: _.get(_.find(results, 'GroupId'), 'GroupId'),
        UserId: _.get(_.find(results, 'UserId'), 'UserId'),
        GroupName: _.get(_.find(results, 'GroupName'), 'GroupName'),
        Members: _.map(results, function (obj) {
          let member = _.omit(obj, ["UserId", "GroupId", "GroupName"]);
          member['UserId'] = member["MemberId"];
          delete member["MemberId"];
          return member;
        })
      }
      return group.body.results;
    } else {
      return group.error;
    }
  } catch (error) {
    // console.error(error);
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
    let json = await response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch (error) {
    // console.error(error);
    return null
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
    let json = await response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch(error) {
    // console.error(error);
    return null;
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
    //TODO: fix json returning null
    let json = await response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch(error) {
    // console.error(error);
    return null;
  }
}