document.addEventListener('deviceready',displayData);

function displayData() {
  //getting reference for div id
  var medicationList = document.getElementById("medication-list");

  // Clear previous content
  medicationList.innerHTML = "";
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
  //var medsCollection = firestore.collection("Medicine");

  function getProfileIdFromURL(){
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  };

  profileId = getProfileIdFromURL();
  console.log(profileId);

  var addMedsButton = document.getElementById("addMedBtn");
  var medicationFooterButton = document.getElementById("medication-footer");
  var appointmentFooterButton = document.getElementById("appointment-footer");
  var profileFooterButton = document.getElementById("profile-footer");
  
  addMedsButton.addEventListener("click", handleAddMedsButtonClick);
  medicationFooterButton.addEventListener("click", handleMedFooterButtonClick);
  appointmentFooterButton.addEventListener("click", handleApptFooterButtonClick);
  profileFooterButton.addEventListener("click", handleProfileFooterButtonClick);

  function handleAddMedsButtonClick(){
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `addmeds.html?id=${profileId}`;
  }

  function handleMedFooterButtonClick(){
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `home.html?id=${profileId}`;
  }

  function handleApptFooterButtonClick(){
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `upcomingappt.html?id=${profileId}`;
  }

  function handleProfileFooterButtonClick(){
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `profile.html?id=${profileId}`;
  }
 
  var mainProfileId = profileId;
  var mainProfileRef = firestore.collection("ProfilesTesting").doc(mainProfileId);
  var subCollectionRef = mainProfileRef.collection("Medicine");

  mainProfileRef
    .get()
    .then(function(doc){
        if(doc.exists){
            var userData = doc.data();
            var userName = userData.name;

            var userProfileName = document.getElementById("userProfileName");
            userProfileName.textContent = "Welcome, " + userName;
        } else {
            console.log("User document not found");
        }
    }).catch(function(error){
        console.error("Error getting user document: ", error);
    })

  //retrieving data from firebase
  subCollectionRef
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (subDoc) {
        var subDocData = subDoc.data();

        //populating html page with each medicine card details
        var medicationCard = `
        <div id="card" class="card mt-4 rounded-5">
          <div class="card-body">
            <h5 class="card-title">${subDocData.name}</h5>
            <p id="med-desc" class="card-text">${subDocData.description}</p>
            <div id="dosage-amt" class="border border-success rounded-circle">
              <p class="text-center">1 pill twice a day</p>
            </div>
          </div>
        </div>
      `;
        medicationList.innerHTML += medicationCard;

        // doc.data() contains the document's data
        //console.log("Medicine ID:", doc.id);
        //console.log("Medicine Data:", doc.data());
      });
    })
    .catch(function (error) {
      console.error("Error getting medicine documents: ", error);
    });
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}