import { Router } from "express";
import createHomeRouter from "./homeRoutes.js";
import createAccountRouter from "./accountRoutes.js";

import createBetRoutes from "./betRoutes.js";

export default function createV1Router(io) {
  const v1 = new Router();

  v1.use("/account", createAccountRouter(io)); // ✅ Pass io
  v1.use("/", createHomeRouter(io));

  return v1;
}
