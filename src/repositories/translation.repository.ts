import { EntityRepository, Repository } from 'typeorm';

import { Translation } from '../entities/translation.entity';

/**
 * Translation repository.
 */
@EntityRepository(Translation)
export class TranslationRepository extends Repository<Translation> {
  /**
   * Find all.
   */
  findAll() {
    return this.createQueryBuilder('translation')
      .innerJoinAndSelect('translation.resource', 'resource')
      .innerJoinAndSelect('translation.locale', 'locale')
      .orderBy('locale.code')
      .addOrderBy('resource.key')
      .getMany();
  }

  /**
   * Find by Locale.
   *
   * @param codes Locale codes.
   */
  findByLocale(codes: string[]) {
    return this.createQueryBuilder('translation')
      .innerJoinAndSelect('translation.resource', 'resource')
      .innerJoinAndSelect('translation.locale', 'locale')
      .where('locale.code IN (:...codes)', { codes })
      .addOrderBy('resource.key')
      .getMany();
  }

  /**
   * Find by resource.
   *
   * @param key Resource key.
   */
  findByResource(key: string) {
    return this.createQueryBuilder('translation')
      .innerJoinAndSelect('translation.resource', 'resource')
      .innerJoinAndSelect('translation.locale', 'locale')
      .where('resource.key = :key', { key })
      .orderBy('locale.code')
      .getMany();
  }

  /**
   * Find by resource and locale.
   *
   * @param localeId Locale id.
   * @param resourceId Resource id.
   */
  findUnique(localeId: number, resourceId: number) {
    return this.createQueryBuilder()
      .where('resourceId = :resourceId', { resourceId })
      .andWhere('localeId = :localeId', { localeId })
      .getOne();
  }

  /**
   * Delete by locale id.
   *
   * @param localeId locale id.
   */
  deleteByLocalId(localeId: number) {
    return this.createQueryBuilder()
      .delete()
      .from(Translation)
      .where('localeId = :localeId', { localeId })
      .execute();
  }
}
