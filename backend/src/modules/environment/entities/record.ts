import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class Record {
  @IsNotEmpty()
  @IsNumber()
  reading: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  boardId: string;
}
