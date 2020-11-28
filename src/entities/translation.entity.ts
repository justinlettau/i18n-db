import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Locale } from './locale.entity';
import { Resource } from './resource.entity';

/**
 * Translation entity.
 */
@Entity()
@Index(['resourceId', 'localeId'], { unique: true })
export class Translation {
  /**
   * Translation id.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Translation value.
   */
  @Column()
  value: string;

  /**
   * Resource id.
   */
  @Column('integer')
  resourceId: number;

  /**
   * Locale id.
   */
  @Column('integer')
  localeId: number;

  /**
   * Associated resource.
   */
  @ManyToOne((type) => Resource, (resource) => resource.translations)
  resource: Resource;

  /**
   * Associated locale.
   */
  @ManyToOne((type) => Locale, (locale) => locale.translations)
  locale: Locale;

  /**
   * Version.
   */
  @VersionColumn()
  version: number;

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
