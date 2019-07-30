import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Environment } from './environment.entity';

@Entity()
export class Watering {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Environment, env => env.watering)
  environment: Environment;

  @CreateDateColumn()
  createdAt: Date;

  @Column({type: 'datetime', nullable: true})
  processedAt: Date;
}
