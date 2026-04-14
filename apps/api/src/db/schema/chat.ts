import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

// chat-room.ts
export const chatRooms = pgTable('chat_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name'),
  tenantId: uuid('tenant_id').notNull(),

  // opcional: ligado a proyecto
  projectId: uuid('project_id'),
});

// message.ts
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),

  content: text('content').notNull(),

  chatRoomId: uuid('chat_room_id').notNull(),
  senderId: uuid('sender_id').notNull(),

  tenantId: uuid('tenant_id').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
});
