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
  var apptsCollection = firestore.collection("Appointments");

  //retrieving data from firebase by timestamp
  //orderBy("apptDateTime") ensures the data is displaying the earliest appt first
  apptsCollection
    .orderBy("apptDateTime")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var data = doc.data();
        var apptDateTime = data.apptDateTime;
        var currentDateTime = new Date().toJSON();
        var id = doc.id;
        formattedDate = formatDate(apptDateTime);

        console.log(id);  
        if(apptDateTime > currentDateTime){
        //populating html page with each appointment card details
        var apptCard = `
        <div id = "upcomingAppt" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title ">${data.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${formattedDate}</p>
                <p id="docName" class="card-text">${data.docName}</p>
            </div>
            <button class="edit-button btn btn-primary" data-item-id="${doc.id}">Edit</button>
        </div>
        `;
        //Add to the upcoming appointment counter to be displayed at the top of the page  
        upcomingAppts ++;

        } else if (apptDateTime < currentDateTime) {
        //populating html page with each appointment card details
        var apptCard = `
        <div id = "missedAppt" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title" id="apptLocation">${data.apptLocation}</h5>
                <p id="apptDateTime" class="card-text">${data.apptDateTime}</p>
                <p id="docName" class="card-text">${data.docName}</p>
            </div>
            <button class="edit-button btn btn-primary" data-item-id="${doc.id}">Edit</button>
        </div>
        `;

        //Add to the missed appointment counter to be displayed at the top of the page
        missedAppts ++;
        };

        apptList.innerHTML += apptCard;
        updateUpcomingApptsHtml(upcomingAppts);
        updateMissedApptsHtml(missedAppts);

        var editButtons = document.getElementsByClassName("edit-button");
        Array.from(editButtons).forEach(function(button){
          button.addEventListener("click", handleEditButtonClick);
        })

        
        function handleEditButtonClick(event){
          var itemId = event.target.getAttribute("data-item-id");
        
          if(itemId){
            window.location.href = `editAppt.html?id=${itemId}`;
          }else{
            console.log("Item ID not found in the button");
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
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(inputDate).toLocaleDateString('en-US', options);
    }
}