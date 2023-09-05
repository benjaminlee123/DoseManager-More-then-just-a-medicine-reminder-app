//checks for cordova deviceready before calling functions
document.addEventListener("deviceready", addMeds);

//function to add medicine into DB
function addMeds() {
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

  function getProfileIdFromURL(){
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  };

  var profileId = getProfileIdFromURL();
  console.log(profileId);
  const profilesCollectionDocID = profileId;
  const profilesCollectionRef = firestore.collection("ProfilesTesting").doc(profilesCollectionDocID);
  const subcollectionName = "Medicine"
  
  var backHomeButton = document.getElementById("backHomeButton");

  backHomeButton.addEventListener("click", handleBackHomeButtonClick);
  function handleBackHomeButtonClick(){
    var profileId = getProfileIdFromURL();
    console.log(profileId);
    window.location.href = `home.html?id=${profileId}`;
  }
  
  //getting reference for form element
  var form = document.getElementById("formData");

  form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    //Get the values of the input fields by their IDs
    var medNameInput = document.getElementById("medName");
    var medDescInput = document.getElementById("medDesc");

    //Retrieve the values from the input fields
    var medName = medNameInput.value;
    var medDesc = medDescInput.value;

    //object to store details of med
    var newMeds = {
      name: medName,
      description: medDesc,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Add medicine to Firestore collection
    profilesCollectionRef.collection(subcollectionName).add(newMeds)
      .then((docRef) => {
        console.log("Medicine added to profile with ID: ", docRef.id);
      })
      .then(() => {
        //navigate to home.html after submit button pressed
        window.location.href = `home.html?id=${profileId}`;
      })
      .catch((error) => {
        console.error("Error adding profile: ", error);
      });
  });
}

function keyPress() {
  //getting reference to input box
  var dataList = document.getElementById("medList");

  //search term
  var input = medName.value;

  //calling api function
  fetchAutocompleteResults(input).then((data) => {
    if (data) {
      //result array
      var medResult = data[1];

      //add each value as suggestions to input boxs
      medResult.forEach((medicine) => {
        const option = document.createElement("option");
        option.value = medicine;
        dataList.appendChild(option);
      });
    }
  });
}

//api call to NLM database
async function fetchAutocompleteResults(searchTerm) {
  const apiUrl = `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(
    searchTerm
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching autocomplete results:", error);
    return null;
  }
}



// document.addEventListener('DOMContentLoaded', function() {
//     const cameraButton = document.getElementById('cameraButton');
//     const cameraContainer = document.getElementById('cameraContainer');

//     // Function to handle camera button click
//     cameraButton.addEventListener('click', function() {
//         openCamera();
//     });

//     // Function to open the camera
//     function openCamera() {
//         // Check if getUserMedia is supported by the browser
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             navigator.mediaDevices.getUserMedia({ video: true })
//             .then(function(stream) {
//                 // Create a video element to display the camera feed
//                 const video = document.createElement('video');
//                 video.srcObject = stream;
//                 video.play();
//                 // Append the video element to the cameraContainer
//                 cameraContainer.innerHTML = ''; // Clear any previous content
//                 cameraContainer.appendChild(video);
//             })
//             .catch(function(error) {
//                 console.error('Error accessing camera:', error);
//             });
//         } else {
//             console.error('getUserMedia is not supported by this browser.');
//         }
//     }
// });





document.addEventListener('DOMContentLoaded', function() {
    const cameraButton = document.getElementById('cameraButton');
    const uploadButton = document.querySelector('button[type="button"]');
    const cameraContainer = document.getElementById('cameraContainer');
    const imageUpload = document.getElementById('imageUpload');

    let stream; // To store the camera stream

    // Function to handle camera button click
    cameraButton.addEventListener('click', function() {
        openCamera();
    });

    // Function to handle upload button click
    uploadButton.addEventListener('click', function() {
        captureAndUpload();
    });

    // Function to open the camera
    function openCamera() {
        // Check if getUserMedia is supported by the browser
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream; // Store the camera stream
                // Create a video element to display the camera feed
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
                // Append the video element to the cameraContainer
                cameraContainer.innerHTML = ''; // Clear any previous content
                cameraContainer.appendChild(video);
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
            });
        } else {
            console.error('getUserMedia is not supported by this browser.');
        }
    }

    // Function to capture and upload the photo
    function captureAndUpload() {
        if (stream && imageUpload && imageUpload.files && imageUpload.files.length > 0) {
            const photoBlob = new Blob([imageUpload.files[0]], { type: 'image/jpeg' });
            // You can use the 'photoBlob' for further processing (e.g., upload to server)
            console.log('Photo captured:', photoBlob);
        } else {
            console.error('No photo captured or camera stream not available.');
        }
    }
});
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
