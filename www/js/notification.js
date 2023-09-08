document.addEventListener("deviceready", function() {
    // This part is moved to addAppts function in addappt.js
}, false);

// Function to request notification permission
function requestNotificationPermission(callback) {
    cordova.plugins.notification.local.requestPermission(function(granted) {
        if (granted) {
            callback(true);
        } else {
            cordova.plugins.notification.local.requestPermission(function(granted) {
                callback(granted);
            });
        }
    });
}

function scheduleNewNotification(apptLocation, apptDateTime, reminderTime) {
    const reminderTimeInMs = reminderTime * 60 * 1000;
    const apptTimeInMs = new Date(apptDateTime).getTime();
    const notifTimeInMs = apptTimeInMs - reminderTimeInMs;

    if (typeof cordova !== 'undefined' && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
        cordova.plugins.notification.local.schedule({
            id: 1,
            title: "New Appointment Reminder",
            text: `You have an appointment at ${apptLocation} in ${reminderTime} minutes.`,
            trigger: { at: new Date(notifTimeInMs) }
        });
    } else {
        console.error('Cordova local notification plugin is not available.');
    }
}
