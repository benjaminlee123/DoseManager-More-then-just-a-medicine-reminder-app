document.addEventListener("deviceready", editMeds);

function editMeds() {

  //getting data passed from url
  function getParametersFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var profile = {};
    profile.id = urlParams.get("id");
    profile.pic = urlParams.get("pic");

    var medId = urlParams.get("medId");
    return { profile, medId };
  }

  var { profile, medId } = getParametersFromURL();

  console.log("profId:", profile.id);
  console.log("medId:", medId);

  //cancel icon button
  var cancelIconButton = document.getElementById("cancelIcon");

  cancelIconButton.addEventListener("click", handleCancelIconButtonClick);

  function handleCancelIconButtonClick() {
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  //selecting the collections
  const mainCollectionDocID = profile.id;
  const mainCollectionRef = firestore
    .collection("Profiles")
    .doc(mainCollectionDocID);
  const subcollectionName = "Medicine";
  const subcollectionRef = mainCollectionRef
    .collection(subcollectionName)
    .doc(medId);

  //getting input elements
  var medNameInput = document.getElementById("medName");
  var medDescInput = document.getElementById("medDesc");
  var medTypeInput = document.getElementById("type");
  var medAmtInput = document.getElementById("medAmt");
  var medMealInput = document.getElementById("mealType");
  var medReminderInput = document.getElementById("medTime");
  var medFrequencyInput = document.getElementById("frequency");

  //retrieving the existing medicine information
  subcollectionRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var itemData = doc.data();
        medNameInput.value = itemData.name;
        medDescInput.value = itemData.description;
        medTypeInput.value = itemData.type;
        medAmtInput.value = itemData.amount;
        medMealInput.value = itemData.meal;
        medReminderInput.value = itemData.reminderTime;
        medFrequencyInput.value = itemData.frequency;
      } else {
        console.log("Item not found");
      }
    })
    .catch(function (error) {
      console.log("Error retrieving item: ", error);
    });

  var editForm = document.getElementById("formData");
  editForm.addEventListener("click", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  });

  //save button
  var saveBtn = document.getElementById("saveBtn");

  //updating medicine information
  saveBtn.addEventListener("click", function () {
    //getting the updated input values
    var newMedNameInput = medNameInput.value;
    var newMedDescInput = medDescInput.value;
    var newMedTypeInput = medTypeInput.value;
    var newMedAmtInput = medAmtInput.value;
    var newMedMealInput = medMealInput.value;
    var newMedReminderInput = medReminderInput.value;
    var newMedFrequencyInput = medFrequencyInput.value;

    subcollectionRef
      .update({
        name: newMedNameInput,
        description: newMedDescInput,
        type: newMedTypeInput,
        meal: newMedMealInput,
        amount: newMedAmtInput,
        reminderTime: newMedReminderInput,
        frequency: newMedFrequencyInput,
      })
      .then(function () {
        console.log("Item Updated Successfully");
        window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
      })
      .catch(function (error) {
        console.log("Error updating item:", error);
      });
  });

  //delete button
  var deleteButton = document.getElementById("delBtn");

  deleteButton.addEventListener("click", handleDeleteButtonClick);

  //function to handle the delete button of each medicine
  function handleDeleteButtonClick() {
    if (confirm("Are you sure you want to delete this appointment?")) {
      // Delete the document from Firestore
      subcollectionRef
        .delete()
        .then(function () {
          console.log("Item deleted successfully");
          window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
        })
        .catch(function (error) {
          console.log("Error deleting item:", error);
        });
    }
  }
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

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}