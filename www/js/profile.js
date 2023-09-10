document.addEventListener("deviceready", username);

function username() {
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

  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  profile = getProfileIdFromURL();
  console.log(profile);

  var profileImg = document.getElementById("profile-pic");
  var cancelIconButton = document.getElementById("cancelIcon");
  var personalInfoButton = document.getElementById("profile-personalInfo");
  var notifButton = document.getElementById("profile-notifications");
  var profApptButton = document.getElementById("profile-appointments");
  var languageButton = document.getElementById("profile-language");
  var deleteProfileButton = document.getElementById("delete-profile");

  //displaying the profile pic
  profileImg.innerHTML += `<img id="profileImg" src="img/profile-${profile.pic}.jpg" alt="profile image">`;

  cancelIconButton.addEventListener("click", handleCancelIconButtonClick);
  personalInfoButton.addEventListener("click", handlePersonalInfoButtonClick);
  notifButton.addEventListener("click", handleNotifButtonButtonClick);
  profApptButton.addEventListener("click", handleProfApptButtonButtonClick);
  languageButton.addEventListener("click", handlelanguageButtonButtonClick);
  deleteProfileButton.addEventListener("click", handleDeleteProfileButtonClick);

  function handleCancelIconButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handlePersonalInfoButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `personalinfo.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleNotifButtonButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `notifications.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleProfApptButtonButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handlelanguageButtonButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `languagesetting.html?id=${profile.id}&pic=${profile.pic}`;
  }
  function handleDeleteProfileButtonClick() {
    var confirmation = window.confirm("Do you want to delete this profile?");
    if (confirmation) {
      var profile = getProfileIdFromURL();
      firestore
        .collection("Profiles")
        .doc(profile.id)
        .delete()
        .then(() => {
          console.log("Profile successfully deleted!");
          window.location.href = "profilelogin.html";
        })
        .catch((error) => {
          console.error("Error removing profile: ", error);
        });
    }
  }

  var mainProfileId = profile.id;
  var mainProfileRef = firestore.collection("Profiles").doc(mainProfileId);

  mainProfileRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var userData = doc.data();
        var userName = userData.name;

        var userProfileName = document.getElementById("profileName");
        userProfileName.textContent = userName;
      } else {
        console.log("User document not found");
      }
    })
    .catch(function (error) {
      console.error("Error getting user document: ", error);
    });
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
