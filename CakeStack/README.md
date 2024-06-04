## Cake Stack

### Conceptual Overview

A player is anchored to the bottom of the screen with a plate above 
their head. Objects are coming down from the top of the screen. The goal 
is to collect items to create a cake. Collecting not cakable items 
causes you to lose a life. 

### Technical Implementation
I want this to be a web app.

- javascript, html, css (maybe react?)


### Preload 

- All images and other assets used throughout the game need to be preloaded onto the screen to ensure smooth gameplay
- All cake ingredients/layers need to be preloaded, and have an intial render. This will help the browser load it quicker and not cause lag in player movement.

### Objects
There are three main objects in this project. Their relationship is of the following:

- A player contains a stack of cake layers
- cake layers are created from ingredients

### Time Log 
Better late than never

5/30/24 - worked on implementing preload/render since I noticed a lag in player movement on first swap from ingredient to cake layer

6/4/24 - worked on implementing the stack hit boxes and cake layer object. 


### Potential Fixes/Improvements

- UI of cake stacks isn't seamless
- Get ingredients to not overlap when falling from top



