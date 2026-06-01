import Router from "@koa/router";
import { getLastVisits, getVisitsByUrl } from "../services/visits";

const visitsRouter = new Router();

visitsRouter
  .get("/", async (ctx) => {
    ctx.response.body = await getLastVisits(
      ctx.state.userId,
      Number(ctx.query.limit),
      Number(ctx.query.page),
    );
  })
  .get("/:id", async (ctx) => {
    ctx.response.body = await getVisitsByUrl(
      ctx.params.id as string,
      ctx.state.userId,
      Number(ctx.query.limit),
      Number(ctx.query.page),
    );
  });

export default visitsRouter;
