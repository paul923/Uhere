import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHzlzyQGQDqDxeDwwYs7o9rkgD4z7Tp6Y",
  authDomain: "fluid-uhere.firebaseapp.com",
  databaseURL: "https://fluid-uhere.firebaseio.com",
  projectId: "fluid-uhere",
  storageBucket: "fluid-uhere.appspot.com",
  messagingSenderId: "605844819615",
  appId: "1:605844819615:web:e539873a514255ba875caa",
  measurementId: "G-XYCTQHJC1Q"
};



export default firebase.initializeApp(firebaseConfig);
