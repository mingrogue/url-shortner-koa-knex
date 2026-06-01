import "dotenv/config";
import Knex, { onDatabaseConnect } from "./config/knex";

const main = async () => {
  try {
    await onDatabaseConnect();
    console.log("database connection is ready");

    const users = await Knex("users");
    console.log(users);
  } catch (e) {
    console.log(e);
  }
};

main();
