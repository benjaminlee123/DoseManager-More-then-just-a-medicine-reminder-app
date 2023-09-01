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
  var medsCollection = firestore.collection("Medicine");

 
  //retrieving data from firebase
  medsCollection
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var data = doc.data();

        //populating html page with each medicine card details
        var medicationCard = `
        <div id="card" class="card mt-4 rounded-5">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p id="med-desc" class="card-text">${data.description}</p>
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