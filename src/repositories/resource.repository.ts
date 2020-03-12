import { EntityRepository, Repository } from 'typeorm';

import { Resource } from '../entities/resource.entity';

/**
 * Resource repository.
 */
@EntityRepository(Resource)
export class ResourceRepository extends Repository<Resource> {
  /**
   * Find all.
   */
  findAll() {
    return this.createQueryBuilder()
      .orderBy('key')
      .getMany();
  }

  /**
   * Find by key.
   *
   * @param key Resource key.
   */
  findByKey(key: string) {
    return this.createQueryBuilder()
      .where('key = :key', { key })
      .getOne();
  }

  /**
   * Delete by id.
   *
   * @param id Resource id.
   */
  deleteById(id: number) {
    return this.createQueryBuilder()
      .delete()
      .from(Resource)
      .where('id = :id', { id })
      .execute();
  }
}
