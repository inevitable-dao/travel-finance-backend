import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserCardEntity } from './UserCardEntity';
import { JourneyEntity } from './JourneyEntity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  u_index: number;

  @Column()
  u_username: string;

  @Column()
  u_password: string;

  @Column()
  u_point: number;

  @OneToMany(() => UserCardEntity, (userCard) => userCard.user)
  userCards: UserCardEntity[];

  @OneToMany(() => JourneyEntity, (journey) => journey.user)
  journeys: JourneyEntity[];
}
