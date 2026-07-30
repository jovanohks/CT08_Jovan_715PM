//player box
let bg;

// game variables
const TILE_SIZE=50;
const MAX_JUMP=1;
let jumpChance=MAX_JUMP;
let playerjump=0;
// world building groups
let Tilemap1,ground,spike,orb,finishline;

// image sprites
let startSprite;
let endSprite;
let startGameImg;
let endGameImg;

let startGame=false;
let endGame=false;

// menu


// sound assets


function preload() {
    box=loadImage("assets/cube.png");
    bg=loadImage("assets/geobg.png");
    tileMap1=loadStrings("stages/tiles1.txt");
    spike=loadImage("assets/spike.png");
    startGameImg=loadImage('assets/startgame.png');
    endGameImg=loadImage('assets/clear.png');
}
function setup() {
    new Canvas(700,600);
    world.gravity.y=32;
    
    player=new Sprite(50,50,TILE_SIZE,TILE_SIZE);
    player.img=box;
    player.frction=0;
    player.bounciness=0;
    player.collider="dynamic";
    startCoordinate=[50,height-TILE_SIZE/2];
    player.x=startCoordinate[0];
    player.y=startCoordinate[1];
    ground= new Group();
    ground.tile="g";
    ground.w=TILE_SIZE;
    ground.h=TILE_SIZE;
    ground.color="black";
    ground.collider="static";
    ground.stroke="black";
    spikes=new Group();
    spikes.tile="s";
    spikes.w=TILE_SIZE;
    spikes.h=TILE_SIZE;
    spikes.collider="static";
    spikes.img=spike;
    orbs=new Group();
    orbs.tile="o";
    orbs.d=24;
    orbs.collider="static";
    orbs.strokeWeight=0;
    orbs.color="#fff53b";
    finishLine=new Group();
    finishLine.tile="f";
    finishLine.w=TILE_SIZE;
    finishLine.h=height*2;
    finishLine.collider="static";
    finishLine.color="orange";
    finishLine.visible=true;
    startSprite=new Sprite(width/2, height/2,190,90)
    startSprite.img=startGameImg

    new Tiles(tileMap1,0,0,50,50);
}
function triggerGameOver(){
    if (!gameOver){
        
    }
}
function resetGame(){
    player.x=startCoordinate[0];
    player.y=startCoordinate[1];
    player.rotation=0;
    playerJump=0;
    for (let orb of orbs){
        orbs.visible=true;
        orbs.collider="static";

    }
}
function draw() {
    if (!startGame && (mouse.presses()||kb.presses("space"))){
        startSprite.visible=false;
        startGame=true;
    }else if (!startGame){
        if (frameCount %60 <30){
            startSprite.visible=true;

        }else{
            startSprite.visible=false;
        }
    }
    if (startGame){
        clear();
        image(bg,0,0,800,600);
        player.vel.x=8;
        for (let tile of ground){
            if (player.collides(tile)){
                let leftEdge=tile.w-tile.h/2;
                let leftEdgeHeight=tile.y-tile.h/2;
                if (player.x <leftEdge && player.y <leftEdgeHeight){
                    resetGame();
                    break;
                }
            }
        }
        if (kb.presses("space") || mouse.presses("left") && jumpChance>0){
            player.vel.y=-10;
            player.rotateTo(player.rotation+359,15);
            playerjump -=1;
        }

        if (player.collides(ground)){
            jumpChance=MAX_JUMP;
        }
        if (player.x >=width/2){
            camera.x=player.x;
        }else{
            camera.x=width/2;
        }
        if (player.collides(spikes)){
            player.x=startCoordinate[0];
            player.y=startCoordinate[1];
        }
        for (let orb of orbs){
            if (player.collides(orb)){
                orb.visible=false;
                orb.collider="none";
                box.vel.y=-5;
                jumpChance=MAX_JUMP
            }
        }
    }

    

}











