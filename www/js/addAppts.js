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
  //var apptsCollection = firestore.collection("Appointments");

  function getProfileItemIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  var profileId = getProfileItemIdFromURL();
  console.log(profileId);

  const mainCollectionDocID = profileId;
  const mainCollectionRef = firestore.collection("ProfilesTesting").doc(mainCollectionDocID);
  const subcollectionName = "Appointments";

  var backButton = document.getElementById("back-button");

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
    };

    mainCollectionRef.collection(subcollectionName).add(newAppts)
    .then((docRef) => {
      console.log("Document added to subcollection with ID: ", docRef.id);
    })
    .then(() => {
      //navigate to home.html after submit button pressed
      window.location.href = `upcomingappt.html?id=${profileId}`;
    })
    .catch((error) => {
      console.error("Error adding appointment: ", error);
    });
  })

  backButton.addEventListener("click", function(){
    window.location.href = `upcomingappt.html?id=${profileId}`;
  })
}
