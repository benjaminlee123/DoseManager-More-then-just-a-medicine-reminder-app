document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('saveButton');
    console.log('check ');
    // Only add the event listener if the save button is found
    if (saveButton) {
        saveButton.addEventListener('click', saveProfile);
    }

    // Load profiles if on the profile login page
    var profilesDiv = document.getElementById('profiles');
    if (profilesDiv) {
        if (typeof db !== 'undefined') {
            loadProfiles();
        } else {
            document.addEventListener('deviceready', loadProfiles, false); //check
        }
    }
});

function loadProfiles() {
    console.log('profile loaded');
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM ProfileTable', [], function(tx, rs) {
            var profilesDiv = document.getElementById('profiles');
            for (var i = 0; i < rs.rows.length; i++) {
                var user = rs.rows.item(i);
                var profileLink = document.createElement('a');
                profileLink.textContent = user.Name;
                profileLink.href = 'profile-dashboard.html?id=' + user.Profile_id;
                profileLink.className = 'profile';
                profilesDiv.appendChild(profileLink);
            }
        }, function(tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

// You can call loadProfiles here or from another file where it makes sense

function saveProfile(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log('saveProfile function called');

    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var gender = document.getElementById('gender').value;
    var dob = document.getElementById('dob').value;

    // Check if any fields are missing
    if (!firstName || !lastName || !gender || !dob) {
        alert('Please fill in all the fields.');
        return; // Exit the function if any field is missing
    }

    console.log('Form values:', firstName, lastName, gender, dob);

    db.transaction(function(tx) {
        console.log('Starting transaction');
        tx.executeSql('INSERT INTO ProfileTable (Name, DateOfBirth) VALUES (?, ?)',
            [firstName + ' ' + lastName, dob],
            function(tx, rs) {
                console.log('Profile saved successfully');
                // Redirect to profile login page or show success message
                window.location.href = 'profilelogin.html';
            },
            function(tx, error) {
                console.log('INSERT error: ' + error.message);
            }
        );
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
    });
  
}