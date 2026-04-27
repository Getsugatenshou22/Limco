import mysql, { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getAppEnv } from "@/lib/env";

export type DbQueryResult<T> = {
  rows: T[];
  insertId?: number;
  affectedRows?: number;
};

export type DbExecutor = {
  query<T>(sql: string, params?: unknown[]): Promise<DbQueryResult<T>>;
};

declare global {
  var __limcoMysqlPool: Pool | undefined;
}

function createExecutor(connection: Pool | PoolConnection): DbExecutor {
  return {
    async query<T>(sql: string, params: unknown[] = []) {
      const [result] = await connection.query<RowDataPacket[] | ResultSetHeader>(sql, params);

      if (Array.isArray(result)) {
        return {
          rows: result as unknown as T[],
        };
      }

      return {
        rows: [],
        insertId: result.insertId,
        affectedRows: result.affectedRows,
      };
    },
  };
}

export function getDb() {
  if (!global.__limcoMysqlPool) {
    const databaseUrl = new URL(getAppEnv().databaseUrl);
    global.__limcoMysqlPool = mysql.createPool({
      host: databaseUrl.hostname,
      port: databaseUrl.port ? Number.parseInt(databaseUrl.port, 10) : 3306,
      user: decodeURIComponent(databaseUrl.username),
      password: decodeURIComponent(databaseUrl.password),
      database: databaseUrl.pathname.replace(/^\//, ""),
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
      dateStrings: true,
    });
  }

  return createExecutor(global.__limcoMysqlPool);
}

export async function withTransaction<T>(callback: (client: DbExecutor) => Promise<T>) {
  if (!global.__limcoMysqlPool) {
    getDb();
  }

  const pool = global.__limcoMysqlPool as Pool;
  const connection = await pool.getConnection();
  const executor = createExecutor(connection);

  try {
    await connection.beginTransaction();
    const result = await callback(executor);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
