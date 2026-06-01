import httpError from "http-errors";
import knex from "../config/knex";
import { validateLogin, validateRegister } from "./validations";
import { hashPasssword, comnparePassword } from "../config/encryption";
import { generateToken } from "../config/jwt";

const getUser = (username: string) => {
  return knex("users")
    .whereRaw(`LOWER(username) = LOWER(?)`, [username])
    .first();
};

export const register = async (body: {
  username: string;
  password: string;
}) => {
  validateRegister(body);

  const currentUser = await getUser(body.username);
  if (currentUser)
    throw new httpError.Conflict("User already exists with given username");

  return (
    await knex("users").insert(
      {
        username: body.username.toLocaleLowerCase(),
        password: await hashPasssword(body.password),
      },
      ["id", "username"],
    )
  )[0];
};

export const login = async (body: { username: string; password: string }) => {
  validateLogin(body);

  const hashedPassword = await hashPasssword(body.password);

  const currentUser = await getUser(body.username);
  if (!currentUser)
    throw new httpError.NotFound("User is not existing in system");

  const passwordMatch = await comnparePassword(body.password, hashedPassword);

  if (!passwordMatch)
    throw new httpError.Unauthorized("Username or password are incorrect.");

  const token = await generateToken({ id: currentUser.id });

  return {
    user: {
      id: currentUser.id,
      username: currentUser.username,
      createdAt: currentUser.created_at,
      updatedAt: currentUser.updated_at,
    },
    token,
  };
};
