import Router from "@koa/router";
import {
  createShortUrl,
  deleteUrl,
  getUrls,
  updateUrl,
} from "../services/urls";

const urlsRouter = new Router();

urlsRouter
  .get("/", async (ctx) => {
    ctx.response.body = await getUrls(
      ctx.state.userId,
      Number(ctx.request.query.page),
      Number(ctx.request.query.limit),
    );
  })
  .post("/", async (ctx) => {
    ctx.response.body = await createShortUrl(
      ctx.request.body as Parameters<typeof createShortUrl>[0],
      ctx.state.userId,
    );
    ctx.response.status = 201;
  })
  .put("/:id", async (ctx) => {
    ctx.response.body = await updateUrl(
      ctx.params.id as string,
      ctx.request.body as { url: string },
      ctx.state.userId,
    );
  })
  .delete("/:id", async (ctx) => {
    ctx.response.body = await deleteUrl(
      ctx.params.id as string,
      ctx.state.userId,
    );
  });

export default urlsRouter;
