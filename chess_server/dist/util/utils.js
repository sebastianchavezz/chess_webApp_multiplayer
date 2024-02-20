"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printLine = exports.printBoard = exports.reverseBoard = exports.switchCase = exports.formatBoard_to_return = void 0;
const customizeBoard = (board, playerColor) => {
    if (!playerColor) {
        return formatBoard_to_return(reverseBoard(switchCase(board)));
    }
    return formatBoard_to_return(board);
};
function formatBoard_to_return(boardString) {
    // get rid of all the spaces
    const formattedBoard = boardString.map(row => row.map(piece => piece.trim()));
    return formattedBoard;
}
exports.formatBoard_to_return = formatBoard_to_return;
function switchCase(board) {
    return board.map(row => row.map(piece => {
        if (piece === '') {
            return ''; // Keep empty squares as they are
        }
        else if (piece === piece.toLowerCase()) {
            return piece.toUpperCase(); // Switch to uppercase if it's currently lowercase
        }
        else {
            return piece.toLowerCase(); // Switch to lowercase if it's currently uppercase
        }
    }));
}
exports.switchCase = switchCase;
function reverseBoard(board) {
    return [...board].reverse(); // Reverse the order of rows
}
exports.reverseBoard = reverseBoard;
function printBoard(board) {
    for (let i = 0; i < board.length; i++) {
        let rowString = '|';
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
                board[i][j] = ' ';
            }
            rowString += board[i][j] + '|';
        }
        console.log(rowString.trim());
    }
}
exports.printBoard = printBoard;
function printLine() {
    console.log('---------------------------------------------------');
}
exports.printLine = printLine;
