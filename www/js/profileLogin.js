document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var profileList = document.getElementById("profile-list");

  // Clear previous content
  profileList.innerHTML = "";

  //create a new div row
  var currentRow = createNewRow(profileList);

  //firebase config
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
            <div class="col">
              <div class = "profile">
                <a class="profileIcon" href="home.html?id=${id}&pic=${i}">
                  <img id="profileImg" src="img/profile-${i}.jpg" alt="profile image">
                </a>
                <p id="profile-name" class="text-center fw-bold">${profName}</p>
              </div>  
            </div>         
        `;

        i++;

        //reset profile pic counter if more than 5
        if (i == 6) {
          i = 1;
        }

        //add profile to row
        currentRow.innerHTML += profileCard;

        //checks if there is 2 profiles in a row
        if (currentRow.childElementCount == 2) {
          currentRow = createNewRow(profileList);
        }

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

function createNewRow(profileList) {
  // Create a new row div
  var currentRow = document.createElement("div");
  //give it classname "row"
  currentRow.className = "row";

  var result = profileList.appendChild(currentRow);
  return result;
}