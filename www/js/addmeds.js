// Checks for cordova deviceready before calling functions
document.addEventListener("deviceready", addMeds);

function addMeds() {
   // Request notification permissions
   requestNotificationPermission(function (granted) {
    if (granted) {
      console.log("Notification permission granted.");
    } else {
      console.log("User did not grant permission for notifications.");
      var confirmResponse = window.confirm("Notifications are disabled. Would you like to enable them in the settings?");
      if (confirmResponse) {
        cordova.plugins.diagnostic.switchToSettings(function () {
          console.log("Successfully opened settings");
        }, function (error) {
          console.error("The following error occurred: " + error);
        });
      }
    }
  });
  var profilesCollection = firestore.collection("Profiles");

  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }
// Cancel icon button
var cancelIconButton = document.getElementById("cancelIcon");

cancelIconButton.addEventListener("click", handleCancelIconButtonClick);
  

function handleCancelIconButtonClick() {
    var profile = getProfileIdFromURL();
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  var profile = getProfileIdFromURL();
  
  console.log(profile);
  const mainCollectionDocID = profile.id;
  const profilesCollectionRef = profilesCollection.doc(mainCollectionDocID);
  const subcollectionName = "Medicine";

  // Getting reference for form element
  var form = document.getElementById("formData");

  form.addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the input fields by their IDs
    var medNameInput = document.getElementById("medName");
    var medDescInput = document.getElementById("medDesc");
    var medTypeInput = document.getElementById("type");
    var medAmtInput = document.getElementById("medAmt");
    var medMealInput = document.getElementById("mealType");
    var medReminderInput = document.getElementById("medTime");
    var medFrequencyInput = document.getElementById("frequency");

    // Retrieve the values from the input fields
    var medName = medNameInput.value;
    var medDesc = medDescInput.value;
    var medType = medTypeInput.value;
    var mealType = medMealInput.value;
    var medAmt = medAmtInput.value;
    var medReminder = medReminderInput.value;
    var medFrequency = medFrequencyInput.value;

    if (!medName || !medDesc || !medType || !mealType || !medAmt || !medReminder || !medFrequency) {
        alert('Please fill out all fields before submitting.');
        return;
    }

    // Object to store details of med
    var newMeds = {
        name: medName,
        description: medDesc,
        type: medType,
        amount: medAmt,
        meal: mealType,
        reminderTime: medReminder,
        frequency: medFrequency,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const userName = await getUserName(mainCollectionDocID, firestore);
    // Get startHour, interval, days, and dosage from the form
    let startHour = medReminder;
    //let startHour = new Date(medReminder).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    let interval = getIntervalBasedOnFrequency(medFrequency);
    let days = 30; // You might need to adjust this based on your needs
    let dosage = medAmt;
       
        
         
    // Add medicine to Firestore collection
    profilesCollectionRef
        .collection(subcollectionName)
        .add(newMeds)
        .then(async (docRef) => {
            console.log("Medicine added to profile with ID: ", docRef.id);

             // Schedule the medication reminder notification
        let notifId=scheduleMedicineNotification(startHour, interval, days, dosage,docRef.id,mainCollectionDocID,userName);

             // Update the medicine document with the notificationId
             await docRef.update({ notificationId: notifId });
            // Assuming you want to create logs based on frequency
            var date = new Date();
            if (newMeds.frequency === "Everyday") {
                // Logs for the next 7 days
                for (let i = 0; i < 7; i++) {
                    date.setDate(date.getDate() + 1); // Advance a day
                    docRef.collection("DailyLogs").add({
                        date: new Date(date),
                        status: "pending"
                    });
                }
            } else if (newMeds.frequency === "Every Week") {
                // Logs for the next 9 weeks
                for (let i = 0; i < 9; i++) {
                    date.setDate(date.getDate() + 7); // Advance a week
                    docRef.collection("DailyLogs").add({
                        date: new Date(date),
                        status: "pending"
                    });
                }
            } else if (newMeds.frequency === "Every Month") {
                // Logs for the next 6 months
                for (let i = 0; i < 6; i++) {
                    date.setMonth(date.getMonth() + 1); // Advance a month
                    docRef.collection("DailyLogs").add({
                        date: new Date(date),
                        status: "pending"
                    });
                }
            }
    

            // Navigate to home.html after the submit button is pressed
            var profile = getProfileIdFromURL();
            window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
        })
        .catch((error) => {
            console.error("Error adding profile: ", error);
        });
});

// Function to determine the interval for the notification based on the frequency
function getIntervalBasedOnFrequency(frequency) {
    if (frequency === "Everyday") {
        return 24 * 60; // 24 hours in minutes
    } else if (frequency === "Every Week") {
        return 7 * 24 * 60; // 7 days * 24 hours in minutes
    } else if (frequency === "Every Month") {
        return 30 * 24 * 60; // approx. 30 days * 24 hours in minutes
    }
    return 24 * 60; // default to everyday
}
}

function keyPress() {
  // Getting reference to input box
  //dataList.innerHTML = '';  // Clear the existing options
  var dataList = document.getElementById("medList");

  // Search term
  var input = medName.value;

  // Calling API function
  fetchAutocompleteResults(input).then((data) => {
    if (data) {
      // Result array
      var medResult = data[1];

      // Add each value as suggestions to input box
      medResult.forEach((medicine) => {
        const option = document.createElement("option");
        option.value = medicine;
        dataList.appendChild(option);
      });
    }
  });
}

// API call to NLM database
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

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
