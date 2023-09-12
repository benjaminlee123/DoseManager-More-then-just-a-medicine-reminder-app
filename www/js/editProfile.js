document.addEventListener("deviceready", editProfile);

function editProfile() {
  //firebase config

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

  var firstNameInput = document.getElementById("firstName");
  var lastNameInput = document.getElementById("lastName");
  var genderInput = document.getElementById("gender");
  var dateOfBirthInput = document.getElementById("dob");
  var saveButton = document.getElementById("saveBtn");

  mainCollectionRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var itemData = doc.data();
        firstNameInput.value = itemData.firstName;
        lastNameInput.value = itemData.lastName;
        dateOfBirthInput.value = itemData.dateOfBirth;
        genderInput.value = itemData.gender;
      } else {
        console.log("Profile not found");
      }
    })
    .catch(function (error) {
      console.log("Error retrieving item: ", error);
    });

  var form = document.getElementById("profileForm");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  });

  saveButton.addEventListener("click", function () {
    var newFirstNameInput = firstNameInput.value;
    var newLastNameInput = lastNameInput.value;
    var newGenderInput = genderInput.value;
    var newDobInput = dateOfBirthInput.value;

    mainCollectionRef
      .update({
        name: newFirstNameInput + " " + newLastNameInput,
        dateOfBirth: newDobInput,
        gender: newGenderInput,
        firstName: newFirstNameInput,
        lastName: newLastNameInput,
      })
      .then(function () {
        console.log("Profile Updated Successfully");
        window.location.href = `profile.html?id=${profile.id}&pic=${profile.pic}`;
      })
      .catch(function (error) {
        console.log("Error updating profile:", error);
      });
  });
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}