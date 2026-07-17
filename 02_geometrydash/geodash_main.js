//player box
let bg;

// game variables
const TILE_SIZE=50;

// world building groups
let Tilemap1,ground,spike,orb,finishline;

// image sprites


// menu


// sound assets


function preload() {
    box=loadImage("assets/cube.png");
    bg=loadImage("assets/geobg.png");
    Tilemap1=loadstrings()
}

function setup() {
    new Canvas(700,600);
    world.gravity.y=32;
    
    player=new Sprite(50,50,TILE_SIZE,TILE_SIZE);
    player.img=box;
    player.frction=0;
    player.bounciness=0;
    player.collider="none";
    startCoordinate=[50,height-TILE_SIZE/2];
    player.x=startCoordinate[0];
    player.y=startCoordinate[1];
}

function draw() {
    clear();
    image(bg,0,0,800,600);

}











