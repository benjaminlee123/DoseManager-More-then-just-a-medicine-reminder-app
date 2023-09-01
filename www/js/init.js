// Global variable to store the database connection
var db;
console.log('onDeviceReady function called');
document.addEventListener('deviceready', onDeviceReady, false);

// Function to be called when the deviceready event is fired
function onDeviceReady() {
    console.log('onDeviceReady function called'); 

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    db = window.sqlitePlugin.openDatabase({name: 'dosemanager.db', location: 'default'});//open connection

    db.transaction(function(transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS ProfileTable (Profile_id INTEGER PRIMARY KEY, Name TEXT, DateOfBirth DATE);', [], function(tx, results) {
            console.log('ProfileTable created successfully');
        }, function(error) {
            console.log('Error occurred while creating the table.');
        });

        transaction.executeSql('CREATE TABLE IF NOT EXISTS MedicationTable (Medication_id INTEGER PRIMARY KEY, Profile_id INTEGER, MedicationName TEXT, Description TEXT, Frequency TEXT, Dosage TEXT, FOREIGN KEY(Profile_id) REFERENCES ProfileTable(Profile_id));', [], function(tx, results) {
            console.log('MedicationTable created successfully');
        }, function(error) {
            console.log('Error occurred while creating the table.');
        });

        transaction.executeSql('CREATE TABLE IF NOT EXISTS AppointmentTable (Appointment_id INTEGER PRIMARY KEY, Profile_id INTEGER, AppointmentDate DATE, DoctorName TEXT, AppointmentLocation TEXT, FOREIGN KEY(Profile_id) REFERENCES ProfileTable(Profile_id));', [], function(tx, results) {
            console.log('AppointmentTable created successfully');
        }, function(error) {
            console.log('Error occurred while creating the table.');
        });

      
    });

}