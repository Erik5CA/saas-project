import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const entityTypeEnum = pgEnum('entity_type', ['task', 'document']);

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),

  content: text('content').notNull(),

  authorId: uuid('author_id').notNull(),
  tenantId: uuid('tenant_id').notNull(),

  // relación polimórfica
  entityType: entityTypeEnum('entity_type')
    .notNull()
    .$defaultFn(() => 'task'),
  entityId: uuid('entity_id').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
});
