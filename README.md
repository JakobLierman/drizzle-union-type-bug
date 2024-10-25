# Drizzle Union Type Bug

This is a minimal example to reproduce a bug in the Drizzle library. The bug is related to the use of union types for the `db` object.

The goal is to support both the `node-postgres` and `neon-http` drivers. The `db` object is defined as a union type of the two drivers.
See `src/db.ts` for the definition of the `db` object.

## Steps to reproduce

1. Clone this repository
2. Run `npm install`
3. Navigate to `src/index.ts` and observe the following code:
   ```typescript
   export const createItem = async (
     company: InsertItem,
   ): Promise<SelectItem['id']> => {
       const [createdItem] = await db
           .insert(itemTable)
           .values(company)
           .returning({ id: itemTable.id });
           // TS2554: Expected 0 arguments, but got 1
           // -> ONLY WHEN USING THE UNION TYPE
   
       // ...
   };
   ```
