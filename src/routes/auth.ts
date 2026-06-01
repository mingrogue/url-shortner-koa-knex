import Router from "@koa/router";
import { login, register } from "../services/users";

const authRouter = new Router();

authRouter
  .post("/register", async (ctx) => {
    ctx.response.body = await register(
      ctx.request.body as Parameters<typeof register>[0],
    );
  })
  .post("/login", async (ctx) => {
    ctx.response.body = await login(
      ctx.request.body as Parameters<typeof login>[0],
    );
  });

export default authRouter;
