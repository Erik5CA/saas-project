import { Inject, Injectable } from '@nestjs/common';
import type { Database } from 'src/db';
import { users } from 'src/db/schema';

@Injectable()
export class UserRepository {
  constructor(@Inject('DB') private readonly db: Database) {}

  async findAll() {
    return await this.db.select().from(users);
  }
}
