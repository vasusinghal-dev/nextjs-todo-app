import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

const createPool = () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    pool = createPool();

    pool.on("error", (err) =>
      console.log("Unexpected error on idle client", err)
    );
  }

  return pool;
};

export const query = <T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<QueryResult<T>> => {
  const pool = getPool();
  return pool.query<T>(text, params);
};

const getClient = async (): Promise<PoolClient> => {
  const pool = getPool();
  return await pool.connect();
};

// Higher-order function for transactions
export const withTransaction = async <T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await getClient();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
