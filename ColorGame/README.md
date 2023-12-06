# Color Square Game

Hello! This is a simple color game I made using Github Copilot. I wanted to explore what the tool could do by having it help me build a two player territory capture game using a library I've never used before. (Tkinter)

## How to Run
All code is in 'color_game.py'. You can use the command line or run it in your preferred IDE. To use with the command line run:

> $ python color_game.py

A window will pop open and you can begin the game. 

NOTE: There is currently a bug (fix in progress) that causes 2 extra little windows to pop up. Closing these or leaving them open will not harm game play.

## How to Play

### Set up
- 1st Player starts in the top left hand corner square

- 2nd Player starts in the bottom right hand corner square

- 1st player will play first

### Turn Structure
- Click on a new color to change your territory to
    - Cannot be the same color as your opponent, or your current color.
    - You must choose a color to change to, even if changing does not result in any new captured squares.
- Now it's the other players turn.

### Capture Rules
- To capture more squares, change the color of your territory to be the same as squares your territory is adjacent to. 

> EXAMPLE: If your territory is blue and it's  touching 3 red squares, you can change to red and claim those 3 squares.

### Win Conditions
- The game continues until all squares are claimed
- The winner is the player with the most squares captured.
    - Current totals are updated as you play on the right hand side of the screen.

