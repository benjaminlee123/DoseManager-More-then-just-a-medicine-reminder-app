const profileButton = document.querySelector(".btn-danger");
profileButton.addEventListener("click", () => {
  window.location.href = "personalinfo.html";
});

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
  var profileName = firestore.collection("Profiles");

  //referencing h2 id for name
  var name = document.getElementById("profileName");

  profileName
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var data = doc.data();
        var nameHTML = `<h2 id="profileName" class="text-center card-title">${data.Name}</h2>`;
        name.innerHTML += nameHTML;
        //console.log(data);
      });
    })
    .catch(function (error) {
      console.error("Error getting profiles documents: ", error);
    });
}
