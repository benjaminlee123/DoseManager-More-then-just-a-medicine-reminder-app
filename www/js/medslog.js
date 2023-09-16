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
        .then(function(medicineDoc) {
            // Once you have the medicine details, fetch the logs
            var medicineName = medicineDoc.data().name;

            var dailyLogsRef = firebase.firestore()
                .collection("Profiles")
                .doc(profile.id)
                .collection("Medicine")
                .doc(medicineId)
                .collection("DailyLogs")
                .orderBy("date");

            dailyLogsRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(log) {
                    var logData = log.data();
                    var logEntry = `
                        <div class="card mt-4">
                            <div class="card-body">
                                <h5 class="card-title">${medicineName} ${logData.status === "taken" ? "taken" : "missed"} on ${new Date(logData.date.seconds * 1000).toDateString()} ${logData.timeTaken ? `at ${new Date(logData.timeTaken.seconds * 1000).toLocaleTimeString()}` : ""}.</h5>
                            </div>
                        </div>
                    `;
                    dailyLogList.innerHTML += logEntry;
                });
            }).catch(function(error) {
                console.error("Error getting daily logs: ", error);
            });

        }).catch(function(error) {
            console.error("Error getting medicine details: ", error);
        });
}


