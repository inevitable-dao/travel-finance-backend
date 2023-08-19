import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity({ name: 'journeys' })
export class JourneyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  j_index: number;

  @Column()
  j_user_index: number;

  @Column()
  j_start_datetime: Date;

  @Column()
  j_end_datetime: Date;

  @Column()
  j_user_card_indexes: string;

  @ManyToOne(() => UserEntity, (user) => user.journeys)
  @JoinColumn({ name: 'j_user_index' })
  user: UserEntity;
}
