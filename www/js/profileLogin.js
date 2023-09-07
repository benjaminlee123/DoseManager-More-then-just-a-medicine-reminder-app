document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var profileList = document.getElementById("profile-list");
  //var displayedProfiles = document.getElementById("profiles");

  // Clear previous content
  profileList.innerHTML = "";
  //displayedProfiles.innerHTML = "";

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
  var profilesCollection = firestore.collection("ProfilesTesting");

  //retrieving data from firebase by timestamp
  profilesCollection
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var data = doc.data();
        var id = doc.id;
        var profName = data.name;

        console.log(id);  
        console.log(profName);
        var profCard = `
        <div id = "profiles">
            <button class="profile-button btn btn-primary" data-item-id="${doc.id}">${data.name}</button>
        </div>
        `;

        profileList.innerHTML += profCard;

        var profileButtons = document.getElementsByClassName("profile-button");
        Array.from(profileButtons).forEach(function(button){
          button.addEventListener("click", handleProfileButtonClick);
        })

        
        function handleProfileButtonClick(event){
          var itemId = event.target.getAttribute("data-item-id");
        
          if(itemId){
            window.location.href = `home.html?id=${itemId}`;
          }else{
            console.log("Item ID not found in the button");
          }
        }
      });
    })
    .catch(function (error) {
      console.error("Error getting appointment documents: ", error);
    });
}