document.addEventListener("deviceready", displayData);

function displayData() {
  //getting reference for div id
  var apptList = document.getElementById("appt-list");

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
  var apptsCollection = firestore.collection("Appointments");
  
  //retrieving data from firebase by timestamp
  //orderBy("timestamp") ensures the data is retrieved in chronological order
  apptsCollection
    .orderBy("timestamp")
    .get()
    .then(function (querySnapshot) {
      var totalAppts = querySnapshot.size; //Gets the total number of documents
      updateHtml(totalAppts);
      querySnapshot.forEach(function (doc) {
        var data = doc.data();

        //populating html page with each appointment card details
        var apptCard = `
        <div id = "card" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title ">${data.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${data.apptDateTime}</p>
                <p id="docName" class="card-text">${data.docName}</p>
            </div>
        </div>
    `;
        apptList.innerHTML += apptCard;
      });
    })
    .catch(function (error) {
      console.error("Error getting appointment documents: ", error);
    });

    function updateHtml(total) {
      var totalAppts = document.getElementById("upcoming-appts");
      totalAppts.textContent = total;
    }
}