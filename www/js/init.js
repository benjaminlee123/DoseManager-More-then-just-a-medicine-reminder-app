document.addEventListener("deviceready", function() {
    const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    var firestore = firebase.firestore();
    window.firestore = firestore;
}, false);
