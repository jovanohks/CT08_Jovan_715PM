//=========================================
// Variables
//=========================================
let hands=[]
let handPose;
let videoW=640;
let videoH=480;
let video;
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

    handPose.detectStart(video,gotHands);
}

function draw() {
    image(video,0,0,videoW,videoH);
    for (let i=0; i<hands.length; i++){
        let hand=hands[i];
        for (let j=0; j<hand.keypoints.length; j++){
            let keypoint=hand.keypoints[4];
            circle(keypoint.x,keypoint.y,10)
            let keypoint=hand.keypoints[8];
            circle(keypoint.x,keypoint.y,10)
            let keypoint=hand.keypoints[12];
            circle(keypoint.x,keypoint.y,10)

            let keypoint=hand.keypoints[16];
            circle(keypoint.x,keypoint.y,10)
            let keypoint=hand.keypoints[20];
            circle(keypoint.x,keypoint.y,10)
            
        }
    }

}

//=========================================
// Function Created
//=========================================
