const closeButton = document.querySelector(".close");

closeButton.addEventListener("click", () => {
  window.location.href = "home.html";
});

const profileButton = document.querySelector(".btn-danger");

profileButton.addEventListener("click", () => {
  window.location.href = "personalinfo.html";
});

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
  profileName.get();
};







  

