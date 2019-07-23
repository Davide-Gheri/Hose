import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Environment } from '../../environment/entities/environment.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Column()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  minHumidity: number;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  wateringSeconds: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(type => Environment, environment => environment.rule)
  environments: Environment[];
}
