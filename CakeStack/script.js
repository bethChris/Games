//anchor player to bottom
//implement movement (left and right)
//randomize which items get dropped
//randomize number of items dropped per second


//set up info
const screenWidth = 400;
const screenHeight = 400;
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "moo.png";

var strawb = new Image();
strawb.addEventListener("load", loadHandler, false)
strawb.src = "strawberry.png";

class Player  {
  constructor(image, screenWidth, screenHeight){
    this.width = 64
    this.height = 64
    this.image = image
    this.x = (screenWidth/2) - this.width/2 
    this.y = screenHeight - this.height

    this.speed = 200; 
  }
}

//TODO: maybe make these (player/ingredient) the same/inherit from similar template object?
class Ingredient {
  constructor(image, screenWidth, screenHeight){
    this.image = image;
    this.width = 32
    this.height = 32
    this.image = image
    this.x = Math.floor(Math.random()* (screenWidth-this.width))
    // this.x = (screenWidth/2) - this.width/2 
    this.y = 0
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.speed = Math.floor((Math.random() * 50) + 150); //range 150-200
    console.log("SPEED")
    console.log(this.speed)
  }

  fall(delta){
    if (this.y + this.height < screenHeight){
      this.y += this.speed * delta;
    }
  }
}


function createIngredient(){
  //TODO: put random shuffling into this? (not just strawberries)
  var ingredient = new Ingredient(strawb, screenWidth, screenHeight);
  
  return ingredient;
}

//handle movement and rendering
window.addEventListener("keydown", handleMove)
window.addEventListener("keyup", handleMove)

var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");
var player = new Player(image, screenWidth, screenHeight);
var text = document.getElementById("msg");
var keys = {};
var lastTime = 0;

var ingredients = [];
ingredients.push(createIngredient());
ingredients.push(createIngredient());
ingredients.push(createIngredient());

function checkCollision(ingredient){
  //if any of the four corners of the ingreident are inside the players box, then its a hit
  if (ingredient.x <= player.x + player.width && ingredient.x + ingredient.width >= player.x){
    if (ingredient.y <= player.y + player.height && ingredient.y + ingredient.height >= player.y){
      console.log(ingredient.x, player.x)
      text.innerHTML = "HIT";
      return true;
    }
  }
  return false;
}

function handleMove(e){
  keys[e.key] = e.type === 'keydown';
}

function loadHandler(){
  lastTime = performance.now();
  update();
}

function update(){
  let currentTime = performance.now();
  let deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (keys['d'] | keys["ArrowRight"])
  {
    if (player.x + player.width < screenWidth){
      text.innerHTML = "Right";
      player.x += player.speed * deltaTime;
    }
    
  }else if (keys['a'] | keys["ArrowLeft"]){
    if (player.x > 0){
      text.innerHTML = "Left";
      player.x -= player.speed * deltaTime;
    }
  }  
  
  var keep = [];
  for (let i = 0; i < ingredients.length; i++){
    ingredients[i].fall(deltaTime);
    if (checkCollision(ingredients[i])){
      ingredients.push(createIngredient());
    }else{
      keep.push(ingredients[i]);
    }
  }
  ingredients = keep;
  window.requestAnimationFrame(update);
  render();
}

function render()
{
  drawingSurface.clearRect(0,0, canvas.width, canvas.height);
  drawingSurface.drawImage
  (
  player.image, 
  player.x, player.y, player.width, player.height 
  )
  
  for (let i = 0; i < ingredients.length; i++){
    drawingSurface.drawImage
    (
    ingredients[i].image, 
    ingredients[i].x, ingredients[i].y, ingredients[i].width, ingredients[i].height
    )
  }
}


