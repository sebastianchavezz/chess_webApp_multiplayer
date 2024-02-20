// entities/Room.ts
import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, PrimaryColumn, Column } from 'typeorm';
import { Game } from './Game';

@Entity()
export class Room extends BaseEntity{
  @PrimaryColumn()
  id!: string;

  @Column({default:0})
  amount_player! : number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' }) 
  game!: Game;

}
