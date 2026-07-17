//player box


// game variables


// world building groups


// image sprites


// menu


// sound assets


function preload() {
    box=loadImage("assets/cube.png");
    bg=loadImage("assets/geobg.png");
}

function setup() {
    new Canvas(700,600);
    world.gravity.y=32;
    const TILE_SIZE=50;
    player=new Sprite(50,50,TILE_SIZE,TILE_SIZE);
    player.img=box;
    let bounciness=1
}

function draw() {
    clear();
    image(bg,0,0,800,600);

}











