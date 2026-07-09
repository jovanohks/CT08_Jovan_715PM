function setup(){
    new Canvas(800,400);
    background(220);
    console.log("hello world");
    let a=10;
    let b=5;
    let area=0.5*a*b;
    console.log("area:",area);
    text("area:"+area,100,100);
    fill(0);
    for (let i=2; i<=20; i+=2){
        console.log(i);
        ypos=10+(i*10)
        text()
    }
}
function draw(){

}