document.addEventListener("deviceready", addMeds);

function addMeds() {
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
  var medsCollection = firestore.collection("Medicine");

  //getting referenece for form DOM element
  var form = document.getElementById("formData");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields by their IDs
    var medNameInput = document.getElementById("medName");
    var medDescInput = document.getElementById("medDesc");

    // Retrieve the values from the input fields
    var medName = medNameInput.value;
    var medDesc = medDescInput.value;

    var newMeds = { name: medName, description: medDesc };

    // Add the profile to the Firestore collection
    medsCollection
      .add(newMeds)
      .then((docRef) => {
        console.log("Profile added with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding profile: ", error);
      });

    //console.log("Medicine Name: " + medName);
    //console.log("Medicine Description: " + medDesc);
  });
}
