document.addEventListener("deviceready", function () {
  console.log("this is from addMeds.js");
  const submitButton = document.getElementById("submitBtn");

  submitButton.addEventListener("click", addMeds);
});

function addMeds() {
  const medicineName = document.getElementById("medName").value;
  const description = document.getElementById("medDesc").value;

  //connecting to db
  var db = window.sqlitePlugin.openDatabase({
    name: "dosemanager.db",
    location: "default",
  });
  console.log("addMeds()");
  // Query to add medication data
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO MedicationTable (MedicationName, Description) VALUES (?,?)",
      [medicineName, description],
      function (tx, result) {
        console.log("Added medicine to database!");
        //window.location.href = "home.html";
      },
      function (error) {
        console.log("Unable to add Medicine!", error);
      }
    );
  });
}
