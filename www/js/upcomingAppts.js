document.addEventListener("deviceready", displayData);

function displayData() {
  var apptList = document.getElementById("appt-list");
  var upcomingAppts = 0;
  var missedAppts = 0;
  apptList.innerHTML = "";

  var profile = getProfileIdFromURL();
  var mainProfileRef = firestore.collection("Profiles").doc(profile.id);
  var subCollectionRef = mainProfileRef.collection("Appointments");

  subCollectionRef
    .orderBy("apptDateTime")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (subDoc) {
        var status = determineAppointmentStatus(subDoc, subCollectionRef);
        if (status === "upcoming") upcomingAppts++;
        else missedAppts++;

        var apptCard = renderAppointmentCard(subDoc, status);
        apptList.innerHTML += apptCard;
      });

      updateAppointmentCounts(upcomingAppts, missedAppts);
      attachEventListeners(subCollectionRef);
    })
    .catch(function (error) {
      console.error("Error getting appointment documents: ", error);
    });

  setupNavigationButtons(profile);
}

function getProfileIdFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return {
    id: urlParams.get("id"),
    pic: urlParams.get("pic"),
  };
}

function determineAppointmentStatus(subDoc, subCollectionRef) {
  var subDocData = subDoc.data();
  var apptDateTime = new Date(subDocData.apptDateTime);
  var currentDateTime = new Date();

  if (subDocData.status === "upcoming" && apptDateTime < currentDateTime) {
    subCollectionRef.doc(subDoc.id).update({ status: "missed" });
    return "missed";
  }

  return subDocData.status;
}

function renderAppointmentCard(subDoc, status) {
  var subDocData = subDoc.data();
  var formattedDate = formatDate(new Date(subDocData.apptDateTime));

  if (status === "upcoming") {
    return `
            <div id="upcomingAppt" class="card mt-4 rounded-5">
                <div class="card-body">
                    <h5 class="card-title">${subDocData.apptLocation}</h5>
                    <p id="apptDateTime" class="card-text fw-bold">${formattedDate}</p>
                    <p id="docName" class="card-text fw-bold">${subDocData.docName}</p>
                    <p id="apptStatus">Appointment Status:</p>
                    <p id="upcoming">Upcoming</p> 
                    <div>
                        <button class="edit-button btn btn-primary" data-item-id="${subDoc.id}">Edit</button>
                    </div>
                </div>
                
            </div>`;
  } else {
    return `
            <div id="missedAppt" class="card mt-4 rounded-5">
                <div class="card-body">
                    <h5 class="card-title">${subDocData.apptLocation}</h5>
                    <p id="apptDateTime" class="card-text fw-bold">${formattedDate}</p>
                    <p id="docName" class="card-text fw-bold">${subDocData.docName}</p>
                    <p id="apptStatus">Appointment Status:</p> 
                    <p id="missed">Missed</p> 
                    <div>
                        <button class="btn btn-danger deleteButton" data-item-id="${subDoc.id}">Delete</button>
                    </div>
                </div>
                
            </div>`;
  }
}

function attachEventListeners(subCollectionRef) {
  var deleteButtons = document.querySelectorAll(".deleteButton");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      handleDeleteButtonClick(event, subCollectionRef);
    });
  });

  var editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((button) =>
    button.addEventListener("click", handleEditButtonClick)
  );
}

function handleDeleteButtonClick(event, subCollectionRef) {
  var itemId = event.target.getAttribute("data-item-id");
  var profile = getProfileIdFromURL();
  if (itemId && confirm("Are you sure you want to delete this appointment?")) {
    subCollectionRef
      .doc(itemId)
      .delete()
      .then(function () {
        console.log("Appointment deleted successfully");
        window.location.href = `upcomingappt.html?id=${profile.id}&pic=${profile.pic}`;
      })
      .catch(function (error) {
        console.error("Error deleting appointment:", error);
      });
  }
}

function handleEditButtonClick(event) {
  var itemId = event.target.getAttribute("data-item-id");
  var profile = getProfileIdFromURL();
  if (itemId) {
    window.location.href = `editAppt.html?id=${profile.id}&pic=${profile.pic}&apptId=${itemId}`;
  }
}

function setupNavigationButtons(profile) {
  var addApptsButton = document.getElementById("addApptBtn");
  var medicationFooterButton = document.getElementById("medication-footer");
  var appointmentFooterButton = document.getElementById("appointment-footer");
  var profileFooterButton = document.getElementById("profile-footer");

  addApptsButton.addEventListener("click", () =>
    navigateTo(`addNewAppt.html?id=${profile.id}&pic=${profile.pic}`)
  );
  medicationFooterButton.addEventListener("click", () =>
    navigateTo(`home.html?id=${profile.id}&pic=${profile.pic}`)
  );
  appointmentFooterButton.addEventListener("click", () =>
    navigateTo(`upcomingappt.html?id=${profile.id}&pic=${profile.pic}`)
  );
  profileFooterButton.addEventListener("click", () =>
    navigateTo(`profile.html?id=${profile.id}&pic=${profile.pic}`)
  );
}

function navigateTo(url) {
  window.location.href = url;
}

function updateAppointmentCounts(upcoming, missed) {
  document.getElementById("upcoming-appts").textContent = upcoming;
  document.getElementById("missed-appts").textContent = missed;
}

function formatDate(inputDate) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return inputDate.toLocaleDateString("en-US", options);
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
