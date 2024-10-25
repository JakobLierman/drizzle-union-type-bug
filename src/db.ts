import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { type DrizzleConfig } from 'drizzle-orm/utils';
import * as schema from './schema';

type Schema = typeof schema;

// eslint-disable-next-line import/no-mutable-exports -- Needed for dynamic database drivers
let db: NodePgDatabase<Schema> | NeonHttpDatabase<Schema>; // THIS UNION TYPE LOOKS TO BE THE ISSUE
const config: DrizzleConfig<Schema> = {
	schema,
	casing: 'snake_case',
	logger: process.env['NODE_ENV'] === 'development',
};

const DATABASE_DRIVERS = ['neon-http', 'pg'] as const;
export type DatabaseDriver = (typeof DATABASE_DRIVERS)[number];

const driver: DatabaseDriver =
	process.env['DATABASE_DRIVER'] as DatabaseDriver ??
	// Try to guess the driver based on the database URL
	(process.env['DATABASE_URL']?.includes('neon.tech') ? 'neon-http' : 'pg');

if (driver === 'neon-http') {
	const { drizzle } = await import('drizzle-orm/neon-http');
	const { neon } = await import('@neondatabase/serverless');

	const sql = neon(process.env['DATABASE_URL']!);
	db = drizzle(sql, config);
} else {
	// Fallback to the `pg` driver
	const { drizzle } = await import('drizzle-orm/node-postgres');

	db = drizzle(process.env['DATABASE_URL']!, config);
}

export default db;
