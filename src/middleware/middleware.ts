import httpErrors from "http-errors";
import { RouterContext } from "@koa/router";
import { Next } from "koa";
import { validateJwt } from "../config/jwt";

export const requireAuthHandler = async (ctx: RouterContext, next: Next) => {
  const header = ctx.request.headers.authorization;

  if (!header) throw new httpErrors.Unauthorized("Please provide a token");

  const token = header.split(" ")[1];
  const tokenPayload = await validateJwt(token as string);

  ctx.state.userId = tokenPayload.id;

  await next();
};
