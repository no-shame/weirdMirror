console.log("tetting4");

var bMouth = true;
var bEyes = false;
var bOutline = false;
var bMondrian = false;
var bLiberman = false;
var bEh = false;

const video = document.getElementById('video')
const videoBlur = document.getElementById('videoBlur')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models')
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


var leftEye, rightEye, mouth, leftEyeMid, rightEyeMid, mouthMid, eyeW, eyeH, mouthW, mouthH, ctx, canvas;


video.addEventListener('play', () => {

 canvas = faceapi.createCanvasFromMedia(video)
 ctx = canvas.getContext('2d')

  canvas.onclick = function() { 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {



    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true)

   
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    if(detections[0]){

         document.querySelector(".loader").style.display = "none";

         leftEye = resizedDetections[0].landmarks.getLeftEye();
         rightEye = resizedDetections[0].landmarks.getRightEye();
         mouth = resizedDetections[0].landmarks.getMouth();

         leftEyeMid = getMid(leftEye[5], leftEye[2]); 
         rightEyeMid = getMid(rightEye[5], rightEye[2]); 
         moutheMid = getMid(mouth[3], mouth[9]); 


         eyeW = 50
         eyeH = 25
         mouthW =  100
         mouthH = getDist(mouth[9], mouth[3]) * 1.5 + 10

         if(!bLiberman)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

     
     
     ctx.save();



     if(!bMondrian)
      ctx.beginPath();

     if(bEyes || bLiberman || bEh){
       ctx.rect(leftEyeMid.x-eyeW/2, leftEyeMid.y-eyeH/2, eyeW, eyeH);
       ctx.rect(rightEyeMid.x-eyeW/2, rightEyeMid.y-eyeH/2, eyeW, eyeH);
     }

     if(bMouth || bLiberman || bEh){
       ctx.rect(moutheMid.x-mouthW/2, moutheMid.y-mouthH/2, mouthW, mouthH);
     }

     if(!bMondrian){
       ctx.closePath();
       ctx.clip();
     }

     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

     // restore the unclipped context (to remove clip)
     ctx.restore();


     if(bOutline || bMondrian || bEh)
       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);


     if(bMondrian){
       ctx.beginPath();
       ctx.fillStyle = "red";
       ctx.fillRect(leftEyeMid.x-eyeW* 1.5/2, leftEyeMid.y-eyeH* 1.5/2, eyeW * 1.5, eyeH*1.5);
       // ctx.clip();
       
       ctx.fillStyle = "yellow";
       ctx.fillRect(rightEyeMid.x-eyeW* 1.5/2, rightEyeMid.y-eyeH* 1.5/2, eyeW * 1.5, eyeH*1.5);

       ctx.fillStyle = "blue";
       ctx.fillRect(moutheMid.x-eyeW* 1.5/2, moutheMid.y-eyeH* 1.5/2, eyeW * 1.5, eyeH*1.5);
      }

    
      //faceapi.draw.drawDetections(canvas, resizedDetections)

    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    //modes: just outline, piet mondre with black outline, no refresh unless click(with or without video dom element below canvas), combinations of mouth eyes and blur, maybe just face
  }, 25)
})

var modes = document.querySelectorAll("a")
for (i = 0; i < modes.length; i++) {
  modes[i].addEventListener('click', function() {
    // alert(this.innerHTML);
    this.style.color = "#551A8B";
    videoBlur.style.display = "initial";
    videoBlur.style.webkitFilter = "blur(12px)";
    videoBlur.style.filter = "blur(12px)";

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    
    bMouth = false;
    bEyes = false;
    bOutline = false;
    bMondrian = false;
    bLiberman = false;
    bEh = false;


    if(this.innerHTML == "mouth")
      bMouth = true;
    if(this.innerHTML == "eyes")
      bEyes = true;
    if(this.innerHTML == "outline"){
      bOutline = true;
      videoBlur.style.display = "none";
    }
    if(this.innerHTML == "mondrian"){
      bMondrian = true;
    }

    if(this.innerHTML == "liberman"){
      bLiberman = true;
      videoBlur.style.webkitFilter = "blur(0px)";
      videoBlur.style.filter = "blur(0px)";
    }

    if(this.innerHTML == "eh?"){
      bEh = true;
      videoBlur.style.display = "none";
    }


  });
}


document.querySelector("#backgroundcheck").onclick = function() {
    if(this.checked){
        videoBlur.style.display = "initial";
    }else{
        videoBlur.style.display = "none";
    }
}




