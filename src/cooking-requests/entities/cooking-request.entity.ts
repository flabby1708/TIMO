import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';

export enum CookingRequestStatus {
  OPEN = 'open',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('cooking_requests')
export class CookingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column('uuid', { nullable: true })
  cookerId: string | null;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cookerId' })
  cooker: User | null;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  address: string;

  @Column()
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: CookingRequestStatus,
    default: CookingRequestStatus.OPEN,
  })
  status: CookingRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
