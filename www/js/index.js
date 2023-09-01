/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
  




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