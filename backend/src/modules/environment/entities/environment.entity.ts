import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Rule } from '../../rule/entities/rule.entity';
import { Gpio } from '../../gpio/entities/gpio.entity';
import { Watering } from './watering.entity';

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

  @IsString()
  @MaxLength(255)
  @Column({nullable: true})
  boardId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => Rule, rule => rule.environments, {eager: true})
  rule: Rule;

  @ManyToMany(type => Gpio, gpio => gpio.environments, {eager: true})
  @JoinTable()
  gpios: Gpio[];

  @OneToMany(type => Watering, watering => watering.environment)
  watering: Watering[];
}
