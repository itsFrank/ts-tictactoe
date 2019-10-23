import { Board, getPlayerMove, TileType, EndType } from "./tictactoe"

// Testing file to unit test my classes as I was developing

// Testing board win conditions
let board : Board;

console.log("testing win conditions");

// Test X win on row 1
board  = new Board();
board.setX(1,0)
board.setX(1,1)
board.setX(1,2)

if (board.checkEnd() != EndType.X) {
    board.print();
    throw Error("Error, row 1 full, should have had and X win");
}

// Test O win on col 2
board  = new Board();
board.setO(0,2);
board.setO(1,2);
board.setO(2,2);

if (board.checkEnd() != EndType.O) {
    board.print();
    throw Error("Error, col 2 full, should have had an O win");
}

// Test X Win on diagonal 2
board  = new Board();
board.setX(0,2);
board.setX(1,1);
board.setX(2,0);

if (board.checkEnd() != EndType.X) {
    board.print();
    throw Error("Error, diagonal 2 full, should have had an X win");
}

// Test no Win 
board  = new Board();
board.setX(0,1);
board.setX(0,2);
board.setX(1,2);

board.setO(1,0);
board.setO(2,0);
board.setO(2,1);

if (board.checkEnd() != EndType.NONE) {
    board.print();
    throw Error("Error, no full lines, should have had no wins");
}

// Test Tie 
board  = new Board();
board.setX(0,0);
board.setX(0,2);
board.setX(1,2);
board.setX(2,0);
board.setX(2,1);

board.setO(0,1);
board.setO(1,0);
board.setO(1,1);
board.setO(2,2);

if (board.checkEnd() != EndType.TIE) {
    board.print();
    throw Error("Error, no full lines, should have had no wins");
}

// end testing win conditions

// begin testing player move prompt
console.log("move parsing and validity checks");
board  = new Board();
board.setX(2, 1);
if (getPlayerMove(board, "hello how") != undefined) throw Error("Error, strings are not valid moves")
if (getPlayerMove(board, "1") != undefined) throw Error("Error, must have two values separated by space")
if (getPlayerMove(board, "-1 0") != undefined) throw Error("Error, Values must be within board")
if (getPlayerMove(board, "1 3") != undefined) throw Error("Error, Values must be within board")
if (getPlayerMove(board, "2 1") != undefined) throw Error("Error, target tile must not be occupied")

let validMove:any = getPlayerMove(board, "1 2");
if ( validMove == undefined) throw Error("Error, should be a valid move")
if (validMove.row != 1) throw Error("Error, move row should be 1")
if (validMove.col != 2) throw Error("Error, move col should be 2")

console.log("SUCCESS");
