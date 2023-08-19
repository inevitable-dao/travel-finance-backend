import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'card_packages' })
export class CardPackageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  cp_index: number;

  @Column()
  cp_name: string;

  @Column()
  cp_original_price: number;

  @Column()
  cp_price: number;
}
