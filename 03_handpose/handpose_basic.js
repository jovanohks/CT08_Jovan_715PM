//=========================================
// Variables
//=========================================
let hands=[]
let handpose;
let videoW=640;
let videoH=480
//=========================================
// Code
//=========================================

function preload() {
    let options = {
        flipped:true,
        runtime:"tfjs",
        modelType:"full",
        detectorModelUrl:"undefined",
        landmarkModelUrl:"undefined",

    }
    handPose=ml5.handPose(options);

}
function gotHands(results){
    hands=results;

}
function setup() {
    createCanvas(videoW,videoH);
    let constraints={
        video:{
            mandatory:{
                minWidth:videoW,
                minHeight:videoH
            },
            optional: [{minFrameRate:60}],
        },
        audio: false,

        flipped:true,
    }
    video=createCapture(constraints);
    video.size=(640,480);
    video.hide();
    handPose.detectStart(video,gotHands);
}

function draw() {
    image(video,0,0,videoW,videoH);
    for (let i=0; i<hands.length; i++){
        let hand=hands[i];
        for (let j=0; j<hand.keypoints.length; j++){
            let keypoint=hand.keypoints[j];
            circle(keypoint.x,keypoint.y,10)
        }
    }

}

//=========================================
// Function Created
//=========================================
