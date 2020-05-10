import { backend } from '../constants/Environment';
import _ from 'lodash'

export async function getUserByUsername(Username) {
    try {
        let url = `http://${backend}:3000/user/username/${Username}`;
        let response = await fetch(url);
        let json = await response.json();
        if(json.status === 204){
            return null;
        }else {
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
        let url = `http://${backend}:3000/user/group/${UserId}`;
        let response = await fetch(url);
        let json = await response.json();
        let groups = json.response;
        let sortedGroups = _(groups).groupBy('GroupId').map(function(items, id) {
            return {
              GroupId: id,
              UserId: _.get(_.find(items, 'UserId'), 'UserId'),
              GroupName: _.get(_.find(items, 'GroupName'), 'GroupName'),
              MemberIds: _.map(items, 'MemberId'),
            }
        }).value();
        return sortedGroups;
    } catch (error) {
        console.error(error);
        return null;
    }
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
        let url = `http://${backend}:3000/relationship/type/${uid}-${userName}`;
        let response = await fetch(url);
        let json = await response.json();
        let relationship = json.response[0];
        return relationship;
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
