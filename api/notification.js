import { backend } from '../constants/Environment';
import _ from 'lodash'
import firebase from 'firebase';


export async function getNotifications() {
  try {
    let url = `http://${backend}:3000/notifications/${firebase.auth().currentUser.uid}`;
    let response = await fetch(url);
    let json = await response.json();
    if (json.success) {
      return json.body.results;
    } else {
      return json.error;
    }
  } catch (error) {
    return null;
  }
}

export async function getNotificationsByType(type) {
  try {
    let url = `http://${backend}:3000/notifications/${firebase.auth().currentUser.uid}?type=${type}`;
    let response = await fetch(url);
    let json = await response.json();
    if (json.success) {
      return json.body.results;
    } else {
      return json.error;
    }
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function flagIsNewNotification(notificationId, isNew) {
  try {
    let url = `http://${backend}:3000/notifications/${firebase.auth().currentUser.uid}/${notificationId}`;
    let response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          isNew
      }),
    });
  } catch (error) {
    // console.error(error);
    return null;
  }
}
