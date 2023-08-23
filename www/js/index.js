// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
/*
//  DoseMAanager's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAt4SUmSwvkHdas68AYQdjOe7fkfL547gQ",
    authDomain: "dosemanager-d0236.firebaseapp.com",
    projectId: "dosemanager-d0236",
    storageBucket: "dosemanager-d0236.appspot.com",
    messagingSenderId: "373646054095",
    appId: "1:373646054095:web:89660fa48e041a7d231dba",
    measurementId: "G-XDL965JQ9H"
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/
// Wait for the deviceready event before using any of Cordova's device APIs.

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Cordova device is ready!");
}

function loadDB() {
  //  DoseMAanager's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAt4SUmSwvkHdas68AYQdjOe7fkfL547gQ",
    authDomain: "dosemanager-d0236.firebaseapp.com",
    projectId: "dosemanager-d0236",
    storageBucket: "dosemanager-d0236.appspot.com",
    messagingSenderId: "373646054095",
    appId: "1:373646054095:web:89660fa48e041a7d231dba",
    measurementId: "G-XDL965JQ9H",
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);

  var firestore = firebase.firestore();

  //data you want to add in
  const newMeds = {
    name: "APPOINTMENT",
    description: "A NEW APPOINTMENT ",
  };

  // Add the profile to the Firestore collection
  firestore
    .collection("Appointments")
    .add(newMeds)
    .then((docRef) => {
      console.log("Profile added with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding profile: ", error);
    });
}

function retrieveMeds() {
  //  DoseMAanager's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAt4SUmSwvkHdas68AYQdjOe7fkfL547gQ",
    authDomain: "dosemanager-d0236.firebaseapp.com",
    projectId: "dosemanager-d0236",
    storageBucket: "dosemanager-d0236.appspot.com",
    messagingSenderId: "373646054095",
    appId: "1:373646054095:web:89660fa48e041a7d231dba",
    measurementId: "G-XDL965JQ9H",
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);
  var firestore = firebase.firestore();
  var medsCollection = firestore.collection("Medicine");

  medsCollection
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() contains the document's data
        console.log("Medicine ID:", doc.id);
        console.log("Medicine Data:", doc.data());
      });
    })
    .catch(function (error) {
      console.error("Error getting medicine documents: ", error);
    });
}
