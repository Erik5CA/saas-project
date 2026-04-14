import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),
  description: text('description'),

  projectId: uuid('project_id').notNull(),
  tenantId: uuid('tenant_id').notNull(),

  assignedTo: uuid('assigned_to'),

  parentTaskId: uuid('parent_task_id'), // 🔥 subtareas

  createdAt: timestamp('created_at').defaultNow(),
});
