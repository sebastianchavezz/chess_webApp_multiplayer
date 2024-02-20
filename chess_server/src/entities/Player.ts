// entities/Player.ts
import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, BaseEntity ,Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Player extends BaseEntity{
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  color!: boolean

}
