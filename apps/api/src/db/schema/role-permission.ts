import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').defaultRandom().primaryKey(),

  roleId: uuid('role_id').notNull(),
  permissionId: uuid('permission_id').notNull(),
});
