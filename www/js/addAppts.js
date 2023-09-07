document.addEventListener("deviceready", addAppts);

function addAppts() {
  //firebase config
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
  var apptsCollection = firestore.collection("Appointments");

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

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields by their IDs
    var apptLocationInput = document.getElementById("apptLocation");
    var apptDateTimeInput = document.getElementById("apptDateTime");
    var docNameInput = document.getElementById("docName");

    // Retrieve the values from the input fields
    var apptLocation = apptLocationInput.value;
    var apptDateTime = apptDateTimeInput.value;
    var docName = docNameInput.value;

    var newAppts = {
      apptLocation: apptLocation,
      apptDateTime: apptDateTime,
      docName: docName,
    };

    // Retrieve the values from the reminder time input field
    /*var reminderTimeInput = document.getElementById("reminderTime");
    var reminderTime = parseInt(reminderTimeInput.value, 10);*/

    mainCollectionRef
      .collection(subcollectionName)
      .add(newAppts)
      .then((docRef) => {
        console.log("Document added to subcollection with ID: ", docRef.id);

        // Schedule the local notification using the new library function
        //scheduleNewNotification(apptLocation, apptDateTime, reminderTime);
      })
      .then(() => {
        //navigate to home.html after submit button pressed
        window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
      })
      .catch((error) => {
        console.error("Error adding appointment: ", error);
      });
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
