//=========================================
// Variables
//=========================================
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

function setup() {
    createCanvas(videoW,videoH);
    let constraints={
        video:{
            mandatory:{
                minWidth:videoW,
                minHeight:videoH
            },
            optional: [{min}]
        }
    }
}

function draw() {}

//=========================================
// Function Created
//=========================================
