import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
