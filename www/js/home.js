document.addEventListener("deviceready", displayData);

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

  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  profile = getProfileIdFromURL();
  console.log(profile);

  var addMedsButton = document.getElementById("addMedBtn");
  var medicationFooterButton = document.getElementById("medication-footer");
  var appointmentFooterButton = document.getElementById("appointment-footer");
  var profileFooterButton = document.getElementById("profile-footer");

  addMedsButton.addEventListener("click", handleAddMedsButtonClick);
  medicationFooterButton.addEventListener("click", handleMedFooterButtonClick);
  appointmentFooterButton.addEventListener(
    "click",
    handleApptFooterButtonClick
  );
  profileFooterButton.addEventListener("click", handleProfileFooterButtonClick);

  function handleAddMedsButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `addmeds.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleMedFooterButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleApptFooterButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleProfileFooterButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `profile.html?id=${profile.id}&pic=${profile.pic}`;
  }

  var mainProfileId = profile.id;
  var mainProfileRef = firestore.collection("Profiles").doc(mainProfileId);
  var subCollectionRef = mainProfileRef.collection("Medicine");

  mainProfileRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var userData = doc.data();
        var userName = userData.name;

        var userProfileName = document.getElementById("userProfileName");
        userProfileName.textContent = "Welcome, " + userName;
      } else {
        console.log("User document not found");
      }
    })
    .catch(function (error) {
      console.error("Error getting user document: ", error);
    });

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
            <div id="dosage-amt" class="rounded">
              <p class="text-center">Dosage: ${subDocData.amount} ${subDocData.type} ${subDocData.frequency}</p>
            </div>
          </div>
        </div>
        <br>
        <div>
          <button class="editButton" data-item-id="${subDoc.id}">Edit</button>
          <button class="deleteButton" data-item-id="${subDoc.id}">Delete</button>
        </div>
      `;
        medicationList.innerHTML += medicationCard;

        //referencing edit button of each medicine
        var editButtons = document.getElementsByClassName("editButton");

        //array of edit buttons
        Array.from(editButtons).forEach(function (button) {
          button.addEventListener("click", handleEditButtonClick);
        });

        //function to handle the edit button of each medicine
        function handleEditButtonClick(event) {
          var itemId = event.target.getAttribute("data-item-id");

          if (itemId) {
            window.location.href = `editmeds.html?id=${profile.id}&pic=${profile.pic}&medId=${itemId}`;
          } else {
            console.log("Item ID not found in the button");
          }
        }
        //referencing delete button of each medicine
        var deleteButton = document.getElementsByClassName("deleteButton");

        //array of delete buttons
        Array.from(deleteButton).forEach(function (button) {
          button.addEventListener("click", handleDeleteButtonClick);
        });
      });
    })
    .catch(function (error) {
      console.error("Error deleting medicine documents: ", error);
    });

  //function to handle the delete button of each medicine
  function handleDeleteButtonClick(event) {
    var itemId = event.target.getAttribute("data-item-id");
    console.log(itemId);
    if (itemId) {
      if (confirm("Are you sure you want to delete this Medicine?")) {
        // Delete the document from Firestore
        subCollectionRef
          .doc(itemId)
          .delete()
          .then(function () {
            console.log("Item deleted successfully");
            window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
          })
          .catch(function (error) {
            console.log("Error deleting item:", error);
          });
      }
    }
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
