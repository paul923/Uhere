import { backend } from '../constants/Environment';
import firebase from 'firebase';

export async function getEvent(eventId) {
    try {
        let url = `http://${backend}:3000/events/${eventId}`;
        let response = await fetch(url);
        let json = await response.json();
        let event = json[0];
        console.log(event);
        return event;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function getEvents(acceptStatus, history, limit, offset) {
  try {
      let url = `http://${backend}:3000/events`;
      url += `?acceptStatus=${acceptStatus}`;
      url += `&history=${history}`;
      url += `&userId=${firebase.auth().currentUser.uid}`;
      url += `&limit=${limit}`;
      url += `&offset=${offset}`;
      let response = await fetch(url);
      if (response.status === 404) {
        console.log([])
        return [];
      } else {
        let events = await response.json();
        console.log(events)
        return events;
      }
  } catch (error) {
      console.error(error);
      return null;
  }
}

export async function createEvent(event, members) {
  let response = await fetch(`http://${backend}:3000/events`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event,
      users: members,
      host: firebase.auth().currentUser.uid
    }),
  });
  return response.json();
}

export async function acceptEvent(eventId) {
  let url = `http://${backend}:3000/events/${eventId}/users/${firebase.auth().currentUser.uid}`;
  let response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        status: 'ACCEPTED'
    }),
  });
  let responseJson = await response.json();
  console.log(responseJson);
  return responseJson;
}

export async function declineEvent(eventId) {
  let url = `http://${backend}:3000/events/${eventId}/users/${firebase.auth().currentUser.uid}`;
  let response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        status: 'DECLINED'
    }),
  });
  let responseJson = await response.json();
  console.log(responseJson);
  return responseJson;
}


export async function cancelEvent(eventId) {
  let url = `http://${backend}:3000/events/${eventId}`;
  let response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
  let responseJson = await response.json();
  console.log(responseJson);
  return responseJson;
}
