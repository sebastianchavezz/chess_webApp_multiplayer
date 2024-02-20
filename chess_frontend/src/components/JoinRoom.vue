<!-- src/components/JoinRoom.vue -->
<template>
  <div class="join-room-container">
    <h1 class="chess-title">CHESS</h1>
    <div class="input-container">
      <input v-model="playerName" placeholder="Enter your name" class="input-field" />
      <button @click="createRoom" class="action-button">Create Room</button>
    </div>
    <div v-if="!creatingRoom" class="input-container">
      <input v-model="roomId" placeholder="Enter room ID" class="input-field" />
      <button @click="joinRoom" class="action-button">Join Room</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      playerName: '',
      roomId: '',
      gameId: '', // Added gameId variable
      creatingRoom: false,
    };
  },
  methods: {
  createRoom() {
    this.creatingRoom = true;

    if (!this.playerName.trim()) {
      alert('Please enter a valid player name');
      this.creatingRoom = false;
      return;
    }

    axios.post('http://localhost:3001/create-room', { playerName: this.playerName })
      .then(response => {
        const room = response.data.room;
        const playerColor = response.data.playerColor;
        const initialBoard = response.data.board;
        const gameId = response.data.gameId;

        // Emit the 'joinedRoom' event
        this.$emit('joinedRoom', { room, playerColor, playerName: this.playerName, initialBoard, gameId });

        // Emit the 'updateOpponentName' event with an empty string
        this.$emit('updateOpponentName', '');

        this.$emit('playerColor', playerColor);
      })
      .catch(error => {
        console.error('Error creating room:', error);
      })
      .finally(() => {
        this.creatingRoom = false;
      });
  },
  async joinRoom() {
      if (!this.playerName.trim() || !this.roomId.trim()) {
        alert('Please enter a valid player name and room ID');
        return;
      }
      try {
        const response = await axios.post(`http://localhost:3001/join-room/${this.roomId}`, { playerName: this.playerName });

        const playerColor = response.data.playerColor;
        const initialBoard = response.data.board;
        const gameId = response.data.gameId;

        // Emit the 'joinedRoom' event

        // Request the creator's name from the server
        const creatorResponse = await axios.get(`http://localhost:3001/creator-name/${this.roomId}`);
        const creatorName = creatorResponse.data.creatorName;

        // Emit the 'updateOpponentName' event with the creator's name
        console.log('Creator Name:', creatorName);
        console.log('we in join room opps');
        this.$emit('updateOpponentName', creatorName);
        this.$emit('joinedRoom', { room: this.roomId, playerColor, playerName: this.playerName, initialBoard, gameId });
      }
      catch (error) {
       console.error('Error:', error);
      }
    },
  },
};
</script>

<style scoped>
.join-room-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.chess-title {
  font-size: 2em;
  margin-bottom: 20px;
  font-family: 'YourPreferredFont', sans-serif;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-field {
  padding: 10px;
  margin-bottom: 10px;
}

.action-button {
  padding: 10px;
  cursor: pointer;
  background-color: #3498db; /* Use your preferred color */
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
}
</style>
