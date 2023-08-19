import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_card_packages' })
export class UserCardPackageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ucp_index: number;

  @Column()
  ucp_user_index: number;

  @Column()
  ucp_card_package_index: number;

  @Column()
  ucp_register_datetime: Date;
}
