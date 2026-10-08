// ====================================================
// Canvas and layout variables
// ====================================================

// Width of the webcam/game area.
let cameraWidth = 800;

// Height of the webcam/game area.
let cameraHeight = 450;

// Width of each side panel.
let sidePanelWidth = 220;

// Total canvas width = left panel + webcam area + right panel.
let totalCanvasWidth = cameraWidth + sidePanelWidth * 2;

// x-position where the webcam area starts.
let cameraX = sidePanelWidth;

// x-position of the left panel.
let leftPanelX = 0;

// x-position of the right panel.
let rightPanelX = sidePanelWidth + cameraWidth;
let skeletonColour;
let player1Person;
let player2Person;
let BothHandsUpImage;
let leftHandsUpImage;
let rightHandsUpImage;
let tposeImage;
let handsonheadImage;
let posearray=[];
let currentpose=null;

// ====================================================
// Preload
// ====================================================
let detectedPeople=[];
function preload(){
    bodyPose=ml5.bodyPose("MoveNet", {flipped:true});

}

// ====================================================
// Setup
// ====================================================

// setup() runs once at the start.
function setup() {
   
    new Canvas(cameraWidth,totalCanvasWidth);
    let constraints = {
        video: {
            mandatory: {
                minWidth: cameraWidth,
                minHeight: cameraHeight,
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

 
    // Set up text.
    textAlign(CENTER, CENTER);
    bodyPose.detectStart(video,gotPoses);
    skeletonColour = color(255,255,0);
    player1colour=color(255,0,0);
    player2colour=color(0,0,255);
    setupposearray();
    currentpose=posearray[0];
}


// ====================================================
// Main draw loop
// ====================================================

// draw() runs again and again.
function draw() {
    // Clear the canvas with a dark background.
    background(30);
    // Draw the side panels.
    drawUIPanel();
    // Draw the middle line that separates Player 1 and Player 2 areas.
    drawMiddleLine();

    image(video,cameraX,0,cameraWidth,cameraHeight);
    drawDetectionStatus()
    if (detectedPeople.length >0){
        let person=detectedPeople[0];
        let x=person.nose.x+1.3025*cameraX;
        let y=person.nose.y;
        fill(255,0,0);
        circle(x,y,50);
    }
    findPlayers();
    drawPlayerSkeletons();
    drawGameUI();
}
function drawSkeleton(person, skeletonColor) {
    // Set skeleton line colour.
    stroke(skeletonColor);

    // Set skeleton line thickness.
    strokeWeight(3);

    // Draw shoulder line.
    drawBodyLine(person.left_shoulder, person.right_shoulder);

    // Draw left upper arm.
    drawBodyLine(person.left_shoulder, person.left_elbow);

    // Draw left lower arm.
    drawBodyLine(person.left_elbow, person.left_wrist);

    // Draw right upper arm.
    drawBodyLine(person.right_shoulder, person.right_elbow);

    // Draw right lower arm.
    drawBodyLine(person.right_elbow, person.right_wrist);

    // Draw left body side.
    drawBodyLine(person.left_shoulder, person.left_hip);

    // Draw right body side.
    drawBodyLine(person.right_shoulder, person.right_hip);

    // Draw hip line.
    drawBodyLine(person.left_hip, person.right_hip);

    // Remove outlines for the body point circles.
    noStroke();

    // Set circle colour.
    fill(skeletonColor);

    // Draw important body points.
    drawBodyPoint(person.nose);
    drawBodyPoint(person.left_shoulder);
    drawBodyPoint(person.right_shoulder);
    drawBodyPoint(person.left_elbow);
    drawBodyPoint(person.right_elbow);
    drawBodyPoint(person.left_wrist);
    drawBodyPoint(person.right_wrist);
    drawBodyPoint(person.left_hip);
    drawBodyPoint(person.right_hip);
}

function drawAllskeletons(){
    for (let i =0; i < detectedPeople.length;i++){
        let person=detectedPeople[i]
        drawSkeleton(person,skeletonColour)
    }
}
// ====================================================
// Draw side UI panels
// ====================================================

// Draws the left and right UI panels.
function pointIsReady(point){
    if (point == null|| point == undefined){
        return false;


    }
    if (point.confidence >0.25){
        return true;
    }else{
        return false;
    }
}
function drawBodyLine(point1,point2){
    if (pointIsReady(point1)) {
        line(point1.x+cameraX,point1.y,point2.x+cameraX,point2.y)       
    }
}
function drawBodyPoint(point){
    if (pointIsReady(point)){
        circle(point.x+cameraX,point.y,10)
    }
}

function drawUIPanel() {
    // Remove outlines.
    noStroke();

    // Set panel colour.
    fill(20);

    // Draw left panel.
    rect(leftPanelX, 0, sidePanelWidth, cameraHeight);

    // Draw right panel.
    rect(rightPanelX, 0, sidePanelWidth, cameraHeight);

    // Set divider line colour.
    stroke(255, 180);

    // Set divider line thickness.
    strokeWeight(2);

    // Draw line between left panel and webcam.
    line(sidePanelWidth, 0, sidePanelWidth, cameraHeight);

    // Draw line between webcam and right panel.
    line(rightPanelX, 0, rightPanelX, cameraHeight);
}

// ====================================================
// Draw middle divider line
// ====================================================

// Draws the vertical line that separates Player 1 and Player 2.
function drawMiddleLine() {
    // Set line colour to white with transparency.
    stroke(255, 180);

    // Set line thickness.
    strokeWeight(2);

    // Draw the middle line inside the webcam area.
    line(width / 2, 0, width / 2, cameraHeight);
}
function gotPoses(results){
    detectedPeople=results;
}
function drawDetectionStatus(){
    fill(0);
    textSize(24);
    text("People detected: "+detectedPeople.length,width/2,height*0.1);
    console.log(detectedPeople);

}
function findPlayers(){
    player1Person = null;
    player2Person = null;
    let player1Distance=Number.MAX_VALUE;
    let player2Distance=Number.MAX_VALUE;
    let player1CenterX = cameraWidth /4 + cameraX;
    let player2CenterX = cameraWidth /4 *3 +cameraX;
    let cameraCenterX =cameraWidth /2;
    for (let i=0; i<detectedPeople.length; i++){
        let person=detectedPeople[i];
        let nose=person.nose;
        if (pointIsReady(nose)){
            let noseX=nose.x+cameraX;
            if (noseX <cameraCenterX){
                let distanceFromPlayer1Center = abs(noseX-player1CenterX);
                if (distanceFromPlayer1Center < closetplyer1Distance){
                    player1Person = person;
                    closestPlayer1Distance=distanceFromPlayer1Center;
                }

            }
        }else{
            let distanceFromPlayer2Center = abs(noseX-player2CenterX);
        }

    }
}
function drawPlayerSkeletons(){
    if (player1Person != null){
        drawSkeleton(player1Person,player1colour);
    }
    if (player2Person != null){
        drawSkeleton(player2Person,player2colour);
    }
}
function drawPlayerStatus(){
    noStroke();
    textSize(28);
    if (player1Person !=null){
        fill(255);
        text("Detected", leftPanelCenterX,height /2);
    }
    if (player2Person !=null){
        fill(player2colour);
        text("Detected",rightPanelCenterX,height /2)
    }
}
function setupposearray(){
    posearray = [
        {
            name:"Both hands up",
            image:BothHandsUpImage,
            id:"bothHandsUp"
        },
        {
            name:"Right hands up",
            image:rightHandsUpImage,
            id:"rightHandsUp"
        },
        {
            name:"Hands on head",
            image:handsonheadImage,
            id:"handsOnHead"
       
        },
        {
            name:"left hands up",
            image:leftHandsUpImage,
            id:"leftHandsUp"
        },
        {
            name:"T Pose",
            image:tposeImage,
            id:"tPose"
        }
    ]
}
function drawTargetPose(poseImage,x,y,size){
    imageMode(CENTER);
    image(poseImage,x,y,size,size);
    imageMode(CORNER);
}
function drawGameUI(){
    if (currentpose === null || currentpose === undefined){
        return;
    }
    fill(255,220,80);
    textSize(28);
    text(currentpose.name,width/2,height*0.1);
    drawTargetPose(currentpose.image,width/2,height*0.9,230);
}
function keyPressed(){
    if (key ==="1"){
        currentpose=posearray[0];
    }
    if (key ==="2"){
        currentpose=posearray[1];
    }    
    if (key ==="3"){
        currentpose=posearray[2];
    }
    if (key ==="4"){
        currentpose=posearray[3];
    }
    if (key ==="5"){
        currentpose=posearray[4];
    }
}
function checkBothHandsUp(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;
    let nose = person.nose;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    if (pointIsReady(nose) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let margin = shoulderWidth * 0.25;

    let leftHandHigh = false;
    let rightHandHigh = false;

    if (leftWrist.y < nose.y - margin) {
        leftHandHigh = true;
    }

    if (rightWrist.y < nose.y - margin) {
        rightHandHigh = true;
    }

    if (leftHandHigh === true && rightHandHigh === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether only the left hand is up.
function checkLeftHandUp(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let margin = shoulderWidth * 0.25;

    let leftIsUp = false;
    let rightIsDown = false;

    if (leftWrist.y < leftShoulder.y - margin) {
        leftIsUp = true;
    }

    if (rightWrist.y > rightShoulder.y + margin) {
        rightIsDown = true;
    }

    if (leftIsUp === true && rightIsDown === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether only the right hand is up.
function checkRightHandUp(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let margin = shoulderWidth * 0.25;

    let rightIsUp = false;
    let leftIsDown = false;

    if (rightWrist.y < rightShoulder.y - margin) {
        rightIsUp = true;
    }

    if (leftWrist.y > leftShoulder.y + margin) {
        leftIsDown = true;
    }

    if (rightIsUp === true && leftIsDown === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether both arms are stretched sideways like a T.
function checkTPose(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let levelMargin = shoulderWidth * 0.5;

    let leftWristLevel = false;
    let rightWristLevel = false;
    let armsAreWide = false;

    if (abs(leftWrist.y - leftShoulder.y) < levelMargin) {
        leftWristLevel = true;
    }

    if (abs(rightWrist.y - rightShoulder.y) < levelMargin) {
        rightWristLevel = true;
    }

    let wristDistance = abs(leftWrist.x - rightWrist.x);

    if (wristDistance > shoulderWidth * 2) {
        armsAreWide = true;
    }

    if (leftWristLevel === true && rightWristLevel === true && armsAreWide === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether both hands are near the head.
function checkHandsOnHead(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;
    let nose = person.nose;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    if (pointIsReady(nose) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);

    let closeToHeadDistance = shoulderWidth * 0.8;
    let headHeightMargin = shoulderWidth * 0.45;
    let aboveShoulderMargin = shoulderWidth * 0.3;

    let leftHandNearHead = false;
    let rightHandNearHead = false;

    let leftDistanceFromHead = dist(leftWrist.x, leftWrist.y, nose.x, nose.y);
    let rightDistanceFromHead = dist(rightWrist.x, rightWrist.y, nose.x, nose.y);

    if (
        leftDistanceFromHead < closeToHeadDistance &&
        abs(leftWrist.y - nose.y) < headHeightMargin &&
        leftWrist.y < leftShoulder.y - aboveShoulderMargin
    ) {
        leftHandNearHead = true;
    }

    if (
        rightDistanceFromHead < closeToHeadDistance &&
        abs(rightWrist.y - nose.y) < headHeightMargin &&
        rightWrist.y < rightShoulder.y - aboveShoulderMargin
    ) {
        rightHandNearHead = true;
    }

    if (leftHandNearHead === true && rightHandNearHead === true) {
        return true;
    } else {
        return false;
    }
}