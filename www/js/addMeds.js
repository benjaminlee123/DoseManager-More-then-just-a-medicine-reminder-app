document.addEventListener("deviceready", function () {
  const submitButton = document.querySelector("button");
  function addMeds() {
    const medicineName = document.getElementById("medName").value;
    const description = document.getElementById("medDesc").value;

    //connecting to db
    var db = window.sqlitePlugin.openDatabase({
      name: "dosemanager.db",
      location: "default",
    });

    // Query to add medication data
    db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO MedicationTable (MedicationName, Description) VALUES (?,?)",
        [medicineName, description],
        function (tx, result) {
          console.log("Added medicine to database!");
        },
        function (error) {
          console.log("Unable to add Medicine!", error);
        }
      );
    });
  }
  submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    addMeds(); // Call the addMeds function to insert data
  });
});
