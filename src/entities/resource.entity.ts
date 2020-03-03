import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Translation } from './translation.entity';

/**
 * Resource entity.
 */
@Entity()
export class Resource {
  /**
   * Resource id.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Resource key.
   */
  @Index({ unique: true })
  @Column()
  key: string;

  /**
   * Resource description.
   */
  @Column({ nullable: true })
  description?: string;

  /**
   * Associated translations.
   */
  @OneToMany(
    type => Translation,
    trans => trans.resource
  )
  translations: Translation[];

  /**
   * Created date time.
   */
  @CreateDateColumn()
  createdOn?: Date;

  /**
   * Update date time.
   */
  @UpdateDateColumn()
  updatedOn?: Date;
}
