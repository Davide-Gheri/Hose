import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Column()
  reading: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Column()
  boardId: string;

  @CreateDateColumn()
  createdAt: Date;
}
