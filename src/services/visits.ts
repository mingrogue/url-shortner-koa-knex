import httpError from "http-errors";
import knex from "../config/knex";

export const registerVisit = async (urlId: string, ip: string) =>
  await knex("visits").insert({ url_id: urlId, ip });

export const getLastVisits = async (
  userId: number,
  limit: number = 20,
  page: number = 1,
) =>
  await knex("visits")
    .join("urls", "urls.id", "visits.url_id")
    .select(["urls.id", "urls.url", "visits.ip", "visits.created_at"])
    .where({ user_id: userId })
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("visits.created_at", "desc");

export const getVisitsByUrl = async (
  urlId: string,
  userId: number,
  limit: number = 20,
  page: number = 1,
) => {
  const url = await knex("urls")
    .where({ id: urlId })
    .select(["user_id"])
    .first();

  if (!url) throw new httpError.NotFound("url doesnot exist in system");
  if (url.user_id !== userId)
    throw new httpError.Forbidden(
      "you donot have permission for veiwing this url",
    );

  return knex("visits")
    .where({ url_id: urlId })
    .limit(limit)
    .offset((page - 1) * limit);
};
