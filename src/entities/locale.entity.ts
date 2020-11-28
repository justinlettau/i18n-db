import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Translation } from './translation.entity';

/**
 * Locale entity.
 */
@Entity()
export class Locale {
  /**
   * Locale id.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Locale code.
   */
  @Index({ unique: true })
  @Column()
  code: string;

  /**
   * Locale name.
   */
  @Column({ nullable: true })
  name: string;

  /**
   * Associated translations.
   */
  @OneToMany((type) => Translation, (trans) => trans.locale)
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
