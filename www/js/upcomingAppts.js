document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var apptList = document.getElementById("appt-list");
  var upcomingAppts = 0;
  var missedAppts = 0;

  // Clear previous content
  apptList.innerHTML = "";

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
  //var apptsCollection = firestore.collection("Appointments");

  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  profile = getProfileIdFromURL();
  console.log(profile);

  var addApptsButton = document.getElementById("addApptBtn");
  var medicationFooterButton = document.getElementById("medication-footer");
  var appointmentFooterButton = document.getElementById("appointment-footer");
  var profileFooterButton = document.getElementById("profile-footer");

  addApptsButton.addEventListener("click", handleAddApptsButtonClick);
  medicationFooterButton.addEventListener("click", handleMedFooterButtonClick);
  appointmentFooterButton.addEventListener(
    "click",
    handleApptFooterButtonClick
  );
  profileFooterButton.addEventListener("click", handleProfileFooterButtonClick);

  function handleAddApptsButtonClick() {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `addNewAppt.html?id=${profile.id}&pic=${profile.pic}`;
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
  var subCollectionRef = mainProfileRef.collection("Appointments");

  //retrieving data from firebase by timestamp
  //orderBy("apptDateTime") ensures the data is displaying the earliest appt first
  subCollectionRef
    .orderBy("apptDateTime")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (subDoc) {
        var subDocData = subDoc.data();
        var profile = getProfileIdFromURL();
        var apptDateTime = subDocData.apptDateTime;
        var currentDateTime = new Date().toJSON();
        var id = subDoc.id;
        var formattedDate = formatDate(apptDateTime);

        console.log(id);
        console.log(profile);
        if (apptDateTime > currentDateTime) {
          //populating html page with each appointment card details
          var apptCard = `
        <div id = "upcomingAppt" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title ">${subDocData.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${formattedDate}</p>
                <p id="docName" class="card-text">${subDocData.docName}</p>
            </div>
            <button class="edit-button btn btn-primary" data-item-id="${subDoc.id}" data-item-pic="${profile.pic}">Edit</button>
        </div>
        `;
          //Add to the upcoming appointment counter to be displayed at the top of the page
          upcomingAppts++;
        } else if (apptDateTime < currentDateTime) {
          //populating html page with each appointment card details
          var apptCard = `
        <div id = "missedAppt" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title" id="apptLocation">${subDocData.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${formattedDate}</p>
                <p id="docName" class="card-text">${subDocData.docName}</p>
            </div>
            <button class="edit-button btn btn-primary" data-item-id="${subDoc.id}" data-item-pic="${profile.pic}">Edit</button>
        </div>
        `;

          //Add to the missed appointment counter to be displayed at the top of the page
          missedAppts++;
          console.log("missed: ", subDoc.id);
        }

        apptList.innerHTML += apptCard;
        updateUpcomingApptsHtml(upcomingAppts);
        updateMissedApptsHtml(missedAppts);

        var editButtons = document.getElementsByClassName("edit-button");
        Array.from(editButtons).forEach(function (button) {
          button.addEventListener("click", handleEditButtonClick);
        });

        function handleEditButtonClick(event) {
          var itemId = event.target.getAttribute("data-item-id");
          var picID = event.target.getAttribute("data-item-pic");
          if (itemId && picID) {
            window.location.href = `editAppt.html?id=${profile.id}&apptId=${itemId}&pic=${picID}`;
          } else {
            //console.log("Item ID not found in the button");
            console.log(itemId);
          }
        }
      });
    })
    .catch(function (error) {
      console.error("Error getting appointment documents: ", error);
    });

  function updateUpcomingApptsHtml(upcomingAppts) {
    var totalUpcomingAppts = document.getElementById("upcoming-appts");
    totalUpcomingAppts.textContent = upcomingAppts;
  }

  function updateMissedApptsHtml(missedAppts) {
    var totalMissedAppts = document.getElementById("missed-appts");
    totalMissedAppts.textContent = missedAppts;
  }

  function formatDate(inputDate) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(inputDate).toLocaleDateString("en-US", options);
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
