# Typescript Tic-tac-toe

A console tic-tac-toe game I made to practice for a Triplebyte interview. From start to finish it took ~1h 20m.

To play just `npm i` and `ts-node tictactoe.ts`

Sample output:

```
> ts-node tictactoe.ts  
Which AI do you want to play: 
1. Clueless AI
2. An AI that tries to lose
3. An AI that tries to win

Ai: 3 
------------- 
|   |   |   |
|   |   |   |
|   |   |   |
-------------

Enter coordinates of your next move (Eg: 0 2): 1 1 

Computer's turn...

-------------
|   |   |   |
|   | x |   |
|   |   | o |
-------------

Enter coordinates of your next move (Eg: 0 2): 1 2 

Computer's turn...

-------------
|   |   |   |
| o | x | x |
|   |   | o |
-------------

Enter coordinates of your next move (Eg: 0 2): 0 2 

Computer's turn...

-------------
|   |   | x |
| o | x | x |
| o |   | o |
-------------

Enter coordinates of your next move (Eg: 0 2): 0 0 

Computer's turn...

-------------
| x |   | x |
| o | x | x |
| o | o | o |
-------------

CPU Wins!
```
