import { backend } from '../constants/Environment';

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