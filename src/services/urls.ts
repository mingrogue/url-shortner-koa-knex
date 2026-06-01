import Knex from "../config/knex";
import { validateCreateShortUrl } from "./validations";

export const createShortUrl = async (
  body: { url: string; id?: string },
  userId: number,
) => {
  validateCreateShortUrl(body);

  let results;

  if (body.id) {
    const currentRecord = await Knex("urls").where({ id: body.id }).first();

    if (currentRecord) {
      throw new Error("Id provided already exists in the database");
    }

    results = await Knex("urls").insert({
      url: body.url,
      id: body.id,
      user_id: userId,
    });
  } else {
    results = await Knex("urls").insert({ url: body.url, user_id: userId });
  }

  return results[0];
};

export const resolveUrl = async (id: string) => {
  const urlFromDb = await Knex("urls").where({ id }).first();

  if (!urlFromDb) throw new Error("The id is not valid");

  return urlFromDb.url;
};

export const updateUrl = async (
  id: string,
  body: { url: string },
  userId: number,
) => {
  validateCreateShortUrl(body);

  const url = await Knex("urls").where({ id }).select(["user_id"]).first();

  if (!url) throw new Error("url is not found");

  if (url.user_id != userId)
    throw new Error("you dont have permissions to update this url");

  const results = await Knex("urls")
    .where({ id })
    .update({ url: body.url }, "*");

  return results[0];
};

export const deleteUrl = async (id: string, userId: number) => {
  const url = await Knex("urls").where({ id }).select(["user_id"]).first();

  if (!url) throw new Error("url is not found");

  if (url.user_id != userId)
    throw new Error("you dont have permissions to update this url");

  await Knex("urls").where({ id }).delete();

  return true;
};

export const getUrls = async (
  userId: number,
  page: number = 0,
  limit: number = 20,
) => {
  return await Knex("urls")
    .where({ userId: userId })
    .limit(limit)
    .offset(page * limit);
};
