import { backend } from '../constants/Environment';
import _ from 'lodash'

export async function getUserByUserId(UserId) {
    try {
        let url = `http://${backend}:3000/users/${UserId}`;
        let response = await fetch(url);
        let json = await response.json();
        let user = json[0];
        //console.log(response.status);
        return user;
    } catch (error) {
        //console.error(error);
        return null;
    }
}

export async function getUserByUsername(Username) {
    try {
        let url = `http://${backend}:3000/users/username/${Username}`;
        let response = await fetch(url);
        let json = await response.json();
        let user = json[0];
        return user;
    } catch (error) {
        //console.error(error);
        return null;
    }
}

export async function getGroupsByUserId(UserId) {
    try {
        let url = `http://${backend}:3000/users/${UserId}/groups`;
        let response = await fetch(url);
        let json = await response.json();
        let groups = json;
        return groups;
    } catch (error) {
        //console.error(error)
        return null;
    }
}

export async function getRelationships(UserId) {
    try {
        let url = `http://${backend}:3000/users/${UserId}/relationships`;
        let response = await fetch(url);
        let json = await response.json();
        let relationships = json;
        return relationships;
    } catch (error) {
        //console.error(error);
        return null;
    }
}

export async function getRelationshipByUsername(UserId1, Username) {
    try {
        let url = `http://${backend}:3000/users/${UserId1}/relationships/${Username}`;
        let response = await fetch(url);
        let json = await response.json();
        let relationship = json;
        return relationship;
    } catch (error) {
        //console.error(error);
        return null;
    }
}

export async function createUser(User) {
    try {
        let response = await fetch(`http://${backend}:3000/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(User)
        });
        let responseJson = await response.json();
        // TODO:when do we check if username exists?
        return true;
    } catch (error) {
        //console.error(error);
        return false;
    }
}

export async function createRelationship(UserId1, UserId2) {
    try {
        let response = await fetch(`http://${backend}:3000/users/${UserId1}/relationships/${UserId2}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        //let responseJson = await response.json();
        // TODO: status 500 check?
        console.log(response.status);
        if (response.status != 201) {
            return false;
        }
        //console.log(responseJson);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function updateUser(User) {
    try {
        let url = `http://${backend}:3000/users/${User.UserId}`;
        let response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nickname: User.Nickname,
                AvatarURI: User.AvatarURI,
                AvatarColor: User.AvatarColor
            }),
        });
        //let responseJson = await response.json();
        return true;
    } catch (error) {
        //console.error(error);
        return false;
    }
}
// type : 'Friend' or 'Blocked'
export async function updateRelationship(userId1, userId2, type) {
    try {
        let url = `http://${backend}:3000/users/${userId1}/relationships/${userId2}`;
        let response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Type: type,
            }),
        });
        //let responseJson = await response.json();
        return true;
    } catch (error) {
        //console.error(error);
        return false;
    }
}

export async function deleteUser(userId) {
    try {
        let url = `http://${backend}:3000/users/${userId}`;
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        //let responseJson = await response.json();
        return true;
    } catch (error) {
        //console.error(error);
        return false;
    }
}
