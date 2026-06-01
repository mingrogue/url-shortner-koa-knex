import "dotenv/config";
import type { Knex } from "knex";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: DB_HOST as string,
      port: Number(DB_PORT),
      user: DB_USER as string,
      password: DB_PASSWORD as string,
      database: DB_DATABASE as string,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;
