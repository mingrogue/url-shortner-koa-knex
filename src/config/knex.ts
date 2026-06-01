import Knex from "knex";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const knex = Knex({
  client: "postgresql",
  connection: {
    host: DB_HOST as string,
    port: Number(DB_PORT),
    user: DB_USER as string,
    password: DB_PASSWORD as string,
    database: DB_DATABASE as string,
  },
});

export const onDatabaseConnect = async (): Promise<void> => {
  return knex.raw("select 1");
};

export default knex;
