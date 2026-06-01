import Router from "@koa/router";
import authRouter from "./auth";
import urlsRouter from "./urls";
import { requireAuthHandler } from "../middleware/middleware";

const router = new Router();

router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
router.use(
  "/urls",
  requireAuthHandler,
  urlsRouter.routes(),
  urlsRouter.allowedMethods(),
);

export default router;
