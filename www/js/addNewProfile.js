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
  var profilesCollection = firestore.collection("ProfilesTesting");

  var form = document.getElementById("formData");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields by their IDs
    var nameInput = document.getElementById("name");
    var dateOfBirthInput = document.getElementById("birthDate");
    var genderInput = document.getElementById("gender");

    // Retrieve the values from the input fields
    var name = nameInput.value;
    var dateOfBirth = dateOfBirthInput.value;
    var gender = genderInput.value;

    var newProfile = {
        name: name,
        dateOfBirth: dateOfBirth,
        gender: gender,
    };

    // Add the profile to the Firestore collection
    profilesCollection
      .add(newProfile)
      .then((docRef) => {
        console.log("Profile added with ID: ", docRef.id);
      })
      .then(() => {
        //navigate to home.html after submit button pressed
        window.location.href = "profilelogin.html";
      })
      .catch((error) => {
        console.error("Error adding appointment: ", error);
      });
  });
  }