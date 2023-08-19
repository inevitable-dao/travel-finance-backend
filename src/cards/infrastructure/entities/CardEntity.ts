import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserCardEntity } from '../../../users/infrastructure/entities/UserCardEntity';

@Entity({ name: 'cards' })
export class CardEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  c_index: number;

  @Column()
  c_card_package_indexes: string;

  @Column()
  c_name: string;

  @Column()
  c_type: string;

  @Column()
  c_description: string;

  @Column()
  c_address: string;

  @Column()
  c_estimated_hours: number;

  @Column()
  c_cost_value: number;

  @Column()
  c_rank: number;

  @OneToMany(() => UserCardEntity, (userCard) => userCard.card)
  userCards: UserCardEntity[];
}
