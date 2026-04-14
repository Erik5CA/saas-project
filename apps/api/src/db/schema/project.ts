import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),
  tenantId: uuid('tenant_id').notNull(),

  createdBy: uuid('created_by'),
});
