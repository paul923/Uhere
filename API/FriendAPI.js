import { backend } from '../constants/Environment';
import _ from 'lodash'

export async function getUserByUsername(Username) {
    try {
        let url = `http://${backend}:3000/user/username/${Username}`;
        let response = await fetch(url);
        let json = await response.json();
        if(json.status !== 204){
            let user = json.response[0];
            return user;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function getUserByUid(UserId) {
    try {
        let url = `http://${backend}:3000/user/${UserId}`;
        let response = await fetch(url);
        let json = await response.json();
        let user = json.response[0];
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function getFriendsList(UserId) {
    try{
        let response = await fetch(`http://${backend}:3000/relationship/${UserId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        let json = await response.json();
        let list = json.response;
        return list;
    }catch (error) {
        console.error(error);
        return null;
    }

  }

export async function getUserGroup(UserId) {
    try {
        let url = `http://${backend}:3000/user/${UserId}/group`;
        let response = await fetch(url);
        let json = await response.json();
        if(json.status !== 204){
            let groups = json.response;
            let sortedGroups = _(groups).groupBy('GroupId').map(function(items, id) {
                return {
                  GroupId: id,
                  UserId: _.get(_.find(items, 'UserId'), 'UserId'),
                  GroupName: _.get(_.find(items, 'GroupName'), 'GroupName'),
                  Members: items.map(function(item){
                      return {
                          MemberId : item.MemberId,
                          Nickname : item.Nickname,
                          Username : item.Username
                      }
                  }),
                }
            }).value();
            return sortedGroups;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGroupById(UserId, GroupId) {
    try {
        let url = `http://${backend}:3000/user/${UserId}/group/${GroupId}`;
        let response = await fetch(url);
        let json = await response.json();
        if(json.status !== 204){
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
export async function addGroupMember(group, newMembers) {
    let url = `http://${backend}:3000/user/group/member/${group.GroupId}`;
    let response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          group,
          newMembers: newMembers,
      }),
    });
    let responseJson = await response.json();
    if(!responseJson)
        return null;
    return responseJson;
}
export async function deleteGroupMember(group, deleteMembers) {
    let url = `http://${backend}:3000/user/group/member/${group.GroupId}`;
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          group,
          deleteMembers: deleteMembers
      }),
    });
    let responseJson = await response.json();
    if(!responseJson)
        return null;
    return responseJson;
}

export async function deleteGroupById(userId, groupId) {
    let url = `http://${backend}:3000/user/${userId}/group/${groupId}`;
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

export async function getUserRelationship(UserId) {
    try {
        let url = `http://${backend}:3000/relationship/${UserId}`;
        let response = await fetch(url);
        let json = await response.json();
        let users = json.response;
        console.log(users)
        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getRelationshipType(uid, userName) {
    try {
        let url = `http://${backend}:3000/relationship/type/${uid}/${userName}`;
        let response = await fetch(url);
        let json = await response.json();
        if(json.status !== 204){
            let relationship = json.response[0];
            return relationship;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function addFriend(AddFriend) {
    let url = `http://${backend}:3000/relationship`;
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({AddFriend}),
    });
    let responseJson = await response.json();
    console.log(responseJson.response);
    return responseJson;
}
export async function addFriendByFlag(AddFriend) {
    let url = `http://${backend}:3000/relationship`;
    let response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({AddFriend}),
    });
    let responseJson = await response.json();
    console.log(responseJson)
    return responseJson;
}

export async function deleteFriend(DeleteFriend) {
    let url = `http://${backend}:3000/relationship`;
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({DeleteFriend}),
    });
    let responseJson = await response.json();
    console.log(responseJson.response);
    return responseJson;
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
