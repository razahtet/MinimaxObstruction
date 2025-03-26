# SupremeObstruction
- Web-based game called Obstruction where two players must occupy the most spaces of the board at the end.
- The Minimax algorithm is used for optimal decision-making so that the computer can play against a human player flawlessly.
- Implemented the difficulty levels (easy, medium, and impossible) by adjusting the Minimax algorithm to return lower scores for easier modes allowing the computer to make suboptimal moves.
- If the number of spaces on the board is too large, minimax isn't being used so the program doesn't take too long. Therefore, 6 x 6 is the most optimal.
- When playing, the player can only click on a box that has not been occupied by any player and when clicked, the boxes not already occupied by players spaces adjacent horizontally, vertically, and diagonally will become occupied by that player. 
- The player wins if they are the last player to occupy a space on the board.
- The board size can be changed from 1 X 1 to 12 X 12. Press "submit new dimensions" to restart the game and change the size of the board.
- Press "Restart" to restart the game, and pressing "Let the Computer go first" in one of the computer game modes also restarts the game, but lets the computer go first.

Live demo: https://minimax-obstruction.glitch.me/
