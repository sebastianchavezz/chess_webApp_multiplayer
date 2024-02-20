
const customizeBoard = (board: string[][], playerColor: string): string[][] => {
  if (!playerColor){
    return  formatBoard_to_return(reverseBoard(switchCase(board)));
  }
  return formatBoard_to_return(board);
};

export function formatBoard_to_return(boardString: string[][]): string[][] {
  // get rid of all the spaces
  const formattedBoard = boardString.map(row => row.map(piece => piece.trim()));
  return formattedBoard;
}

export function switchCase(board: string[][]): string[][] {
  return board.map(row => row.map(piece => {
    if (piece === '') {
      return ''; // Keep empty squares as they are
    } else if (piece === piece.toLowerCase()) {
      return piece.toUpperCase(); // Switch to uppercase if it's currently lowercase
    } else {
      return piece.toLowerCase(); // Switch to lowercase if it's currently uppercase
    }
  }));
}
export function reverseBoard(board: string[][]): string[][] {
  return [...board].reverse(); // Reverse the order of rows
}

export function printBoard(board: string[][]): void {
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

export function printLine():void{
  console.log('---------------------------------------------------');
}