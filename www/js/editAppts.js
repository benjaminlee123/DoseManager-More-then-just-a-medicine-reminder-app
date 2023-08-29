document.addEventListener("deviceready", editAppts);

function editAppts() {
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

  var firestore = firebase.firestore();
  var apptsCollection = firestore.collection("Appointments");


  function getEditItemIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  var editItemId = getEditItemIdFromURL();

  var itemDocRef = apptsCollection.doc(editItemId);   

  var apptLocationInput = document.getElementById("apptLocation");
  var apptDateTimeInput = document.getElementById("apptDateTime");
  var docNameInput = document.getElementById("docName");
  var updateButton = document.getElementById("update-button");
  
  itemDocRef.get().then(function(doc){
    if(doc.exists){
        var itemData = doc.data();
        apptLocationInput.value = itemData.apptLocation;
        apptDateTimeInput.value = itemData.apptDateTime;
        docNameInput.value = itemData.docName;
    } else {
        console.log("Item not found");
    }
  }).catch(function(error){
    console.log("Error retrieving item: ", error);
  })

  updateButton.addEventListener("click", function(){
    var newApptLocation = apptLocationInput.value;
    var newApptDateTime = apptDateTimeInput.value;
    var newDocName = docNameInput.value;

    itemDocRef.update({
        apptLocation: newApptLocation,
        apptDateTime: newApptDateTime,
        docName: newDocName
    }).then(function(){
        console.log("Item Updated Successfully");
        
        window.location.href("upcomingappt.html");

    }).catch(function(error){
        console.log("Error updating item:", error);
    })
  })
};