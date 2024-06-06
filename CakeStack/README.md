## Cake Stack

### Conceptual Overview

A player is anchored to the bottom of the screen with a plate above 
their head. Objects are coming down from the top of the screen. The goal 
is to collect items to create a cake. Collecting not cakable items 
causes you to lose points. 

### Gameplay Rules
- player can only collect a limited number of ingredients per level 
- each level has it's own point minimum the player must reach to progress
- each ingredient is worth a different amount of points 
- bad ingredients are worth negative points

### Technical Implementation
I want this to be a web app.

- javascript, html, css (maybe react?)


### Items
Good Ingredients:
- chocolate : double chocolate cake
- strawberry : strawberry short cake
- ice cream : ice cream cake
- lollipop : birthday cake
- carrot : carrot cake

Bad Ingredients:
- broccolli : gross green cake
- fish : tuna can
- trash : gross brown cake
- rubber duck : squished duck face cake
- traffic cone : road cake

### Preload 

- All images and other assets used throughout the game need to be preloaded onto the screen to ensure smooth gameplay
- All cake ingredients/layers need to be preloaded, and have an intial render. This will help the browser load it quicker and not cause lag in player movement.

### Objects
There are three main objects in this project. Their relationship is of the following:

- A player contains a stack of cake layers
- cake layers are created from ingredients


### Game Setup Variables
- **screenWidth**: screen width of the game (canvas width)
- **screenHeight**: screen height of the game (canvas height)
- **levels**: a dictionary of meta data for each level. Used during setUpLevel()
- **curLevel**: counter variable for tracking the current level
- **levelStackHeightMax**: stack height needed to pass a level
- **canvas**: the canvas object queried from the html document
- **drawingSurface**: a drawing surface object used to draw on the canvas and do animations
- **text**: a debug text field used to display state
- **keys**: a dictionary indicating which keys are in "keydown" state (T/F)
- **lastTime**: a timestamp variable used to track the last time update was called. Helps ensure smoother animation with time delta.
- **ingredientChoices**: a dictionary associating each ingredient to it's cake layer counterpart
- **ingredients**: a list of current ingredients on the screen
- **player**: the player object. (starts as null until preload is finished)
- **ingredientImages**: source locations for the ingredient images
- **layerImages**: source locations for the cake layer images
- **playerImage**: source location for the player image

### Time Log 
Better late than never

5/30/24 - worked on implementing preload/render since I noticed a lag in player movement on first swap from ingredient to cake layer

6/4/24 - worked on implementing the stack hit boxes and cake layer object. 

6/6/24 - added more documentation. Added basic level progression logic. 

### Potential Fixes/Improvements

- UI of cake stacks isn't seamless
- Get ingredients to not overlap when falling from top
- Randomize the drops of the ingredients instead of cycling?



