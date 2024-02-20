import pool from '../db/db';
import { Room } from '../entities/Room';
import { Player } from '../entities/Player';
import { Game } from '../entities/Game';

export const manager = pool.manager;
export const getRepository = pool.getRepository;

export const createRoom = (): string => {
    const room_number: string = `${Date.now()}`;
    const room = Room.create({
        id: room_number,
        
    });
    room.save();
    console.log('Room created'); 
    return "success";
};

export const joinRoom = (roomId: string, playerName: string): { playerColor: boolean } => {
  const room = getRepository(Room).findOne({ relations: ['players'], where: { id: roomId }});

  if (!room) {
    throw new Error('Room not found');
  }

  const playerColor = false;

  const player = new Player();
    player.name = playerName;
    player.color = playerColor;

  getRepository(Player).save(player);

  return { playerColor };
};
