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