import { EntityRepository, Repository } from 'typeorm';

import { Locale } from '../entities/locale.entity';

/**
 * Locale repository.
 */
@EntityRepository(Locale)
export class LocaleRepository extends Repository<Locale> {
  /**
   * Find all.
   */
  findAll() {
    return this.createQueryBuilder().orderBy('code').getMany();
  }

  /**
   * Find by code.
   *
   * @param code Locale code.
   */
  findByCode(code: string) {
    return this.createQueryBuilder().where('code = :code', { code }).getOne();
  }

  /**
   * Delete by code.
   *
   * @param id Locale id.
   */
  deleteById(id: number) {
    return this.createQueryBuilder()
      .delete()
      .from(Locale)
      .where('id = :id', { id })
      .execute();
  }
}
