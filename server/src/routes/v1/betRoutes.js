import { Router } from "express";

import BetController from "../../controllers/v1/betController.js";
import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

export default function createAccountRouter(io) {
  // ✅ Accept io
  const betRouter = Router();
  const bet = new BetController(io); // ✅ Pass io to controller

  // Ensure that all endpoints implement authorization
  accountRouter.use(authorization);

  accountRouter.post("/login", account.login.bind(account));
  accountRouter.post("/", account.create.bind(account));
  accountRouter.get("/", authentication, account.profile.bind(account));

  accountRouter.post(
    "/deposit/:amount",
    authentication,
    account.updateBalance.bind(account)
  );
  accountRouter.post(
    "/withdraw/:amount",
    authentication,
    account.updateBalance.bind(account)
  );

  return accountRouter;
}
