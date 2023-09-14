document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var medicationList = document.getElementById("medication-list");

  // Clear previous content
  medicationList.innerHTML = "";
  //var medsCollection = firestore.collection("Medicine");

  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  profile = getProfileIdFromURL();
  console.log(profile);

  //eventlisteners for each button with profile id passed in
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

  function handleAddMedsButtonClick(event) {
    var profile = getProfileIdFromURL();
    window.location.href = `addmeds.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleMedFooterButtonClick() {
    var profile = getProfileIdFromURL();
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleApptFooterButtonClick() {
    var profile = getProfileIdFromURL();
    window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
  }

  function handleProfileFooterButtonClick() {
    var profile = getProfileIdFromURL();
    window.location.href = `profile.html?id=${profile.id}&pic=${profile.pic}`;
  }

  //getting the profile id of the document
  var mainProfileId = profile.id;
  var mainProfileRef = firestore.collection("Profiles").doc(mainProfileId);

  //Medicine collection
  var subCollectionRef = mainProfileRef.collection("Medicine");

  mainProfileRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var userData = doc.data();
        var userName = userData.name;

        var userProfileName = document.getElementById("userProfileName");
        userProfileName.textContent = userName;
      } else {
        console.log("User document not found");
      }
    })
    .catch(function (error) {
      console.error("Error getting user document: ", error);
    });

  //retrieving data from firebase
  subCollectionRef
    .orderBy("timestamp")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (subDoc) {
        var subDocData = subDoc.data();
        //populating html page with each medicine card details
        var medicationCard = `
        <div id="card" class="card mt-4 rounded-5 border border-secondary-subtle" data-item-id="${subDoc.id}">
          <div class="card-body">
            <h5 class="card-title fw-bold">${subDocData.name}</h5>
            <p class="fw-bold">${subDocData.amount} ${subDocData.type} ${subDocData.frequency}</p>
            <p class="fw-bold">${subDocData.meal}</p>
            <p id="med-desc" class="card-text">${subDocData.description}</p>
          </div>
        </div>
        <div class="pb-2">
          <button id="editBtn" class="editButton btn btn-primary" data-item-id="${subDoc.id}">Edit</button>
          <button id="logBtn" class="logButton btn btn-info" data-item-id="${subDoc.id}">View Log</button> 
        </div>
      `;
        medicationList.innerHTML += medicationCard;

        //referencing edit button of each medicine
        var editButtons = document.getElementsByClassName("editButton");
        console.log(editButtons);
        //array of edit buttons
        Array.from(editButtons).forEach(function (button) {
          button.addEventListener("click", handleEditButtonClick);
        });
        // referencing view log button of each medicine
        var logButtons = document.getElementsByClassName("logButton");
        Array.from(logButtons).forEach(function(button) {
            button.addEventListener("click", handleLogButtonClick);
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
        // function to handle the view log button of each medicine
        function handleLogButtonClick(event) {
          var itemId = event.target.getAttribute("data-item-id");
          if (itemId) {
              window.location.href = `medslog.html?id=${profile.id}&pic=${profile.pic}&medId=${itemId}`;
          } else {
              console.log("Item ID not found in the button");
          }
        }
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