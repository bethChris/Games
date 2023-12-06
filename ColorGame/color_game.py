import tkinter as tk
import random


# Define the game constants
WINDOW_WIDTH = 500
WINDOW_HEIGHT = 500
PIXEL_SIZE = WINDOW_HEIGHT // 5
TOTAL_PIXELS = (WINDOW_HEIGHT // PIXEL_SIZE) * (WINDOW_WIDTH // PIXEL_SIZE)
COLORS = ["#272727", "#BB999C", "#A53F2B", "#3F88C5", "#7E2E84"]

# Define pixel class
class Pixel:
    def __init__(self, square):
        self.square = square
        self.location = (square.grid_info()['row'], square.grid_info()['column'])
        self.cur_color = COLORS.index(square.cget("bg"))

    # Define the function to change the color of the pixel
    def change_color(self, color):
        self.square.configure(bg=color)
        self.cur_color = COLORS.index(color)

# Define player class
class Player:
    def __init__(self):
        self.pixels = []
        self.color = 0

    def add_pixel(self, pixel):
        if len(self.pixels) == 0:
            self.color = pixel.cur_color
        self.pixels.append(pixel)

    def change_color(self, event, all_pixels, opponent_pixels, color):
        opponent_color = COLORS[opponent_pixels[0].cur_color]
        print(opponent_color, color, COLORS[self.color])
        if opponent_color != color and color != COLORS[self.color]: # cannot play the same color as opponent is currently or the color player currently is
            self.color = COLORS.index(color)
            for pixel in self.pixels:
                pixel.change_color(color)

            self.update_pixels(all_pixels, opponent_pixels)
            return True
        else:
            return False
    
    def update_pixels(self, all_pixels, opponent_pixels):
        all_pixel_locations = {f'{p.location}' : p for p in all_pixels}

        for ps in self.pixels:
            location = ps.location
            checks = [(location[0] + PIXEL_SIZE, location[1]), 
                      (location[0] - PIXEL_SIZE, location[1]), 
                      (location[0], location[1] + PIXEL_SIZE), 
                      (location[0], location[1] - PIXEL_SIZE)]
            
            for check in checks:
                test_location = f'({check[0]}, {check[1]})' #row, column
                if test_location in all_pixel_locations.keys():
                    pixel = all_pixel_locations[test_location]
                    if pixel not in self.pixels and pixel not in opponent_pixels:
                        if pixel.square.cget("bg") == COLORS[self.color]:
                            self.add_pixel(pixel)
                            self.update_pixels(all_pixels, opponent_pixels)

# Define game board class
class Board:
    def __init__(self, width, height, pixel_size):
        self.width = width
        self.height = height
        self.pixel_size = pixel_size
        self.pixels = []
        self.board = tk.Tk()

    def get_root(self):
        return self.board
    
    def get_pixels(self):
        return self.pixels
    
    def create_new_board(self, old_board=None):
        if old_board:
            root = old_board
        else:
            root = tk.Tk()

        all_pixels = []
        for i in range(0, self.height, self.pixel_size):
            for j in range(0, self.width, self.pixel_size):
                random_color = COLORS[random.randint(0, len(COLORS) - 1)]
                square = tk.Frame(root, width=PIXEL_SIZE, height=self.pixel_size, bg=random_color)
                square.grid(row=i, column=j)
                all_pixels.append(Pixel(square))

        self.board = root
        self.pixels = all_pixels  

# Define game class
class Game:
    def __init__(self, board, p1, p2):
        self.p1 = p1
        self.p2 = p2
        self.game_root = tk.Tk()
        self.board = board
        self.turn_count = 0
        self.buttons = []
        self.current_player = p1
        self.opponent = p2
    
    def start(self):
        #initialize starter variables
        self.turn_count = 0
        self.p1.pixels = []
        self.p2.pixels = []
        board = self.board
        pixels = self.board.get_pixels()

        #initalize starter positions and beginning pixels
        self.p1.add_pixel(pixels[0])
        self.p2.add_pixel(pixels[len(pixels)-1])
        self.p1.update_pixels(pixels, self.p2.pixels)
        self.p2.update_pixels(pixels, self.p1.pixels)

        #create additional game UI
        self.create_buttons()
        self.create_score_board()
        self.create_reset_buttons()

        #start game loop
        board.get_root().after(750, self.checkEnd())
        board.get_root().mainloop()
    
    def reset(self):
        self.turn_count = 0
        self.p1.pixels = []
        self.p2.pixels = []
        self.current_player = self.p1
        self.opponent = self.p2
        self.board.create_new_board(self.board.get_root())
        self.start()        

    def create_buttons(self):
        buttons = []
        color_panel = tk.Frame(self.board.get_root())
        color_panel.grid(row=WINDOW_HEIGHT, columnspan=WINDOW_WIDTH)

        for i in range(len(COLORS)):
            color = COLORS[i]
            button = tk.Button(color_panel, bg=color, width=5, height=3)
            button.grid(row=0, column=i)
            button.bind("<Button-1>", lambda event, color=color: self.player_swap(event, color))
            buttons.append(button)

        self.buttons = buttons

    def create_reset_buttons(self):
        reset_panel = tk.Frame(self.board.get_root())
        reset_panel.grid(row=WINDOW_HEIGHT + 1, columnspan=WINDOW_WIDTH)
        reset_button = tk.Button(reset_panel, text="Reset")
        reset_button.bind("<Button-1>", lambda event: self.reset())
        reset_button.grid(row=WINDOW_HEIGHT, column=WINDOW_WIDTH//2)

    def create_score_board(self):
        p1_score = tk.Label(self.board.get_root(), text=f"Player 1: {len(self.p1.pixels)}")
        p1_score.grid(row=0, column=WINDOW_WIDTH)

        p2_score = tk.Label(self.board.get_root(), text=f"Player 2: {len(self.p2.pixels)}")
        p2_score.grid(row=PIXEL_SIZE, column=WINDOW_WIDTH)

    # checks if the end of the game occurred
    def checkEnd(self):
        self.create_score_board()

        if len(self.p1.pixels) + len(self.p2.pixels) == TOTAL_PIXELS:
            # end game
            game_over = tk.Label(self.board.get_root(), text="Game Over!")
            game_over.grid(row=2*PIXEL_SIZE, column=WINDOW_WIDTH)

            winner = "Player 1" if len(self.p1.pixels) > len(self.p2.pixels) else "Player 2"
            winner_text = tk.Label(self.board.get_root(), text=f"{winner} wins!")
            winner_text.grid(row=3*PIXEL_SIZE, column=WINDOW_WIDTH)
        else:
            self.board.get_root().after(750, lambda: self.checkEnd())

    # swap the players controls of the buttons
    def player_swap(self, event, color):
        change = self.current_player.change_color(event, self.board.get_pixels(), self.opponent.pixels, color)
        if change : self.rebind()

    # rebind the buttons based on players turn
    def rebind(self):
        temp = self.current_player
        self.current_player = self.opponent
        self.opponent = temp
        self.turn_count += 1
        for button in self.buttons:
            color = button.cget("bg")
            button.bind("<Button-1>", lambda event, color=color: self.player_swap(event, color))

# Create the game
pixel_board = Board(WINDOW_WIDTH, WINDOW_HEIGHT, PIXEL_SIZE)
pixel_board.create_new_board()
player1 = Player()
player2 = Player()
pixel_game = Game(pixel_board, player1, player2)
pixel_game.start()










