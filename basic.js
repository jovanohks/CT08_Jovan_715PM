function setup(){
    new Canvas(800,400);
    background(220);
    console.log("hello world");
    let a=10;
    let b=5;
    let area=0.5*a*b;
    console.log("area:",area);
    text("area:"+area,0,100);
    fill(0);
    for (let i=2; i<=20; i+=2){
        console.log(i);
        ypos=10+(i*10);
        text(i,100,ypos);
    }
    let age =9
    if (age <=9){
        console.log("lower primary");
    }else if (age <=12){
        console.log("upper primary");
    }else{
        console.log("secondary");
    }
    let count=0;
    while (count<10){
        console.log(count);
        count++;
    }
    let groceries=["apple","milk","bread"]
    groceries.push("orange")
    groceries.push("butter")
    groceries.splice(1,1,"kaya")
    console.log(groceries)
    let ypos=50
    for (let item of groceries){
        text
    }
}
function draw(){

}