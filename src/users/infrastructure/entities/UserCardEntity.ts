import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { CardEntity } from '../../../cards/infrastructure/entities/CardEntity';

@Entity({ name: 'user_cards' })
export class UserCardEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  uc_index: number;

  @Column()
  uc_user_index: number;

  @Column()
  uc_card_index: number;

  @Column()
  uc_is_use: string;

  @Column()
  uc_register_datetime: Date;

  @ManyToOne(() => UserEntity, (user) => user.userCards)
  @JoinColumn({ name: 'uc_user_index' })
  user: UserEntity;

  @ManyToOne(() => CardEntity, (card) => card.userCards)
  @JoinColumn({ name: 'uc_card_index' })
  card: CardEntity;
}
