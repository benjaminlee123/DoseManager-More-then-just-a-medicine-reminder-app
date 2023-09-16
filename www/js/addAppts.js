document.addEventListener("deviceready", addAppts);

async function addAppts() {
  // Request notification permission when the addAppts function is called
  requestNotificationPermission(function (granted) {
    if (granted) {
      console.log("Notification permission granted.");
    } else {
      console.log("User did not grant permission for notifications.");
      // Prompt the user to enable notifications
      var confirmResponse = window.confirm("Notifications are disabled. Would you like to enable them in the settings?");
      if (confirmResponse) {
        cordova.plugins.diagnostic.switchToSettings(function () {
          console.log("Successfully opened settings");
        }, function (error) {
          console.error("The following error occurred: " + error);
        });
      }
    }
  });

    

  function getProfileItemIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  var profile = getProfileItemIdFromURL();
  console.log(profile);

  const mainCollectionDocID = profile.id;
  const mainCollectionRef = firestore
    .collection("Profiles")
    .doc(mainCollectionDocID);
  const subcollectionName = "Appointments";

  var backButton = document.getElementById("back-button");

  //getting reference for form DOM element
  var form = document.getElementById("formData");

  form.addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Retrieve the values from the input fields
    var apptLocation = document.getElementById("apptLocation").value;
    var apptDateTime = document.getElementById("apptDateTime").value;
    var docName = document.getElementById("docName").value;
    var reminderTime = parseInt(document.getElementById("reminderTime").value, 10);
   // Check if any of the fields are empty
   if (!apptLocation || !apptDateTime || !docName || isNaN(reminderTime)) {
    window.alert("Please fill out all fields and provide a valid reminder time.");
    return; // Exit the function
  }
    // Check if the appointment time has already passed
    const apptTimeInMs = new Date(apptDateTime).getTime();
    const currentTimeInMs = new Date().getTime();
    if (apptTimeInMs < currentTimeInMs) {
      window.alert("You cannot set an appointment for a date and time that has already passed.");
      return; // Exit the function
    }
  
    var newAppts = {
      apptLocation: apptLocation,
      apptDateTime: apptDateTime,
      docName: docName,
    };
  
    try {

       // Add the appointment to Firestore
       const userName= await getUserName(mainCollectionDocID, firestore); // new
       const docRef = await mainCollectionRef.collection(subcollectionName).add(newAppts);

      // Schedule the local notification and await its completion
      await scheduleAppointmentNotification(apptLocation, apptDateTime, reminderTime, docRef.id, mainCollectionDocID,userName);
  
     
      console.log("Document added to subcollection with ID: ", docRef.id);
  
      // Navigate to home.html after the submit button is pressed
      window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
    } catch (error) {
        if (error === "User chose not to adjust the reminder time.") {
          window.alert("Appointment created without a reminder.");
          window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
        } else {
            console.error("Error: ", error);
        }
        }
  });
  
  
  backButton.addEventListener("click", function () {
    window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
  });
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}