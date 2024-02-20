// entities/MatchHistory.ts
import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Game } from './Game';

@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Game)
  game!: Game;

  @Column()
  move_number!: number;

  @Column({ type: 'text' })
  move_details!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
