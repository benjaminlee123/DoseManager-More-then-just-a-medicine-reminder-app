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

  function getParametersFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var profileId = urlParams.get("id");
    var apptId = urlParams.get("apptId");
    
    return { profileId, apptId };
  }
  
  var { profileId, apptId } = getParametersFromURL();
  
  console.log("profId:", profileId);
  console.log("apptId:", apptId);

  const mainCollectionDocID = profileId;
  const mainCollectionRef = firestore.collection("ProfilesTesting").doc(mainCollectionDocID);
  const subcollectionName = "Appointments";
  const subcollectionRef = mainCollectionRef.collection(subcollectionName).doc(apptId);

  var apptLocationInput = document.getElementById("editApptLocation");
  var apptDateTimeInput = document.getElementById("editApptDateTime");
  var docNameInput = document.getElementById("editDocName");
  var updateButton = document.getElementById("update-button");
  var deleteButton = document.getElementById("delete-button");
  var backButton = document.getElementById("back-button");
  

  subcollectionRef.get().then(function(doc){
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
  });

  updateButton.addEventListener("click", function(){
    var newApptLocation = apptLocationInput.value;
    var newApptDateTime = apptDateTimeInput.value;
    var newDocName = docNameInput.value;

    subcollectionRef.update({
        apptLocation: newApptLocation,
        apptDateTime: newApptDateTime,
        docName: newDocName
    }).then(function(){
        console.log("Item Updated Successfully");
        window.location.href = `upcomingappt.html?id=${profileId}`;

    }).catch(function(error){
        console.log("Error updating item:", error);
    })
  })

  deleteButton.addEventListener("click", function() {
    if (confirm("Are you sure you want to delete this appointment?")) {
      // Delete the document from Firestore
      subcollectionRef.delete().then(function() {
          console.log("Item deleted successfully");
          window.location.href = `upcomingappt.html?id=${profileId}`;
      }).catch(function(error) {
          console.log("Error deleting item:", error);
      });
    }
  });

  backButton.addEventListener("click", function(){
    window.location.href = `upcomingappt.html?id=${profileId}`;
  })
};
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}