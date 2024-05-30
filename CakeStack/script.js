class Player  {
  constructor(image, screenWidth, screenHeight){
    this.width = 64
    this.height = 64
    this.image = image
    this.x = (screenWidth/2) - this.width/2 
    this.y = screenHeight - this.height
    this.speed = 200; 
    this.stack = [];
    // this.addLayer(image)
  }

  addLayer(item){
    this.stack.push(item)
  }
}

//TODO: maybe make these (player/ingredient) the same/inherit from similar template object?
class Ingredient {
  constructor(image, screenWidth, screenHeight, cakeLayer){
    this.image = image;
    this.width = 32
    this.height = 32
    this.image = image
    this.x = Math.floor(Math.random()* (screenWidth-this.width))
    this.y = 0
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.speed = Math.floor((Math.random() * 50) + 150); //range 150-200
    this.cakeLayer = cakeLayer;
  }

  fall(delta){
    if (this.y + this.height < screenHeight){
      this.y += this.speed * delta;
    }
  }
}

// initial game info
const screenWidth = 500;
const screenHeight = 750;

var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");
var text = document.getElementById("msg");

var keys = {};
var lastTime = 0;
var ingredientChoices = [];
var ingredients = [];
var player = null;

const ingredientImages = [
  "strawberry.png",
  "bad.png"
];

const layerImages = [
  "strawbCake.png",
  "badCake.png"
];

const playerImage = ["moo.png"];


//initial set up functions
function setUp(){
  // preload all images, 
  // then do an initial render
  // setup player and ingredients
  // add startbutton functionality
  preload(() =>{
    initialRender();
    // player = new Player()
    ingredients.push(createIngredient());
    ingredients.push(createIngredient());
    ingredients.push(createIngredient());
    document.getElementById('startButton').addEventListener('click', loadHandler);
  }) 
}

function preload(callback){
  preloadImages(ingredientImages, (loadedImages) => {
    for (let i = 0; i < loadedImages.length; i++){
      ingredientChoices[i] = [loadedImages[i]];
    }
    console.log("Preloaded Ingredients");
    preloadImages(layerImages, (loadedImages) => {
      for (let i = 0; i < loadedImages.length; i++){
        ingredientChoices[i].push(loadedImages[i]);
      }
      console.log("Preloaded Layers");
      preloadImages(playerImage, (loadedImages) => {
        player = new Player(loadedImages[0], screenWidth, screenHeight);
        console.log("Preloaded Player");
        callback()
      })
    
    })
    
  })
}

function initialRender(){
  for (let i = 0; i < ingredientChoices.length; i++){
    drawingSurface.drawImage
    (
    ingredientChoices[i][0], 
    0, 0, 32, 32
    )

    drawingSurface.drawImage
    (
    ingredientChoices[i][1], 
    0, 0, 32, 32
    )
    drawingSurface.clearRect(0,0, canvas.width, canvas.height);
  }
  render();
  console.log("Finished Initial Render");
}


//preload images
function preloadImages(sources, callback) {
  let loadedImages = 0;
  let numImages = sources.length;
  let images = [];

  for (let i = 0; i < numImages; i++) {
    images[i] = new Image();
    images[i].onload = () => {
      loadedImages++;
      if (loadedImages === numImages) {
        console.log(images)
        callback(images);
      }
    };
    images[i].src = sources[i];
  }
}

//initial set up call
setUp();

function createIngredient(){
  var choice = Math.floor(Math.random()*ingredientChoices.length)
  console.log(choice)
  var ingredient = new Ingredient(ingredientChoices[choice][0], screenWidth, screenHeight, ingredientChoices[choice][1]);
  
  return ingredient;
}

function checkCollision(ingredient){
  //if any of the four corners of the ingreident are inside the players box, then its a hit
  if (ingredient.x <= player.x + player.width && ingredient.x + ingredient.width >= player.x){
    if (ingredient.y <= player.y + player.height && ingredient.y + ingredient.height >= player.y){
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
  window.addEventListener("keydown", handleMove);
  window.addEventListener("keyup", handleMove);
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
      player.addLayer(ingredients[i].cakeLayer)
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

  //TODO: is this better to do in a loop or have each cake layer know it's position?
  for (let i = 0; i < player.stack.length; i++){
    drawingSurface.drawImage
    (
    player.stack[i], 
    player.x, player.y - ((i+1)*player.height/3), player.width, player.height/3
    )
  }
  
  for (let i = 0; i < ingredients.length; i++){
    drawingSurface.drawImage
    (
    ingredients[i].image, 
    ingredients[i].x, ingredients[i].y, ingredients[i].width, ingredients[i].height
    )
  }
}


