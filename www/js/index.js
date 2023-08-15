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
  /*logEvent(analytics, 'app_open');//log firebase*/

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  var db = window.sqlitePlugin.openDatabase({
    name: "dosemanager.db",
    location: "default",
  });

  db.transaction(function (transaction) {
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS ProfileTable (Profile_id INTEGER PRIMARY KEY, Name TEXT, DateOfBirth DATE);",
      [],
      function (tx, results) {
        console.log("ProfileTable created successfully");
      },
      function (error) {
        console.log("Error occurred while creating the table.");
      }
    );

    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS MedicationTable (Medication_id INTEGER PRIMARY KEY, Profile_id INTEGER, MedicationName TEXT, Description TEXT, Frequency TEXT, Dosage TEXT, FOREIGN KEY(Profile_id) REFERENCES ProfileTable(Profile_id));",
      [],
      function (tx, results) {
        console.log("MedicationTable created successfully");
      },
      function (error) {
        console.log("Error occurred while creating the table.");
      }
    );

    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS AppointmentTable (Appointment_id INTEGER PRIMARY KEY, Profile_id INTEGER, AppointmentDate DATE, DoctorName TEXT, AppointmentLocation TEXT, FOREIGN KEY(Profile_id) REFERENCES ProfileTable(Profile_id));",
      [],
      function (tx, results) {
        console.log("AppointmentTable created successfully");
      },
      function (error) {
        console.log("Error occurred while creating the table.");
      }
    );

    //inserting test data
    transaction.executeSql(
      "INSERT INTO MedicationTable (MedicationName, Description) VALUES ('Medication 1', 'Some medicine description goes here'),('Medication 2', 'ANOTHER LONG TEXT')",
      [],
      function (tx, results) {
        console.log("Data added!");
      },
      function (error) {
        console.log("Error occurred while adding data.");
      }
    );
  });

  //document.getElementById("deviceready").classList.add("ready");
}
