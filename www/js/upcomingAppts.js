document.addEventListener("deviceready", function () {
    //connecting to the db
    var db = window.sqlitePlugin.openDatabase({
      name: "dosemanager.db",
      location: "default",
    });
  
    // Query to retrieve appointments data
    db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM AppointmentTable;",
        [],
        function (tx, result) {
          var apptsData = result.rows; // The retrieved data
          displayApptsCard(apptsData);
        },
        function (error) {
          console.log("Unable to retrieve data!");
        }
      );
    });
  });

function displayApptsCard(apptsData) {
var apptsList = document.getElementById("appts-list");

// Clear previous content
apptsList.innerHTML = "";

// Loop through the retrieved data and create appointment cards
for (var i = 0; i < apptsData.length; i++) {
    var row = apptsData.item(i); // Get the i-th row
    var apptsCard = `
        <div id = "card" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title" id="appt-location">${row.AppointmentLocation}</h5>
                <p id="doc-name" class="card-text">${row.DoctorName}</p>
                <div id="dosage-amt" class="border border-success">
                <p class="text-center">${row.AppointmentDate}</p>
                </div>
            </div>
        </div>
    `;
    apptsList.innerHTML += apptsCard;
}
}

function addAppts() {
    console.log("Add New Appointment!");
}