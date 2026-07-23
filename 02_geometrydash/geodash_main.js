//player box
let bg;

// game variables
const TILE_SIZE=50;
let playerjump=0;
// world building groups
let Tilemap1,ground,spike,orb,finishline;

// image sprites


// menu


// sound assets


function preload() {
    box=loadImage("assets/cube.png");
    bg=loadImage("assets/geobg.png");
    tileMap1=loadStrings("stages/tiles1.txt")
    spike=loadImage("assets/spike.png")
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


    new Tiles(tileMap1,0,0,50,50);
}

function draw() {
    clear();
    image(bg,0,0,800,600);
    player.vel.x=8;
    if (kb.presses("space") || mouse.presses("left") && playerjump==0){
        player.vel.y=-18;
        player.rotateTo(player.rotation+359,15);
        playerjump ++;
    }
    if (player.collides(ground)){
        playerjump=0;
    }
    if (player.x >=width/2){
        camera.x=player.x;
    }else{
        camera.x=width/2
    }
    
    

}











