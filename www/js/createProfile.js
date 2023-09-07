document.addEventListener("deviceready", addProfile);

function addProfile() {
  // Firebase config
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

  // Reference to the "ProfileTable" collection
  var profilesCollection = firestore.collection("Profiles");

  // Get reference to the form DOM element
  var form = document.getElementById("profileForm");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get values from the input fields by their IDs
    var firstNameInput = document.getElementById("firstName");
    var lastNameInput = document.getElementById("lastName");
    var genderInput = document.getElementById("gender");
    var dobInput = document.getElementById("dob");

    // Retrieve values from the input fields
    var firstName = firstNameInput.value;
    var lastName = lastNameInput.value;
    var gender = genderInput.value;
    var dob = dobInput.value;

    // Create a new profile object
    var newProfile = {
      name: firstName + " " + lastName,
      dateOfBirth: dob,
      gender: gender,
      firstName: firstName,
      lastName: lastName,
      // You can add other fields like gender here if needed
    };

    // Add the profile to the Firestore collection
    profilesCollection
      .add(newProfile)
      .then((docRef) => {
        console.log("Profile added with Profile_id: ", docRef.id);
      })
      .then(() => {
        window.location.href = "profilelogin.html";
      })
      .catch((error) => {
        console.error("Error adding profile: ", error);
      });
  });
}
