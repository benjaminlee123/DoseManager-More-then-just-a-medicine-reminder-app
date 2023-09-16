document.addEventListener("deviceready", function() {
    console.log("Device ready event fired!");
      function getProfileIdFromURL() {
        var urlParams = new URLSearchParams(window.location.search);
            return {
                id: urlParams.get("id"),
                pic: urlParams.get("pic")
            };
        } 
    
        var profile = getProfileIdFromURL(); 
        var userId = profile.id;  
    // Get profile ID from URL
        
         // Initialize action buttons for notifications
         cordova.plugins.notification.local.addActions('appointment-actions', [
            { id: 'confirm', title: 'Confirm'},
            { id: 'skip', title: 'Skip' }
        ]);
        
        cordova.plugins.notification.local.addActions('medicine-actions', [
            { id: 'taken', title: 'Taken' },
            { id: 'skipping', title: 'Skip' }
        ]);
        
        // Handle appointment actions
        cordova.plugins.notification.local.on('confirm', function(notification) {
            
            // Handle "Yes" action here
            console.log('Confirm action triggered with:', notification);
            // You can add logic to update Firestore as well
             // Remove the appointment from the Appointments collection
             const firestoreDocumentId = notification.data.firestoreDocumentId;
            removeAppointment(firestoreDocumentId, userId);
    
        });
        
        cordova.plugins.notification.local.on('skip', function(notification) {
            console.log('Skip action triggered with:', notification);
            // Move the skipped appointment to MissedNotifications collection
            const firestoreDocumentId = notification.data.firestoreDocumentId;
            markAppointmentAsMissed(firestoreDocumentId, userId);
          });
    
        // Handle medicine actions
        cordova.plugins.notification.local.on('taken', function(notification) {
        // Logic to mark medicine as taken
         // Logic to mark medicine as taken based on userId
         // Retrieve Firestore document ID from notification data
        const firestoreDocumentId = notification.data.firestoreDocumentId;
         markMedicineAsTaken(firestoreDocumentId, userId);
         

        });
        cordova.plugins.notification.local.on('skipping', function(notification) {
            console.log('Skip action triggered with:', notification);
            
            const firestoreDocumentId = notification.data.firestoreDocumentId;
            markMedicineAsMissed(firestoreDocumentId, userId);
        
            // Fetch the frequency of the medicine from Firestore
            const medRef = firebase.firestore().collection("Profiles").doc(userId).collection("Medicine").doc(firestoreDocumentId.id);
            
            medRef.get().then((doc) => {
                if (doc.exists) {
                    const medicineData = doc.data();
                    const frequency = medicineData.frequency; 
                    handleMedicineReminderTriggered(firestoreDocumentId.id, userId, frequency);
                } else {
                    console.log("No such medicine in Firestore!");
                }
            }).catch((error) => {
                console.log("Error getting medicine:", error);
            });
        });
        
    
    
    }, false);
    
    function removeAppointment(notificationId, userId) {
        console.log("removeAppointment called with:", notificationId, userId);
        const apptRef = firebase.firestore()
            .collection("Profiles")
            .doc(userId)
            .collection("Appointments")
            .doc(notificationId);
        apptRef.delete();
    }
    
    function markAppointmentAsMissed(appointmentId, userId) {
        const apptRef = firebase.firestore()
          .collection("Profiles")
          .doc(userId)
          .collection("Appointments")
          .doc(appointmentId);
      
        const missedRef = firebase.firestore()
          .collection("Profiles")
          .doc(userId)
          .collection("MissedNotifications")
          .doc("Appointments");
      
        // Fetch existing appointment data
        apptRef.get().then((doc) => {
            if (doc.exists) {
              const appointmentData = doc.data();
               // Update the status of the appointment to "missed"
              apptRef.update({ status: "missed" }).then(() => {
                  console.log("Appointment status updated to missed.");
    
                // Create a new document in MissedNotifications collection
                missedRef.set({
                  [appointmentId]: appointmentData
                }, { merge: true })
                .then(() => {
                  // Do something after setting missed notification
                });
              });
            } else {
              console.log("No such appointment!");
            }
          }).catch((error) => {
            console.log("Error getting appointment:", error);
          });
    }
    
    // Function to request notification permission
    function requestNotificationPermission(callback) {
        cordova.plugins.notification.local.hasPermission(function(granted) {
            if (granted) {
                callback(true);
            } else {
                cordova.plugins.notification.local.setDummyNotifications(); // For Android 13 only
                cordova.plugins.notification.local.requestPermission(function(granted) {
                    callback(granted);
                });
            }
        });
    }
    function generateUniqueNotificationId() {
        return new Date().getTime();
    }
    
    //Function to retrieve the userName in the profile
    function getUserName(userId, firestore) {
      const mainProfileRef = firestore.collection("Profiles").doc(userId);
    
      return mainProfileRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            const userData = doc.data();
            return userData.name;
          } else {
            return null; // User document not found
          }
        })
        .catch(function (error) {
          console.error("Error getting user document: ", error);
          return null;
        });
    }
    
    function scheduleAppointmentNotification(apptLocation, apptDateTime, reminderTime, appointmentId, userId, userName) {
        return new Promise((resolve, reject) => {
            const reminderTimeInMs = reminderTime * 60 * 1000;
            const apptTimeInMs = new Date(apptDateTime).getTime();
            const currentTimeInMs = new Date().getTime();
            const notifTimeInMs = apptTimeInMs - reminderTimeInMs;
            const notifId = generateUniqueNotificationId(); // Generate a unique ID for this notification
    
            // Check if the appointment time has already passed
            if (apptTimeInMs < currentTimeInMs) {
                reject("You cannot set a reminder for an appointment that has already passed.");
                return;
            }
    
            // Check if the current time is too close to the appointment time
            if (notifTimeInMs < currentTimeInMs) {
                var confirmResponse = window.confirm("The appointment time is too close for the reminder. Would you like to adjust the reminder to the closest possible time?");
    
                if (confirmResponse) {
                    reminderTimeInMs = apptTimeInMs - currentTimeInMs - 1;
                } else {
                    reject("User chose not to adjust the reminder time.");
                    return;
                }
            }
    
            // Schedule the notification if the Cordova plugin is available
            if (typeof cordova !== 'undefined' && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
                cordova.plugins.notification.local.schedule({
                    id: notifId,
                    title: "New Appointment Reminder",
                    text: `${userName}, You have an appointment at ${apptLocation} in ${reminderTime} minutes.`,
                    actions: 'appointment-actions',
                    data: { firestoreDocumentId: appointmentId },
                            trigger: { at: new Date(notifTimeInMs) },
                    foreground: true

                });
    
                const apptRef = firebase.firestore()
                    .collection("Profiles")
                    .doc(userId)
                    .collection("Appointments")
                    .doc(appointmentId);
    
                apptRef.update({ notificationId: notifId })
                    .then(() => {
                        resolve(true); // Resolve the promise when the notification is scheduled and Firestore is updated
                    })
                    .catch((error) => {
                        console.error("Error updating notificationId in Firestore:", error);
                        reject(error);
                    });
            } else {
                reject('Cordova local notification plugin is not available.');
            }
        });
    }
    
    function scheduleMedicineNotification(startHour, interval, days, dosage,medicineId,userId,userName) {
        let today = new Date();
        let startTime = new Date(`${today.toDateString()} ${startHour}`);
        
        const notifId = generateUniqueNotificationId();
    
        // Log the values for debugging
        console.log("Start Time:", startTime);
        console.log("Interval:", interval);
        console.log("Days:", days);
        console.log("Dosage:", dosage);
    
        cordova.plugins.notification.local.schedule({
            id: notifId,
            title: 'Medicine Reminder',
            text: `${userName},It's time to take your ${dosage} dosage.`,
            actions: 'medicine-actions',
            data: { firestoreDocumentId:medicineId},
            trigger: {
                every: {
                    hour: startTime.getHours(),
                    minute: startTime.getMinutes()
                }
            },
            foreground: true
        });
    
        console.log("Medicine notification scheduled.");
        return notifId;  // Returning the generated notifId
    }
    
    
    
    function markMedicineAsMissed(medicineId, userId) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log("markMedicineAsMissed - Date for Query:", today);
    
        const medRef = firebase.firestore().collection("Profiles").doc(userId).collection("Medicine").doc(medicineId);
        const missedRef = firebase.firestore().collection("Profiles").doc(userId).collection("MissedNotifications").doc("Medicine");
    
        medRef.get().then((doc) => {
            if (doc.exists) {
                const medicineData = doc.data();
                
                // Update the DailyLogs to mark it as missed
                medRef.collection("DailyLogs").where("date", ">=", today).get().then(snapshot => {
                    console.log("markMedicineAsMissed - DailyLogs fetched:", snapshot.docs.length);
                    snapshot.forEach(doc => {
                        console.log("Updating DailyLog with missed status for medicineId:", medicineId);
                        doc.ref.update({
                            status: "missed"
                        });
                    });
                });
        
                // Move to MissedNotifications collection
                missedRef.set({
                    [medicineId]: medicineData
                }, { merge: true }).then(() => {
                    // Keep the original medicine entry (commented the delete for now)
                    // medRef.delete();
                });
            } else {
                console.log("No such medicine!");
            }
        }).catch((error) => {
            console.log("Error getting medicine:", error);
        });
    }
    
    function markMedicineAsTaken(medicineId, userId) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log("markMedicineAsTaken - Date for Query:", today);
    
        const medRef = firebase.firestore().collection("Profiles").doc(userId).collection("Medicine").doc(medicineId);
    
        medRef.get().then((doc) => {
            if (doc.exists) {
                // Update the DailyLogs to mark it as taken
                medRef.collection("DailyLogs").where("date", ">=", today).get().then(snapshot => {
                    console.log("markMedicineAsTaken - DailyLogs fetched:", snapshot.docs.length);
                    snapshot.forEach(doc => {
                        console.log("Updating DailyLog with taken status for medicineId:", medicineId);
                        doc.ref.update({
                            status: "taken"
                        });
                    });
                });
            } else {
                console.log("No such medicine!");
            }
        }).catch((error) => {
            console.log("Error getting medicine:", error);
        });
    }
    