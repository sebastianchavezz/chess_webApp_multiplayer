<!-- src/App.vue -->
<template>
  <div>
    <!-- Chessboard component -->
    <div v-if="roomData">
      <Chessboard
        :playerName="roomData.playerName"
        :roomId="roomData.room"
        :playerColor="playerColor" 
        :initialBoard="roomData.initialBoard" 
        :gameId="roomData.gameId"
        :opponentName="opponentName"
        @playerColor="handlePlayerColor"
      />
    </div>

    <!-- JoinRoom component -->
    <div v-else>
      <JoinRoom @joinedRoom="handleJoinedRoom" @updateOpponentName="handleUpdateOpponentName" />
    </div>
  </div>
</template>

<script>
import JoinRoom from '@/components/JoinRoom.vue';
import Chessboard from '@/components/chessBoard.vue';

export default {
  data() {
    return {
      roomData: null,
      playerColor: null,
      initialBoard: null,
      opponentName: '',
    };
  },
  components: {
    Chessboard,
    JoinRoom
  },
  methods: {
    handleJoinedRoom(roomData) {
      console.log('Joined room:', roomData);
      this.roomData = roomData;
      this.playerColor = roomData.playerColor; // Set the playerColor when joining the room
      this.initialBoard = roomData.initialBoard;
    },
    handlePlayerColor(playerColor) {
      console.log('Received player color:', playerColor);
      this.playerColor = playerColor; // Set the playerColor when receiving the event
    },
    handleUpdateOpponentName(data) {
      this.opponentName = data;
      console.log('----------------------------------------')
      console.log('Updated opponent name:', this.opponentName);
    },
  },
};
</script>
