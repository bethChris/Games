class Player  {
  constructor(image, screenWidth, screenHeight){
    this.width = 64
    this.height = 64
    this.image = image
    this.x = (screenWidth/2) - this.width/2 
    this.y = screenHeight - this.height
    this.speed = 200; 
    this.stack = [];
    this.topOfStack = this.y;
  }

  addLayer(ingredient){
    this.topOfStack -= this.height/3;
    var cakeLayer = new Layer(ingredient.cakeLayer, screenHeight, screenWidth, this.width, this.height/3, this.x, this.topOfStack)
    this.stack.push(cakeLayer);
  }

  clearStack(){
    this.stack = [];
    this.topOfStack = this.y;
  }

  draw(drawingSurface){
    //draw player
    drawingSurface.drawImage
    (
    this.image, 
    this.x, this.y, this.width, this.height 
    )

    //draw player stack
    for (let i = 0; i < this.stack.length; i++){
      this.stack[i].draw(drawingSurface)
    }
  }

  checkCollision(item){
    //considers it a hit only when item hits top stack/player
    if (item.x <= this.x + this.width && item.x + item.width >= this.x){
      if (item.y + item.height >= this.topOfStack && item.y + item.height <= this.topOfStack+5){ //TODO: decide if we like this
        console.log("CHEEKY");
        return true;
      }
    }
    return false;
  }
}

//TODO: maybe make these (player/ingredient) the same/inherit from similar template object?
class Ingredient {
  constructor(image, screenWidth, screenHeight, cakeLayer, cakeWidth){
    this.image = image;
    this.width = 32
    this.height = 32
    this.x = Math.floor(Math.random()* (screenWidth-this.width))
    this.y = 0
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.speed = Math.floor((Math.random() * 50) + 150); //range 150-200
    this.cakeLayer = cakeLayer;
    this.cakeWidth = cakeWidth;
    this.cakeHeight = this.height/2;
  }

  fall(delta){
    if (this.y <= screenHeight){
      this.y += this.speed * delta;
      return true;
    }
    return false;
  }

  draw(drawingSurface){
    drawingSurface.drawImage
    (
    this.image, 
    this.x, this.y, this.width, this.height
    )
  }
}

class Layer {
  constructor(image, screenWidth, screenHeight, width, height, x, y){
    this.image = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
  }

  draw(drawingSurface){
    drawingSurface.drawImage
    (
    this.image, 
    this.x, this.y, this.width, this.height
    )
  }
}


// initial game info
const screenWidth = 500;
const screenHeight = 500;
const levels = {
  1:{
    "numIngredients":3,
    "badSpawnRate": 0.25 //TODO: integrate this into makeIngredient()
  },
  2:{
    "numIngredients":4,
    "badSpawnRate": 0.25
  }
}
let curLevel = 0;
let levelStackHeightMax = 10;
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
  "bad.png",
  "chocolate.png"
];
const layerImages = [
  "strawbCake.png",
  "badCake.png",
  "chocoCake.png"
];
const playerImage = ["moo.png"];


function nextLevel(){
  curLevel += 1;

  if (curLevel > Object.keys(levels).length){
    return false;
  }else{
    setupLevel();
    return true;
  }
}


function setupLevel(){
  console.log("SET UP FOR " + curLevel)
  ingredients = [];
  player.clearStack();
  let numIngredients = levels[curLevel]["numIngredients"]
  let badSpawnRate = levels[curLevel]["badSpawnRate"]

  for (let i = 0; i < numIngredients; i++){
    ingredients.push(createIngredient(badSpawnRate))
  }
}


//initial set up functions
//FUNCTION: setUP()
//PURPOSE: sets up the game on load, calling preload/render and setting up the level
//IN: n/a
//OUT: n/a
function setUp(){
  // preload all images, 
  // then do an initial render
  // setup player and ingredients
  // add startbutton functionality
  preload(() =>{
    initialRender();
    nextLevel();
    document.getElementById('startButton').addEventListener('click', loadHandler);
  }) 
}


//FUNCTION: preload()
//PURPOSE: chains the preloadImage calls, 
//         sets up player, 
//         sets up ingredient choice list
//IN: 
//  callback: callback function
//OUT: n/a
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


//FUNCTION: initialRender()
//PURPOSE: initial render of all ingredient and layer images
//IN: n/a
//OUT: n/a
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


//FUNCTION: preloadImages()
//PURPOSE: loads all specified images then calls back to the previous function
//IN: 
//  sources: list of image locations
//  callback: callback function
//OUT: n/a
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


function createIngredient(badSpawnRate){
  var choice = Math.floor(Math.random()*ingredientChoices.length)
  var ingredient = new Ingredient(ingredientChoices[choice][0], screenWidth, screenHeight, ingredientChoices[choice][1], player.width);
  return ingredient;
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

function checkWin(){
  //TODO: do more when reach the final level
  if (player.stack.length > levelStackHeightMax){
    return !nextLevel();
  }
  return false;
  
}

//FUNCTION: update()
//PURPOSE: updates the position of all objects on screen before calling render(), 
//         adding/removing them if necessary
//IN: n/a
//OUT: n/a
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

  for (let i = 0; i < player.stack.length; i++){
    player.stack[i].x = player.x;
  }
  
  var keep = [];
  for (let i = 0; i < ingredients.length; i++){
    if (ingredients[i].fall(deltaTime)){
      if (player.checkCollision(ingredients[i])){
        keep.push(createIngredient());
        player.addLayer(ingredients[i])
      }else{
        keep.push(ingredients[i]);
      }
    }else{
      keep.push(createIngredient());
    }
    
  }
  ingredients = keep;

  
  if (checkWin()){
    text.innerHTML = "WIN!";
    ingredients = [];
    drawingSurface.clearRect(0,0, canvas.width, canvas.height);
  }else{
    window.requestAnimationFrame(update);
    render();
  }
  
}


//FUNCTION: render()
//PURPOSE: displays the images on the drawing surface, calls drawing functions of objects 
//IN: n/a
//OUT: n/a
function render()
{
  //clear screen
  drawingSurface.clearRect(0,0, canvas.width, canvas.height);

  //draw player
  player.draw(drawingSurface);
  
  //draw ingredients falling
  for (let i = 0; i < ingredients.length; i++){
    ingredients[i].draw(drawingSurface);
  }
}


