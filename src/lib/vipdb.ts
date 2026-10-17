// Read-only connection to VIP-TAXI's production Postgres.
// Every query runs inside a READ ONLY transaction — this layer can never write.
// The connection string is read from VIP_DB_URL (.env.local) and never logged.
import { Pool, type PoolClient } from "pg";

let pool: Pool | null = null;

function connectionString(): string {
  const raw = process.env.VIP_DB_URL;
  if (!raw) throw new Error("VIP_DB_URL yo'q (.env.local)");
  // Railway proxy uses a self-signed cert; strip sslmode so our ssl option applies.
  return raw.replace(/([?&])sslmode=[^&]*/g, "$1").replace(/[?&]$/, "");
}

function vipPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: connectionString(),
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
    });
    // Never let a pool error print the connection string.
    pool.on("error", () => {});
  }
  return pool;
}

/** Run SELECT(s) in a read-only transaction. Returns rows. */
export async function vipQuery<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  let client: PoolClient | null = null;
  try {
    client = await vipPool().connect();
    await client.query("BEGIN TRANSACTION READ ONLY");
    const r = await client.query(sql, params);
    await client.query("COMMIT");
    return r.rows as T[];
  } catch (e) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        /* ignore */
      }
    }
    // Re-throw a clean error without the connection string.
    throw new Error(`VIP DB query failed: ${(e as Error).message}`);
  } finally {
    client?.release();
  }
}
