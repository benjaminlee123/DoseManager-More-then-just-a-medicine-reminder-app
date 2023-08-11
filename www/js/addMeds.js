// document.addEventListener('DOMContentLoaded', function() {
//     const cameraButton = document.getElementById('cameraButton');
//     const cameraContainer = document.getElementById('cameraContainer');

//     // Function to handle camera button click
//     cameraButton.addEventListener('click', function() {
//         openCamera();
//     });

//     // Function to open the camera
//     function openCamera() {
//         // Check if getUserMedia is supported by the browser
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             navigator.mediaDevices.getUserMedia({ video: true })
//             .then(function(stream) {
//                 // Create a video element to display the camera feed
//                 const video = document.createElement('video');
//                 video.srcObject = stream;
//                 video.play();
//                 // Append the video element to the cameraContainer
//                 cameraContainer.innerHTML = ''; // Clear any previous content
//                 cameraContainer.appendChild(video);
//             })
//             .catch(function(error) {
//                 console.error('Error accessing camera:', error);
//             });
//         } else {
//             console.error('getUserMedia is not supported by this browser.');
//         }
//     }
// });





document.addEventListener('DOMContentLoaded', function() {
    const cameraButton = document.getElementById('cameraButton');
    const uploadButton = document.querySelector('button[type="button"]');
    const cameraContainer = document.getElementById('cameraContainer');
    const imageUpload = document.getElementById('imageUpload');

    let stream; // To store the camera stream

    // Function to handle camera button click
    cameraButton.addEventListener('click', function() {
        openCamera();
    });

    // Function to handle upload button click
    uploadButton.addEventListener('click', function() {
        captureAndUpload();
    });

    // Function to open the camera
    function openCamera() {
        // Check if getUserMedia is supported by the browser
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream; // Store the camera stream
                // Create a video element to display the camera feed
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
                // Append the video element to the cameraContainer
                cameraContainer.innerHTML = ''; // Clear any previous content
                cameraContainer.appendChild(video);
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
            });
        } else {
            console.error('getUserMedia is not supported by this browser.');
        }
    }

    // Function to capture and upload the photo
    function captureAndUpload() {
        if (stream && imageUpload && imageUpload.files && imageUpload.files.length > 0) {
            const photoBlob = new Blob([imageUpload.files[0]], { type: 'image/jpeg' });
            // You can use the 'photoBlob' for further processing (e.g., upload to server)
            console.log('Photo captured:', photoBlob);
        } else {
            console.error('No photo captured or camera stream not available.');
        }
    }
});
