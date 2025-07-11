const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6,
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 640,
  height: 480,
});
camera.start();

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length) {
    // --- face detected → draw green mesh
    for (const landmarks of results.multiFaceLandmarks) {
      canvasCtx.beginPath();
      canvasCtx.strokeStyle = '#00ff00';
      canvasCtx.lineWidth   = 1.2;
      landmarks.forEach(pt => {
        canvasCtx.lineTo(pt.x * canvasElement.width,
                         pt.y * canvasElement.height);
      });
      canvasCtx.stroke();
    }

    // NEW ▶ animated horizontal scan‑line
    const yScan = (Date.now() / 10) % canvasElement.height;
    canvasCtx.strokeStyle = 'rgba(0,255,0,0.4)';
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, yScan);
    canvasCtx.lineTo(canvasElement.width, yScan);
    canvasCtx.stroke();
  } else {
    // --- no face → red translucent overlay
    canvasCtx.fillStyle = 'rgba(255,0,0,0.25)';   // NEW
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height); // NEW
    canvasCtx.font = '20px sans-serif';                                       // NEW
    canvasCtx.fillStyle = '#ffffff';                                          // NEW
    canvasCtx.fillText('⚠ No human face detected', 20, 35);                  // NEW
  }
  canvasCtx.restore();
}
