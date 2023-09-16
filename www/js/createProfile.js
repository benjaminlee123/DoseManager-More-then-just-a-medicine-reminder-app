document.addEventListener("deviceready", addProfile);

function addProfile() {
  // Firebase config

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
    // Validate the input fields
    if (!firstName || !lastName || !gender || !dob) {
      alert("All fields must be filled out!");
      return; // Exit the function if any field is empty
    }
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
// Get reference to the Back buttons
var backToProfileLoginBtn = document.getElementById("backToProfileLoginBtn");

// Add click event listeners to the Back buttons
backToProfileLoginBtn.addEventListener("click", function() {
  window.location.href = "profilelogin.html";
});
}