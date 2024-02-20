<!-- src/components/chessBoard.vue -->
<template>
  <div class="container">
    <div class="opponent-info" v-if="localOpponentName">
      <p class="info-label">Opponent's Name:</p>
      <p class="info-value">{{ localOpponentName }}</p>
    </div>
    <div class="chessboard-container">
      <div v-for="(row, rowIndex) in matrix" :key="rowIndex" class="row">
        <div
          v-for="(value, colIndex) in row"
          :key="colIndex"
          :class="{ 'square': true, 'brown-ish': isBrownishTile(rowIndex, colIndex) }"
          @click="handleSquareClick(rowIndex, colIndex)"
        >
        <div  class="piece-wrapper">
          <transition name="piece-fade" mode="out-in">
          <img v-if="value !== '.'" :src="getImagePath(value)" alt="Chess Piece" class="animated-piece">
          </transition >
          </div>
        </div>
      </div>
    </div>
    <div class="info-container">
      <div class="player-info">
        <p class="info-label">Your Name:</p>
        <p class="info-value">{{ playerName }}</p>
      </div>
      <div class="room-info">
        <p class="info-label">Game Room ID:</p>
        <p class="info-value">{{ roomId }}</p>
      </div>
      <div>

        <p class="info-value" v-if="isCheck"> {{CHECK}}</p>
        <p class="info-value" v-if="isCheckmate"> {{CHECKMATE}}</p>
        <p class="info-value" v-if="isStalemate"> {{STALEMATE}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

function customizeBoard (board, playerColor)  {
  if (!playerColor){
    return  switchCaseAndReverse(board);
  }
  return board;
}

function formatBoard_to_return(boardString) {
  // get rid of all the spaces
  let formattedBoard = boardString.map(row => row.map(piece => piece.trim()));
  return formattedBoard;
}


function switchCaseAndReverse(board) {
  return board.map(row => row.map(piece => {
    if (piece === '.') {
      return '.'; // Keep empty squares as they are
    } else if (piece === piece.toLowerCase()) {
      return piece.toUpperCase(); // Switch to uppercase if it's currently lowercase
    } else {
      return piece.toLowerCase(); // Switch to lowercase if it's currently uppercase
    }
  })).reverse().map(row => row.reverse());
}

export default {
  props: {
    playerName: String,
    roomId: String,
    playerColor: Boolean,
    initialBoard: Array,
    gameId: String,
    opponentName: String,
  },
  created() {
    this.matrix = formatBoard_to_return(this.matrix);
    console.table(this.matrix);
    this.localOpponentName = this.opponentName;
    this.socket = io('http://localhost:3001');


    // Listen for 'playerJoined' events from the server
    this.socket.on('playerJoined', (data) => {
      this.localOpponentName = data.opponentName;
      console.log('Opponent Name:', this.localOpponentName);
    });

    // Listen for 'playerCreated' events from the server
    this.socket.on('playerCreated', (data) => {
      this.creatorName = data.playerName;
      console.log('Creator Name:', this.creatorName);
    });
    // Listen for 'update' events from the server
    this.socket.on('boardState', (data) => {
      this.matrix = this.customizeBoard(data.board, this.playerColor);
    });

    // Periodically poll the API for updates (optional)
    this.pollingInterval = setInterval(() => {
      // Perform any additional periodic tasks if needed
    }, 1000); // Poll every 1 second (adjust as needed)
  },
  unmounted() {
    // Clear the polling interval when the componement is destroyed
    clearInterval(this.pollingInterval);
  },
  data() {
    return {
      matrix: this.initialBoard,
      selectedPiece: null,
      selectedPiecePosition: { row: -1, col: -1 },
      pollingInterval: null,
      socket: null, // Store the socket connection
      localOpponentName: '',
      firstClick: true,
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      RookMoved_ks: false,
      RookMoved_qs: false,
      kingMoved   : false,
    };
  },
  computed: {
    isBrownishTile() {
      return (rowIndex, colIndex) => (rowIndex + colIndex) % 2 === 1;
    },
  },
  methods: {
    getImagePath(piece) {
      // Map the piece value to the corresponding image path based on the playerColor
      if (piece === 'R') return this.playerColor ===  true? require('@/assets/rook1.png') : require('@/assets/rook.png');
      else if (piece === 'N') return this.playerColor === true ? require('@/assets/knight1.png') : require('@/assets/knight.png');
      else if (piece === 'B') return this.playerColor ===  true ? require('@/assets/bishop1.png') : require('@/assets/bishop.png');
      else if (piece === 'Q') return this.playerColor === true ? require('@/assets/queen1.png') : require('@/assets/queen.png');
      else if (piece === 'K') return this.playerColor === true ? require('@/assets/king1.png') : require('@/assets/king.png');
      else if (piece === 'P') return this.playerColor ===  true? require('@/assets/pawn1.png') : require('@/assets/pawn.png');
      else if (piece == 'r') return this.playerColor == true ? require('@/assets/rook.png') : require('@/assets/rook1.png');
      else if (piece == 'n') return this.playerColor ==  true? require('@/assets/knight.png') : require('@/assets/knight1.png');
      else if (piece == 'b') return this.playerColor ==  true? require('@/assets/bishop.png') : require('@/assets/bishop1.png');
      else if (piece == 'q') return this.playerColor ==  true? require('@/assets/queen.png') : require('@/assets/queen1.png');
      else if (piece == 'k') return this.playerColor ==  true? require('@/assets/king.png') : require('@/assets/king1.png');
      else if (piece == 'p') return this.playerColor ==  true? require('@/assets/pawn.png') : require('@/assets/pawn1.png');
      else return '.';
    },
    handleSquareClick(rowIndex, colIndex) {
      if (this.firstClick){
        const allyPiece = this.matrix[rowIndex][colIndex];
        console.log('firts ally Clicked Piece:', allyPiece);
        console.log('first Selected Piece:', this.selectedPiece);
        //first click can be only lowercase letter or empty square
        if(allyPiece !== '.' && allyPiece === allyPiece.toLowerCase()){
          this.selectedPiece = allyPiece;
          this.selectedPiecePosition = { row: rowIndex, col: colIndex };
          console.log('first ally Clicked Piece in IF statement:', allyPiece);
          console.log('first Selected Piece in IF statement:', this.selectedPiece);
          this.firstClick = false;
        }
      }else{
        const opponentPiece = this.matrix[rowIndex][colIndex];
        console.log('rowIndex:', rowIndex);
        console.log('colIndex:', colIndex);
        console.log('Second Opp Clicked Piece:', opponentPiece);
        console.log('Selected Piece:', this.selectedPiece);  
        if (opponentPiece === opponentPiece.toLowerCase() && opponentPiece != '.'){
          this.selectedPiece = opponentPiece;
          this.selectedPiecePosition = { row: rowIndex, col: colIndex };
          console.log('if opponent=== toLowercase:', this.selectedPiece);
        }
        else if(this.selectedPiece && (opponentPiece === opponentPiece.toUpperCase()) || opponentPiece === '.'){
          console.log('Second opp Clicked Piece in ELIF statement:', opponentPiece);
          console.log('Second Selected Piece in ELIF statement:', this.selectedPiece);
          
          this.isValidMove(rowIndex, colIndex)
            .then((response) => {
              if (response.isValidMove) {
                // JUST RENDER THE MATRIX, THE BOARD IS UPDATED IN THE BACKEND
                this.matrix = this.customizeBoard(response.board);
                this.isCheck= response.isCheck;
                this.isCheckmate = response.isCheckmate;
                this.isStalemate = response.isStalemate;
                this.RookMoved_ks = response.kingSide;
                this.RookMoved_qs = response.queenSide;
                this.kingMoved = response.kingMoved;
                console.log('Valid move:');
              } else {
                console.error('Invalid move:', response.error);
                // Handle invalid move error if needed
              }
            })
            .catch((error) => {
              console.error('Error validating move:', error);
              // Handle other errors if needed
            });
        this.firstClick = true;
        this.selectedPiece = null;
        }
      }
  },
    customizeBoard(board) {
      return customizeBoard(board, this.playerColor);
    },
    isValidMove(targetRow, targetCol) {
      const moveDetails = {
        board: this.matrix,
        color: this.playerColor,
        roomId: this.roomId,
        from: { row: this.selectedPiecePosition.row, col: this.selectedPiecePosition.col },
        to: { row: targetRow, col: targetCol },
        kingSide: this.RookMoved_ks,
        queenSide: this.RookMoved_qs,
        kingMoved: this.kingMoved,
      };

      return new Promise((resolve) => {
        console.log('Validating move:', moveDetails);
        this.socket.emit('validateMoveSocket', moveDetails, (response) => {
          if (response.isValidMove) {
            // Customize the board based on the player's color
            this.matrix = this.customizeBoard(response.board);
            this.isCheck = response.isCheck;
            this.isCheckmate = response.isCheckmate;
            this.isStalemate = response.isStalemate;
            this.RookMoved_ks = response.kingSide;
            this.RookMoved_qs = response.queenSide;
            this.kingMoved = response.kingMoved;
            console.log('------------------Inside isValidMove------------------')
            console.log('RookMoved_ks:', this.RookMoved_ks);
            console.log('RookMoved_qs:', this.RookMoved_qs);
            console.log('kingMoved:', this.kingMoved);
          }
          resolve(response);
        });
      });
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f8f8; /* Off-white background color */
}

.opponent-info,
.player-info,
.room-info {
  text-align: center;
  color: #333;
}

.info-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* White background color */
  border-radius: 10px;
  margin-top: 20px;
}

.info-label {
  font-size: 18px;
  margin-bottom: 5px;
}

.info-value {
  font-size: 24px;
  font-weight: bold;
}

.chessboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.row {
  display: flex;
}

.square {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  cursor: pointer;
}

.flipped {
  transform: rotate(180deg);
}

.brown-ish {
  background-color: #d2b48c;
}

.piece-wrapper {
  position: absolute;
  transition: all 3s ease-in-out;
}

.animated-piece {
  width: 60px;
  height: 60opx;
}
.piece-fade-enter-active, .piece-fade-leave-active {
  transition: opacity 0.5s;
}

.piece-fade-enter, .piece-fade-leave-to {
  opacity: 0;
}
</style>