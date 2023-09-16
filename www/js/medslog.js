document.addEventListener("deviceready", displayLogs);

function displayLogs() {
    var dailyLogList = document.getElementById("daily-log-list");
    dailyLogList.innerHTML = "";

    function getProfileIdFromURL() {
        var urlParams = new URLSearchParams(window.location.search);
        var params = {};
        params.id = urlParams.get("id");
        params.pic = urlParams.get("pic");
        params.medId = urlParams.get("medId");
        return params;
    }

    var profile = getProfileIdFromURL();
    var medicineId = profile.medId;

    //home button
    var homeBtn = document.getElementById("backToHomeBtn");
    homeBtn.addEventListener("click", handlebackToHomeBtnClick);

    function handlebackToHomeBtnClick(event) {
        var profile = getProfileIdFromURL();
        console.log(profile);
        window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
    }

    // Fetching the medicine name first
    firebase.firestore()
        .collection("Profiles")
        .doc(profile.id)
        .collection("Medicine")
        .doc(medicineId)
        .get()
        .then(function (medicineDoc) {
            // Once you have the medicine details, fetch the logs
            var medicineName = medicineDoc.data().name;

            var dailyLogsRef = firebase.firestore()
                .collection("Profiles")
                .doc(profile.id)
                .collection("Medicine")
                .doc(medicineId)
                .collection("DailyLogs")
                .orderBy("date");
            dailyLogsRef.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (log) {
                    var logData = log.data();

                    // Determine statusText based on logData.status
                    var statusText = '';
                    switch (logData.status) {
                        case 'taken':
                            statusText = 'taken';
                            break;
                        case 'missed':
                            statusText = 'missed';
                            break;
                        default: // handles 'pending' or any other state
                            statusText = 'is pending';
                            break;
                    }

                    let dateInMillis = logData.date.seconds * 1000;
                    let formattedDate = new Date(dateInMillis).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    let timeTakenString = "";
                    if (logData.date && logData.date.seconds) {
                        let timeInMillis = logData.date.seconds * 1000;
                        let formattedTime = new Date(timeInMillis).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        timeTakenString = `at ${formattedTime}`;
                    }

                    var logEntry = `
                        <div class="card mt-4">
                            <div class="card-body">
                                ${medicineName} ${statusText} on ${formattedDate} ${timeTakenString}.
                            </div>
                        </div>
                    `;
                    dailyLogList.innerHTML += logEntry;
                });
            }).catch(function (error) {
                console.error("Error getting daily logs: ", error);
            });
        });
}
