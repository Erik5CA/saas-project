import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import type { Database } from 'src/db';
import { users, type User, type NewUser } from 'src/db/schema';

@Injectable()
export class AuthRepository {
  constructor(@Inject('DB') private readonly db: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return user[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user[0] || null;
  }

  async signIn() {
    return await this.db.select().from(users);
  }

  async signUp({
    email,
    password,
    tx
  }: Pick<NewUser, 'email' | 'password'> & {tx?:PgTransaction<any,any,any>}): Promise<User> {
    const db = tx ?? this.db;
    const user = await db.insert(users).values({ email, password }).returning();
    return user[0];
  }
}
