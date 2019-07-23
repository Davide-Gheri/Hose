import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Rule } from '../../rule/entities/rule.entity';

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

  @IsNumber({}, {each: true})
  @Column('simple-array', {nullable: true})
  gpios: number[];

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
}
