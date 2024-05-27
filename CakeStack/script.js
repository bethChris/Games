//anchor player to bottom
//implement movement (left and right)
//randomize which items get dropped
//randomize number of items dropped per second


const screenWidth = 400;
const screenHeight = 400;

class Player  {
  constructor(image, screenWidth, screenHeight){
    this.image = image
    this.start_pos = [screenWidth/2, screenHeight-image.y/2]
    this.speed = 10;
  }
}


window.addEventListener("keydown", handleMove)

function handleMove(e){
  console.log(e.key)
}



var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");
