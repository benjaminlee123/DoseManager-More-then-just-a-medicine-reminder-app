

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
  




document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("Cordova device is ready!");

 
}
function loadDB() {

  //data you want to add in
  const newMeds = {
    name: "APPOINTMENT",
    description: "A NEW APPOINTMENT ",
  };

  // Add the profile to the Firestore collection
  firestore
    .collection("Appointments")
    .add(newMeds)
    .then((docRef) => {
      console.log("Profile added with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding profile: ", error);
    });
}

function retrieveMeds() {
  //  DoseMAanager's Firebase configuration
  var medsCollection = firestore.collection("Medicine");

  medsCollection
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() contains the document's data
        console.log("Medicine ID:", doc.id);
        console.log("Medicine Data:", doc.data());
      });
    })
    .catch(function (error) {
      console.error("Error getting medicine documents: ", error);
    });
}