// //=========================================
// // Variables
// //=========================================
// let hands=[]
// let handPose;
// let videoW=640;
// let videoH=480;
// let video;
// //=========================================
// // Code
// //=========================================

// function preload() {
//     let options = {
//         flipped:true,
//         runtime:"tfjs",
//         modelType:"full",
//         detectorModelUrl:undefined,
//         landmarkModelUrl:undefined,

//     };
//     handPose=ml5.handPose(options);

// }
// function gotHands(results){
//     hands=results;

// }
// function setup() {
//     createCanvas(videoW,videoH);
//     let constraints={
//         video:{
//             mandatory:{
//                 minWidth:videoW,
//                 minHeight:videoH
//             },
//             optional: [{minFrameRate:60}],
//         },
//         audio: false,

//         flipped:true,
//     }
//     video=createCapture(constraints);
//     video.size=(640,480);

//     handPose.detectStart(video,gotHands);
//     fingertip=new Sprite();
//     fingertip.diameter=60;
//     fingertip.collider="kinematic";
//     fingertip.color="rgba(0,255,0,0.05)";
//     fingertip.x=keypoint.x;
//     fingertip.y=keypoint.y;
// }

// function draw() {
//     image(video,0,0,videoW,videoH);
//     for (let i=0; i<hands.length; i++){
//         let hand=hands[i];
//         // for (let j=0; j<hand.keypoints.length; j++){
//         //     let keypoint=hand.keypoints[j];
//         //     circle(keypoint.x,keypoint.y,10)
//         // }
//         let k=hand.keypoints[8];
//         circle(k.x,k.y,10);
//         k=hand.keypoints[4];
//         circle(k.x,k.y,10);
//         k=hand.keypoints[12];
//         circle(k.x,k.y,10);
//         k=hand.keypoints[16];
//         circle(k.x,k.y,10);
//         k=hand.keypoints[20];
//         circle(k.x,k.y,10);
//     }   

// }

// //=========================================
// // Function Created
// //=========================================
let handPose; // ML Model
let video; // Webcam video
let videoW = 640;
let videoH = 480;
let hands = []; // global variable to store hands

// Game sprites
let fingerTip;
let balloon;

function preload() {
// Create options for model settings
let options = {
flipped: true,
runtime: "tfjs",
modelType: "full",
detectorModelUrl: undefined, //default to use the tf.hub model
landmarkModelUrl: undefined //default to use the tf.hub model
}

// Load the handPose model
handPose = ml5.handPose(options);
}

function setup() {
createCanvas(videoW, videoH);

let constraints = {
video: {
mandatory: {
minWidth: videoW,
minHeight: videoH,
},
optional: [{ minFrameRate: 60 }],
},
audio: false,
flipped: true // makes the video mirrored
};

// Create the webcam video and hide it
video = createCapture(constraints);
video.size(640, 480);
video.hide();
// start detecting hands from the webcam video + model
handPose.detectStart(video, gotHands);

// Game sprite
fingerTip = new Sprite();
fingerTip.diameter = 60;
fingerTip.collider = "kinematic"
fingerTip.color = "rgba(0, 255, 0, 0.05)";
}

function draw() {
// Draw the webcam video
image(video, 0, 0, videoW, videoH);

// Draw all the tracked hand points
// Loop through all the hands detected (can detect left or right)
for (let i = 0; i < hands.length; i++) {
let hand = hands[i]; // current hand (left or right)

// Keypoint 8 = INDEX_FINGER_TIP
let keypoint = hand.keypoints[8];

// for every keypoint, draw a circle.
        fingerTip.x = keypoint.x;
fingerTip.y = keypoint.y;
    }
}

// Callback function for when handPose outputs data
function gotHands(results) {
// save the output to the hands variable
    hands = results;
}