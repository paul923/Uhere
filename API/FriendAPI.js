import { backend } from '../constants/Environment';

export async function getUserByUsername(Username) {
    try {
        let url = `http://${backend}:3000/user/username/${Username}`;
        let response = await fetch(url);
        let json = await response.json();
        let user = json.response[0];
        return user;
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
        return groups;
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
 

