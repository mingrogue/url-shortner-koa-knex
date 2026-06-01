import httpError from "http-errors";
import knex from "../config/knex";
import { validateCreateShortUrl } from "./validations";
import { registerVisit } from "./visits";

export const createShortUrl = async (
  body: { url: string; id?: string },
  userId: number,
) => {
  validateCreateShortUrl(body);

  let results;

  if (body.id) {
    const currentRecord = await knex("urls").where({ id: body.id }).first();

    if (currentRecord) {
      throw new httpError.Conflict(
        "Id provided already exists in the database",
      );
    }

    results = await knex("urls").insert({
      url: body.url,
      id: body.id,
      user_id: userId,
    });
  } else {
    results = await knex("urls").insert({ url: body.url, user_id: userId });
  }

  return results[0];
};

export const resolveUrl = async (id: string, ip: string) => {
  const urlFromDb = await knex("urls").where({ id }).first();

  if (!urlFromDb) throw new httpError.NotFound("URL not found");

  await registerVisit(id, ip);

  return urlFromDb.url;
};

export const updateUrl = async (
  id: string,
  body: { url: string },
  userId: number,
) => {
  validateCreateShortUrl(body);

  const url = await knex("urls").where({ id }).select(["user_id"]).first();

  if (!url) throw new httpError.NotFound("URL not found");

  if (url.user_id != userId)
    throw new httpError.Forbidden(
      "you dont have permissions to update this url",
    );

  const results = await knex("urls")
    .where({ id })
    .update({ url: body.url }, "*");

  return results[0];
};

export const deleteUrl = async (id: string, userId: number) => {
  const url = await knex("urls").where({ id }).select(["user_id"]).first();

  if (!url) throw new httpError.NotFound("URL not found");

  if (url.user_id != userId)
    throw new httpError.Forbidden(
      "you dont have permissions to update this url",
    );
  await knex("urls").where({ id }).delete();

  return true;
};

export const getUrls = async (
  userId: number,
  page: number = 1,
  limit: number = 20,
) => {
  return await knex("urls")
    .where({ userId: userId })
    .leftJoin("visits", "urls.id", "visits.url_id")
    .select(
      ["urls.id", "urls.url", "urls.created_at"],
      knex.raw("count(visits.id) as visits_count"),
    )
    .limit(limit)
    .offset((page - 1) * limit)
    .groupBy("urls.id")
    .orderBy("urls.created_at", "desc");
};
