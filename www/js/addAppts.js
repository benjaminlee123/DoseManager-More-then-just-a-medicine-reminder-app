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

  //getting referenece for form DOM element
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
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Add the profile to the Firestore collection
    apptsCollection
      .add(newAppts)
      .then((docRef) => {
        console.log("Appointment added with ID: ", docRef.id);
      })
      .then(() => {
        //navigate to home.html after submit button pressed
        window.location.href = "upcomingappt.html";
      })
      .catch((error) => {
        console.error("Error adding appointment: ", error);
      });
  });
}