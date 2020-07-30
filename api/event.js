import { backend } from '../constants/Environment';
import firebase from 'firebase';

export async function getEvent(eventId) {
    try {
        let url = `http://${backend}:3000/events/${eventId}`;
        let response = await fetch(url);
        let json = await response.json();
        if (json.success) {
          return json.body.results[0];
        } else {
          return json.error;
        }
    } catch (error) {
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
      let json = await response.json();
      if (json.success) {
        return json.body.results;
      } else {
        return json.error;
      }
  } catch (error) {
      console.error(error);
      return null;
  }
}

export async function createEvent(event, members) {
  try {
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
    let json = response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch (error) {
    return null;
  }

}

export async function acceptEvent(eventId) {
  try {
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
    let json = response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch (error) {
    return null;
  }
}

export async function declineEvent(eventId) {
  try {
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
    let json = response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch (error) {
    return null;
  }
}


export async function cancelEvent(eventId) {
  try {
    let url = `http://${backend}:3000/events/${eventId}`;
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    let json = response.json();
    if (json.success) {
      return json.body;
    } else {
      return json.error;
    }
  } catch (error) {
    return null;
  }

}
