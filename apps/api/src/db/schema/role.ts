import { InferSelectModel } from 'drizzle-orm';
import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // admin, member, etc
});

export type Role = InferSelectModel<typeof roles>;
