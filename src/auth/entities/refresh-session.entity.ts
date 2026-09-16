import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';

@Entity('refresh_sessions')
export class RefreshSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column()
  tokenHash: string;

  @Column()
  expiresAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  revokedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}