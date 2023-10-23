document.addEventListener("deviceready", retrieveProfile);

function retrieveProfile() {
     apiKey: "YOUR_API_KEY_HERE",
     // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
    var firestore = firebase.firestore();
    
    // Reference to the "ProfileTable" collection
    var profilesCollection = firestore.collection("ProfileTable");
  
    // Reference to the DOM element where profiles will be displayed
    var profilesDiv = document.getElementById("retrieveprofile");
  
  // Fetch all profiles from Firestore
profilesCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Create a new button for each profile
      var profileButton = document.createElement("button");
  
      // Retrieve first name and last name from the full name
      var fullName = doc.data().Name;
      var nameParts = fullName.split(" ");
      var firstName = nameParts[0];
      var lastName = nameParts[1] || ''; // handle cases where last name is not available
  
      // Add text content to the profile button
      profileButton.textContent = `${firstName} ${lastName}`;
        
      // Add styling to the button
      profileButton.className = "profile-button";  
      
      // Add event listener to redirect to home.html when clicked
      profileButton.addEventListener("click", function() {
        window.location.href = "home.html";
        // If you want to pass some data to home.html, you can use URL parameters or localStorage
      });
  
      // Add the profile button to the profilesDiv
      profilesDiv.appendChild(profileButton);
    });
  });
}
