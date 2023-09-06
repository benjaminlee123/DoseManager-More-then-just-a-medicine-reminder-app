
const firebaseConfig = {
    apiKey: "AIzaSyAt4SUmSwvkHdas68AYQdjOe7fkfL547gQ",
    authDomain: "dosemanager-d0236.firebaseapp.com",
    projectId: "dosemanager-d0236",
    storageBucket: "dosemanager-d0236.appspot.com",
    messagingSenderId: "373646054095",
    appId: "1:373646054095:web:89660fa48e041a7d231dba",
    measurementId: "G-XDL965JQ9H",
};
// Initialize Firebase with the configuration
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Export the firestore instance for reuse
  var firestore = firebase.firestore();
  window.firestore = firestore;