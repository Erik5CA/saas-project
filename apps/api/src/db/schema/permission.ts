import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: text('action').notNull(), // create_project, delete_task
});
