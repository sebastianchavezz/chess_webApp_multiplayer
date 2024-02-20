// entities/Game.ts
import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Player } from './Player';
import { Room } from './Room';

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  is_finished!: boolean;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player!: Player;

  @Column({ type: 'text', nullable: true })
  move_history!: string;

  @Column()
  turn!: boolean;

  @Column({ type: 'char', array: true, nullable: true })
  board!: string[][] | null;
}
