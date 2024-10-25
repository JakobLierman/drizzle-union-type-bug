import { itemTable } from './schema';
import db from '@/db';

export type InsertItem = typeof itemTable.$inferInsert;
export type SelectItem = typeof itemTable.$inferSelect;

/**
 * Create a new item.
 * @param {InsertItem} company The item to create.
 * @returns {Promise<SelectItem["id"]>} The id of the created item.
 */
export const createItem = async (
	company: InsertItem,
): Promise<SelectItem['id']> => {
	const [createdItem] = await db
		.insert(itemTable)
		.values(company)
		.returning({ id: itemTable.id }); // TS2554: Expected 0 arguments, but got 1 -> ONLY WHEN USING THE UNION TYPE

	if (!createdItem) throw new Error('Could not create item');

	return createdItem.id;
};
