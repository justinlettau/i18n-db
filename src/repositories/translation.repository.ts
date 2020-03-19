import { EntityRepository, Repository } from 'typeorm';

import { Translation } from '../entities/translation.entity';
import { Duplicate } from '../interfaces';

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
   * Find duplicates.
   */
  findDuplicates(code: string): Promise<Duplicate[]> {
    return this.createQueryBuilder('translation')
      .select(['translation.value AS value', 'COUNT(1) AS occurrences', 'GROUP_CONCAT(resource.key) AS keys'])
      .innerJoin('translation.resource', 'resource')
      .innerJoin('translation.locale', 'locale')
      .where('locale.code = :code', { code })
      .groupBy('translation.value')
      .having('COUNT(1) > 1')
      .orderBy('COUNT(1)', 'DESC')
      .getRawMany();
  }

  /**
   * Find all with filters.
   *
   * @param filters Optional filters.
   */
  findWhere(filters: { locale: string; key: string; term: string }) {
    const { locale, key, term } = filters;

    const query = this.createQueryBuilder('translation')
      .innerJoinAndSelect('translation.resource', 'resource')
      .innerJoinAndSelect('translation.locale', 'locale')
      .where('1 = 1');

    if (locale) {
      query.andWhere('locale.code = :code', { code: locale });
    }

    if (key) {
      query.andWhere('resource.key like :key', { key });
    }

    if (term) {
      query.andWhere('translation.value like :term', { term });
    }

    return query.orderBy('locale.code').getMany();
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
   * @param localeId Locale id.
   */
  deleteByLocalId(localeId: number) {
    return this.createQueryBuilder()
      .delete()
      .from(Translation)
      .where('localeId = :localeId', { localeId })
      .execute();
  }

  /**
   * Delete by resource key.
   *
   * @param resourceId resource id.
   */
  deleteByResourceId(resourceId: number) {
    return this.createQueryBuilder()
      .delete()
      .from(Translation)
      .where('resourceId = :resourceId', { resourceId })
      .execute();
  }
}
