import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

// document.ts
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),
  content: text('content'),

  tenantId: uuid('tenant_id').notNull(),
  createdBy: uuid('created_by'),

  createdAt: timestamp('created_at').defaultNow(),
});

// document_versions.ts
export const documentVersions = pgTable('document_versions', {
  id: uuid('id').defaultRandom().primaryKey(),

  documentId: uuid('document_id').notNull(),
  content: text('content'),

  createdAt: timestamp('created_at').defaultNow(),
});
