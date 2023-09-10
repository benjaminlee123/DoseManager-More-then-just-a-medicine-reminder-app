document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var profileList = document.getElementById("profile-list");
  //var displayedProfiles = document.getElementById("profiles");

  // Clear previous content
  profileList.innerHTML = "";

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
  var profilesCollection = firestore.collection("Profiles");

  //retrieving data from firebase by timestamp
  //orderBy("apptDateTime") ensures the data is displaying the earliest appt first
  profilesCollection
    .get()
    .then(function (querySnapshot) {
      //to cycle between the different profile images
      var i = 1;
      //firebase query
      querySnapshot.forEach(function (doc) {
        var data = doc.data();
        var id = doc.id;
        var profName = data.name;

        console.log(id);
        console.log(profName);

        var profileCard = `
        <div class="profile-card">
            <a class="profileIcon" href="home.html?id=${id}&pic=${i}">
                <img id="profileImg" src="img/profile-${i}.jpg" alt="profile image">
            </a>
            <p class="text-center fw-bold">${profName}</p>
        </div>
    `;

        i++;
        if (i == 6) {
          i = 1;
        }
        profileList.innerHTML += profileCard;

        // Get all elements with the class "profileIcon"
        var profileIcons = document.querySelectorAll(".profileIcon");

        // Add a click event listener to each profileIcon
        profileIcons.forEach(function (icon) {
          icon.addEventListener("click", handleProfileButtonClick);
        });

        var profileButtons = document.getElementsByClassName("profile-button");
        Array.from(profileButtons).forEach(function (button) {
          button.addEventListener("click", handleProfileButtonClick);
        });

        function handleProfileButtonClick(event) {
          var itemId = event.target.getAttribute("data-item-id");

          if (itemId) {
            window.location.href = `home.html?id=${itemId}`;
          } else {
            console.log("Item ID not found in the button");
          }
        }
      });
    })
    .catch(function (error) {
      console.error("Error getting appointment documents: ", error);
    });
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
