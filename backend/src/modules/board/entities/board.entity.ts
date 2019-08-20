import { Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryColumn, RelationId } from 'typeorm';
import { Environment } from '../../environment/entities/environment.entity';

@Entity()
export class Board {
  @Index()
  @PrimaryColumn({unique: true})
  id: string;

  @Column({nullable: true})
  checkUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({type: 'datetime', nullable: true})
  lastCheckedAt: Date;

  @Column({type: 'boolean', nullable: true})
  isDown: boolean;

  @OneToOne(type => Environment, env => env.board, {nullable: true})
  environment: Environment;

  @RelationId((board: Board) => board.environment)
  environmentId: string;
}
