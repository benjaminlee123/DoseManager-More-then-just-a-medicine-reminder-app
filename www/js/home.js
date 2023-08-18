document.addEventListener("deviceready", function () {
  //connecting to db
  /*var db = window.sqlitePlugin.openDatabase({
    name: "dosemanager.db",
    location: "default",
  });*/
  console.log("home.js");
  // Query to retrieve medication data
  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM MedicationTable;",
      [],
      function (tx, result) {
        var data = result.rows; // The retrieved data
        displayMedsCard(data); //function to load data dynamically in html
      },
      function (error) {
        console.log("Unable to retrieve data!");
      }
    );
  });
});

function displayMedsCard(data) {
  var medicationList = document.getElementById("medication-list");

  // Clear previous content
  medicationList.innerHTML = "";

  // Loop through the retrieved data and create medication cards
  for (var i = 0; i < data.length; i++) {
    var row = data.item(i); // Get the i-th row
    var medicationCard = `
        <div id = "card" class="card mt-4 rounded-5">
            <div class="card-body">
                <h5 class="card-title ">${row.MedicationName}</h5>
                <p id="med-desc" class="card-text">${row.Description}</p>
                <div id="dosage-amt" class="border border-success rounded-circle">
                  <p class="text-center">1 pill twice a day</p>
                </div>
            </div>
        </div>
    `;
    medicationList.innerHTML += medicationCard;
  }
}

function addMeds() {
  console.log("Add medication!");
}
