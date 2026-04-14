import { uuid, pgTable } from 'drizzle-orm/pg-core';

export const memberships = pgTable('memberships', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id').notNull(),
  tenantId: uuid('tenant_id').notNull(),

  roleId: uuid('role_id').notNull(),
});
