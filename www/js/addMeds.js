document.addEventListener('DOMContentLoaded', function() {
    const cameraButton = document.getElementById('cameraButton');

    // Function to handle camera button click
    cameraButton.addEventListener('click', function() {
        openCamera();
    });

    // Function to open the camera
    function openCamera() {
        // Check if getUserMedia is supported by the browser
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Create a video element to display the camera feed
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
            });
        } else {
            console.error('getUserMedia is not supported by this browser.');
        }
    }
});
