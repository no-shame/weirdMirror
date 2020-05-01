console.log();

const video = document.getElementById('video')
const videoBlur = document.getElementById('videoBlur')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/'),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri('/')
]).then(startVideo)


function startVideo(){
	  navigator.mediaDevices.getUserMedia(
	  	{ video: {} })
	    .then(function (stream) {
          videoBlur.srcObject = stream;
          video.srcObject = stream;
        })
	    .catch(err => console.error(err));
}

var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};


function getMid(v1, v2){
    var v = new Vector(v1.x + v2.x, v1.y + v2.y);
    return new Vector(v.x / 2, v.y / 2);
}

function getDist(v1, v2){
  return (v1.y - v2.y);
}


var leftEye, rightEye, mouth, leftEyeMid, rightEyeMid, mouthMid, eyeW, eyeH, mouthW, mouthH;


video.addEventListener('play', () => {

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true)

    var ctx = canvas.getContext('2d')
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    if(detections[0]){

         leftEye = resizedDetections[0].landmarks.getLeftEye();
         rightEye = resizedDetections[0].landmarks.getRightEye();
         mouth = resizedDetections[0].landmarks.getMouth();

         leftEyeMid = getMid(leftEye[5], leftEye[2]); 
         rightEyeMid = getMid(rightEye[5], rightEye[2]); 
         moutheMid = getMid(mouth[3], mouth[9]); 


         eyeW = 50
         eyeH = 25
         mouthW =  100
         mouthH = getDist(mouth[3], mouth[9]) * 2 + 20

         ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

     
     
     ctx.save();




     ctx.beginPath();
     ctx.rect(leftEyeMid.x-eyeW/2, leftEyeMid.y-eyeH/2, eyeW, eyeH);
     ctx.rect(rightEyeMid.x-eyeW/2, rightEyeMid.y-eyeH/2, eyeW, eyeH);
     ctx.rect(moutheMid.x-mouthW/2, moutheMid.y-mouthH/2, mouthW, mouthH);
     ctx.closePath();
     ctx.clip();

     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

     // restore the unclipped context (to remove clip)
     ctx.restore();

     // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

     // ctx.beginPath();
     // ctx.fillStyle = "red";
     // ctx.fillRect(leftEyeMid.x-eyeW/2, leftEyeMid.y-eyeH/2, eyeW, eyeH);
     // // ctx.clip();
     
     // ctx.fillStyle = "yellow";
     // ctx.fillRect(rightEyeMid.x-eyeW/2, rightEyeMid.y-eyeH/2, eyeW, eyeH);

     // ctx.fillStyle = "blue";
     // ctx.fillRect(moutheMid.x-mouthW/2, moutheMid.y-mouthH/2, mouthW, mouthH);


    //faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    //modes: just outline, piet mondre with black outline, no refresh unless click(with or without video dom element below canvas), combinations of mouth eyes and blur, maybe just face
  }, 25)
})