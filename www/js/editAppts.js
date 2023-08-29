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

  firebase.initializeApp(firebaseConfig);
  var firestore = firebase.firestore();
  var apptsCollection = firestore.collection("Appointments");


  function getEditItemIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  var editItemId = getEditItemIdFromURL();

  var itemDocRef = apptsCollection.doc(editItemId);   
  console.log(itemDocRef);

  var apptLocationInput = document.getElementById("editApptLocation");
  var apptDateTimeInput = document.getElementById("editApptDateTime");
  var docNameInput = document.getElementById("editDocName");
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

  var editForm = document.getElementById("editData");

  editForm.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

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
          window.location.href = "upcomingappt.html";
  
      }).catch(function(error){
          console.log("Error updating item:", error);
      })
    })
  });
};