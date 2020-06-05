import { backend } from '../constants/Environment';

export async function getEventByID(EventId) {
    try {
        let url = `http://${backend}:3000/event/detail/${EventId}`;
        let response = await fetch(url);
        let json = await response.json();
        let event = json[0];
        return event;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getEventMembers(EventId) {
    try {
        let url = `http://${backend}:3000/event/users/${EventId}`;
        let response = await fetch(url);
        let json = await response.json();
        let eventusers = json.response;
        let members = [];
        for (const eventuser of eventusers) {
            let member = await getUserByID(eventuser.UserId);
            member.ArrivedTime = eventuser.ArrivedTime
            members.push(member);
        }
        return members;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserByID(UserID) {
    try {
        let url = `http://${backend}:3000/user/${UserID}`;
        let response = await fetch(url);
        let json = await response.json();
        let user = json.response[0];
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}