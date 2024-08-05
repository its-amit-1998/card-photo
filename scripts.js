window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  const cardContainer = document.getElementById("card-container");

  // Function to hide preloader
  function hidePreloader() {
    // Check if the preloader is still visible
    if (!preloader.classList.contains("hidden")) {
      preloader.classList.add("hidden");
    }

    // Ensure card container becomes visible
    cardContainer.style.visibility = "visible";
    document.body.style.overflow = "auto";
  }

  // Set a listener for the transition end to ensure the preloader is hidden
  preloader.addEventListener("transitionend", function () {
    preloader.style.display = "none";
  });

  // Call the hidePreloader function when the window loads
  window.addEventListener("load", hidePreloader);

  // Fallback to ensure preloader is removed after a certain time
  setTimeout(hidePreloader, 5000);
});

window.addEventListener("DOMContentLoaded", () => {
  // Camera and other functionalities...
  document
    .getElementById("upload-photo-button")
    .addEventListener("click", function () {
      startCamera();
    });

  function startCamera() {
    const video = document.getElementById("camera-view");
    const canvas = document.getElementById("camera-canvas");
    const frame = document.getElementById("frame");
    const takePhotoButton = document.getElementById("take-photo-button");

    video.style.display = "block";
    frame.style.display = "block";
    takePhotoButton.style.display = "block";

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;

        takePhotoButton.addEventListener("click", function () {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          context.drawImage(frame, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");

          const uploadedImage = document.getElementById("uploaded-image");
          uploadedImage.src = dataUrl;
          uploadedImage.style.display = "block";
          stopCamera();
        });
      })
      .catch((error) => {
        console.error("Error accessing camera: ", error);
      });
  }

  function stopCamera() {
    const video = document.getElementById("camera-view");
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    video.srcObject = null;

    // Hide camera view and frame
    video.style.display = "none";
    document.getElementById("frame").style.display = "none";
    document.getElementById("take-photo-button").style.display = "none";
    document.getElementById("camera-canvas").style.display = "none";
  }

  const playerName = document.getElementById("player-name");
  if (playerName) {
    playerName.addEventListener("input", function () {
      const name = this.value;
      document.getElementById("uploaded-image").alt = name;
    });
  }

  const playerRating = document.getElementById("player-rating");
  if (playerRating) {
    playerRating.addEventListener("input", function () {
      const rating = this.value;
      // You can implement further logic to display the rating on the card
    });
  }

  document.getElementById("save-button").addEventListener("click", function () {
    const uploadedImage = document.getElementById("uploaded-image");

    if (!uploadedImage.src || uploadedImage.src === window.location.href) {
      console.error("Uploaded Image not found");
      return;
    }

    const card = document.getElementById("card-container");
    html2canvas(card)
      .then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "custom-card.png";
        link.click();
      })
      .catch((error) => {
        console.error("Error converting image to PNG:", error);
      });
  });
});
