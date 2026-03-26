import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("DATABASE_URL environment variable is missing. The app will run in in-memory mode if configured, but persistent database operations will fail.");
}

export const pool = DATABASE_URL ? new Pool({ 
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}) : null;

export const db = pool ? drizzle(pool, { schema }) : null;