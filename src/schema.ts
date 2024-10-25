import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const itemTable = pgTable('item', {
	id: serial().primaryKey(),
	name: text('name').notNull(),
});
