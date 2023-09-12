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
            { id: 'skip', title: 'Skip' }
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
         markMedicineAsTaken(notification.id, userId);
        });
    
        cordova.plugins.notification.local.on('skip', function(notification) {
        // Logic to mark medicine as missed
        markMedicineAsMissed(notification.id, userId);
        });
    }, false);
    
    function removeAppointment(notificationId,userId) {
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
              
              // Create a new document in MissedNotifications collection
              missedRef.set({
                [appointmentId]: appointmentData
              }, { merge: true })
              .then(() => {
                // Delete the original appointment
                apptRef.delete();
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
    
    function scheduleMedicineNotification(startHour, interval, days, dosage) {
        let today = new Date();
        let startTime = new Date(`${today.toDateString()} ${startHour}`);
        let startTimeInMs = startTime.getTime();
      
        for (let day = 0; day < days; day++) {
            for (let time = startTimeInMs; time <= startTimeInMs + (12 * 60 * 60 * 1000); time += (interval * 60 * 1000)) {
                let notificationTime = new Date(time + day * 24 * 60 * 60 * 1000);
                cordova.plugins.notification.local.schedule({
                    id: time,
                    title: 'Medicine Reminder',
                    text: `It's time to take your ${dosage} dosage.`,
                    actions: 'medicine-actions',
                    trigger: { at: notificationTime },
                    foreground: true
                });
            }
        }
    }