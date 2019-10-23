import * as rl from "readline-sync"

export enum TileType{
    X,
    O,
    EMPTY
}

export enum EndType{
    X,
    O,
    TIE,
    NONE
};

let tileToEndMap = new Map();
tileToEndMap.set(TileType.X, EndType.X);
tileToEndMap.set(TileType.O, EndType.O);
tileToEndMap.set(TileType.EMPTY, EndType.NONE);

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

export class Board {
    private tiles : TileType[][]

    constructor(board : Board = undefined) {
        this.tiles = [];

        if (board == undefined) {
            for (let i = 0; i < 3; i++) {
                this.tiles.push([]);
                for (let j = 0; j < 3; j++) {
                    this.tiles[i].push(TileType.EMPTY);
                }
            }
        } else {
            for (let i = 0; i < 3; i++) {
                this.tiles.push([]);
                for (let j = 0; j < 3; j++) {
                    this.tiles[i].push(board.getTile(i, j));
                }
            }
        }
    }

    public setO(i : number, j : number) : boolean {
        if (this.tiles[i][j] != TileType.EMPTY) return false;
        this.tiles[i][j] = TileType.O;
        return true;
    }

    public setX(i : number, j : number) : boolean {
        if (this.tiles[i][j] != TileType.EMPTY) return false;
        this.tiles[i][j] = TileType.X;
        return true;
    }

    // This function does not check if the move is valid beforehand
    public testMove(i : number, j : number, tileType : TileType) : EndType {
        let prevType = this.tiles[i][j];
        this.tiles[i][j] = tileType;
        let endType : EndType = this.checkEnd();
        this.tiles[i][j] = prevType;
        return endType;
    }

    public getTile(i : number, j : number) : TileType {
        return this.tiles[i][j];
    }

    public print() {
        console.log("-------------");
        for (let i = 0; i < 3; i++) {
            let rowString : string = "| ";
            for (let j = 0; j < 3; j++) {
                let tile = this.tiles[i][j];
                if (tile == TileType.EMPTY) {
                    rowString += "  | ";
                } else if (tile == TileType.O) {
                    rowString += "o | ";
                } else if (tile == TileType.X) {
                    rowString += "x | ";
                } else {
                    throw new Error(`Invalid tiles at ( ${i}, ${j} )`)
                }
            }
            console.log(rowString);
        }
        console.log("-------------");
    }


    public checkEnd() : EndType { // Return 2 for tie, 1 for X win, 0 for O win, -1 for no-win
        // check columns
        for (let i = 0; i < 3; i++) {
            let winingCol : boolean = true;
            let type : TileType = this.tiles[i][0];
            if (type == TileType.EMPTY) continue;
            
            for (let j = 1; j < 3; j++) {
                if (this.tiles[i][j] != type) {
                    winingCol = false;
                    break;
                }
            }
            if (winingCol) return tileToEndMap.get(type);
        }
        
        // check rows
        for (let i = 0; i < 3; i++) {
            let winingRow : boolean = true;
            let type : TileType = this.tiles[0][i];
            if (type == TileType.EMPTY) continue;

            for (let j = 1; j < 3; j++) {
                if (this.tiles[j][i] != type) {
                    winingRow = false;
                    break;
                }
            }
            if (winingRow) return tileToEndMap.get(type);
        }
        
        // check diagonals
        let winingD1 : boolean = true;
        let typeD1 : TileType = this.tiles[0][0];
        
        if (typeD1 != TileType.EMPTY) {
            for (let i = 1; i < 3; i++) {
                if (this.tiles[i][i] != typeD1) winingD1 = false;
            }
            if (winingD1) return tileToEndMap.get(typeD1);
        }
        
        let winingD2 : boolean = true;
        let typeD2 : TileType = this.tiles[2][0];
        if (typeD2 != TileType.EMPTY) {
            for (let i = 1; i < 3; i++) {
                if (this.tiles[2-i][i] != typeD2) winingD2 = false;
            }
            if (winingD2) return tileToEndMap.get(typeD2);
        }
        
        let boardFull : boolean = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.tiles[i][j] == TileType.EMPTY) boardFull = false;
            }
        }        
        if (boardFull) return EndType.TIE;

        return EndType.NONE;
    }
}

class Move {
    public row : number;
    public col : number;
}

function playerPrompt() : string {
    return rl.question("Enter coordinates of your next move (Eg: 0 2): ");
}


export function getPlayerMove(board : Board, playerInput : string) : Move {
        let answerSplit : string[] = playerInput.split(" ");
        if (answerSplit.length != 2) return undefined;

        let row : number = parseInt(answerSplit[0]);
        let col : number = parseInt(answerSplit[1]);

        if (isNaN(row) || row < 0 || row > 2) return undefined;
        if (isNaN(col) || col < 0 || col > 2) return undefined;

        if(board.getTile(row, col) != TileType.EMPTY) return undefined;

        return {row: row, col: col};
}


function playGame(board : Board, ai : (board : Board) => Move) : EndType { 
    // Game loop
    let endType : number;
    let gameOver : boolean = false;
    while (!gameOver) {

        board.print();
        console.log("");
        
        let playerMove : Move = getPlayerMove(board, playerPrompt());
        while (playerMove == undefined) {
            console.log("Invalid move");
            playerMove = getPlayerMove(board, playerPrompt());
        }
        
        board.setX(playerMove.row, playerMove.col);
        endType = board.checkEnd();
        if (endType != EndType.NONE) break;
        
        console.log("\nComputer's turn...\n");
        
        let cpuMove : Move = ai(board);
        board.setO(cpuMove.row, cpuMove.col);
        endType = board.checkEnd();
        if (endType != EndType.NONE) break;
    }

    board.print();
    console.log("");

    return endType;
}

function linearAI(board : Board) : Move {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.getTile(i, j) == TileType.EMPTY) return {row : i, col : j};
        }
    }
    throw "AI ERROR, NO VALID MOVES";
}

function noWinAI(board : Board) : Move {
    let testBoard : Board = new Board(board);
    let lastValid : Move = undefined;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.getTile(i, j) == TileType.EMPTY) { // check if move is valid
                lastValid = {row : i, col : j};
                if (testBoard.testMove(i,j, TileType.X) == EndType.X) continue; // check if we would block an X victory
                if (testBoard.testMove(i,j, TileType.O) == EndType.O) continue; // check if we would win
                return lastValid;
            }
        }
    }
    if (lastValid == undefined) throw "AI ERROR, NO VALID MOVES";
    return lastValid;
}

function dumbTryWinAI(board : Board) : Move {
    let testBoard : Board = new Board(board);
    let lastValid : Move = undefined;
    let xBlock : Move = undefined;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.getTile(i, j) == TileType.EMPTY) { // check if move is valid
                lastValid = {row : i, col : j};
                if (testBoard.testMove(i,j, TileType.O) == EndType.O) return lastValid; // check if we would win
                if (testBoard.testMove(i,j, TileType.X) == EndType.X) xBlock = lastValid; // check if we would block an X victory
            }
        }
    }
    if (lastValid == undefined) throw "AI ERROR, NO VALID MOVES";
    if (xBlock != undefined) return xBlock;
    return lastValid;
}


let board : Board = new Board;

console.log("Which AI do you want to play:\n1. Clueless AI\n2. An AI that tries to lose\n3. An AI that tries to win\n");

let ai : (board : Board) => Move = undefined;
while (ai == undefined) {
    let aiAns : string = rl.question("Ai: ");
    let aiInt : number = parseInt(aiAns);
    if (isNaN(aiInt)) {
        console.log("Invalid input");
        continue;
    }

    if (aiInt == 1) ai = linearAI;
    else if (aiInt == 2) ai = noWinAI;
    else if (aiInt == 3) ai = dumbTryWinAI;
}


let endType : EndType = playGame(board, ai);
if (endType == EndType.X) console.log("You Win!");
else if (endType == EndType.O) console.log("CPU Wins!");
else if (endType ==EndType.TIE) console.log("Tie...");