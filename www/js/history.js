
document.addEventListener("deviceready", displayMissedNotifications);


function getProfileIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get("id"),
        pic: urlParams.get("pic")
    };
}


function handleHomeButtonClick(profile) {
    const homeBtn = document.getElementById("backToHomeBtn");
    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
        });
    }
}

function displayMissedAppointments(appointments, appointmentList) {
    for (let appointmentId in appointments) {
        let appointment = appointments[appointmentId];
        appointmentList.innerHTML += `
            <div class="card mt-4">
                <div class="card-body">
                    <h5 class="card-title">Missed appointment at ${appointment.apptLocation} on ${new Date(appointment.apptDateTime).toDateString()}.</h5>
                </div>
            </div>
        `;
    }
}

function displayMissedMedicines(medicines, medicineList) {
    for (let medicineId in medicines) {
        let medicine = medicines[medicineId];
        medicineList.innerHTML += `
            <div class="card mt-4">
                <div class="card-body">
                <h5 class="card-title">Missed ${medicine.name} dosage on ${new Date(medicine.timestamp.seconds * 1000).toLocaleString()}.</h5>
                </div>
            </div>
        `;
    }
}

function displayMissedNotifications() {
    const profile = getProfileIdFromURL();
    const appointmentList = document.getElementById("appointment-list");
    const medicineList = document.getElementById("medicine-list");

    handleHomeButtonClick(profile);

    firebase.firestore()
        .collection("Profiles")
        .doc(profile.id)
        .collection("MissedNotifications")
        .doc("Appointments")
        .get()
        .then(doc => {
            if (doc.exists) {
                displayMissedAppointments(doc.data(), appointmentList);
            }
            return firebase.firestore()
                .collection("Profiles")
                .doc(profile.id)
                .collection("MissedNotifications")
                .doc("Medicine")
                .get();
        })
        .then(doc => {
            if (doc.exists) {
                displayMissedMedicines(doc.data(), medicineList);
            }
        })
        .catch(error => {
            console.error("Error getting missed notifications: ", error);
        });
        var mainProfileId = profile.id;
  var mainProfileRef = firestore
    .collection("Profiles")
    .doc(mainProfileId);

  mainProfileRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var userData = doc.data();
        var userName = userData.name;

        var userProfileName = document.getElementById("userProfileName");
        userProfileName.textContent = userName+ "'s Medicine Notification Log";
      } else {
        console.log("User document not found");
      }
    })
    .catch(function (error) {
      console.error("Error getting user document: ", error);
    });
}


