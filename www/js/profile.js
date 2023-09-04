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
    return urlParams.get("id");
  }

  profileId = getProfileIdFromURL();
  console.log(profileId);

  var cancelIconButton = document.getElementById("cancelIcon");
  var personalInfoButton = document.getElementById("profile-personalInfo");
  var notifButton = document.getElementById("profile-notifications");
  var profApptButton = document.getElementById("profile-appointments");
  var languageButton = document.getElementById("profile-language");

  cancelIconButton.addEventListener("click", handleCancelIconButtonClick);
  personalInfoButton.addEventListener("click", handlePersonalInfoButtonClick);
  notifButton.addEventListener("click", handleNotifButtonButtonClick);
  profApptButton.addEventListener("click", handleProfApptButtonButtonClick);
  languageButton.addEventListener("click", handlelanguageButtonButtonClick);

  function handleCancelIconButtonClick() {
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `home.html?id=${profileId}`;
  }

  function handlePersonalInfoButtonClick() {
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `personalinfo.html?id=${profileId}`;
  }

  function handleNotifButtonButtonClick() {
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `notifications.html?id=${profileId}`;
  }

  function handleProfApptButtonButtonClick() {
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `upcomingappt.html?id=${profileId}`;
  }

  function handlelanguageButtonButtonClick() {
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `languagesetting.html?id=${profileId}`;
  }

  var mainProfileId = profileId;
  var mainProfileRef = firestore
    .collection("ProfilesTesting")
    .doc(mainProfileId);

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
