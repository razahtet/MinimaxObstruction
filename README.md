# SupremeObstruction
### Live Demo: https://minimaxobstruction.netlify.app/
The web version of the Obstruction pencil and paper game, where two players must occupy the most spaces of the board at the end. The player wins if they are the last player to occupy a space on the board.

## How To Play
- A player can click on a box to occupy it if it is not occupied by themselves or another player.
- When clicked, the boxes adjacent to it will also be occupied if they have not already been occupied.
- To win, a player must be the last to click to occupy boxes, where on the next turn, there are no more spaces left to be occupied by anyone. 

## How the Difficulty Levels Work
- The computer uses the Minimax algorithm to determine the next possible move against the player, based on the difficulty level it is in (easy, medium, and hard).
- For the easy and medium difficulty levels, the Minimax algorithm is adjusted to return lower scores to allow the computer to make suboptimal moves.

## Notes and Instructions
- The user can select between two options: playing against another human on the same computer or playing against a computer and selecting the difficulty mode. 
- If the number of spaces left on the board is too large, minimax isn't used so that the computer doesn't take too long to find the best move. Therefore, 6 x 6 is the most optimal.
- The board size can be changed from 1 X 1 to 12 X 12. Press "Submit new dimensions" to restart the game and change the size of the board.
- Pressing "Let the Computer go first" restarts the game and lets the computer go first. Pressing the same button after restarts the game and lets the player go first.
- Press "Restart" to restart the game
