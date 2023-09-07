document.addEventListener("deviceready", editProfile);

function editProfile() {
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

  function getProfileItemIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  var profileId = getProfileItemIdFromURL();
  console.log(profileId);

  const mainCollectionDocID = profileId;
  const mainCollectionRef = firestore.collection("ProfilesTesting").doc(mainCollectionDocID);

  var firstNameInput = document.getElementById("firstName");
  var lastNameInput = document.getElementById("lastName");
  var genderInput = document.getElementById("gender");
  var dateOfBirthInput = document.getElementById("dob");
  var saveButton = document.getElementById("saveBtn");
  
  mainCollectionRef.get().then(function(doc){
    if(doc.exists){
        var itemData = doc.data();
        firstNameInput.value = itemData.firstName;
        lastNameInput.value = itemData.lastName;
        dateOfBirthInput.value = itemData.dateOfBirth;
        genderInput.value = itemData.gender;
    } else {
        console.log("Profile not found");
    }
  }).catch(function(error){
    console.log("Error retrieving item: ", error);
  })


  var form = document.getElementById("profileForm");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  });

  saveButton.addEventListener("click", function(){
    var newFirstNameInput = firstNameInput.value
    var newLastNameInput = lastNameInput.value
    var newGenderInput = genderInput.value
    var newDobInput = dateOfBirthInput.value

    mainCollectionRef.update({
      name: newFirstNameInput + " " + newLastNameInput,
      dateOfBirth: newDobInput,
      gender: newGenderInput,
      firstName: newFirstNameInput,
      lastName: newLastNameInput,
    }).then(function(){
      console.log("Profile Updated Successfully");
      window.location.href = `profile.html?id=${profileId}`;
    }).catch(function(error){
      console.log("Error updating profile:", error);
    })

  })
}