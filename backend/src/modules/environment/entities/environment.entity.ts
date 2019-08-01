import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Rule } from '../../rule/entities/rule.entity';
import { Gpio } from '../../gpio/entities/gpio.entity';
import { Watering } from './watering.entity';
import { Board } from '../../board/entities/board.entity';

@Entity()
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Column()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Column({nullable: true})
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(type => Board, {eager: true, nullable: true})
  @JoinColumn()
  board: Board;

  @ManyToOne(type => Rule, rule => rule.environments, {eager: true})
  rule: Rule;

  @ManyToMany(type => Gpio, gpio => gpio.environments, {eager: true})
  @JoinTable()
  gpios: Gpio[];

  @OneToMany(type => Watering, watering => watering.environment)
  watering: Watering[];
}
