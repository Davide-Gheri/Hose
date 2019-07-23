import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Environment } from '../../environment/entities/environment.entity';

@Entity()
export class Gpio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNumber()
  @IsNotEmpty()
  @Column({unique: true})
  pin: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(type => Environment, environment => environment.gpios)
  environments: Environment[];
}
