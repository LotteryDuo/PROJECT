import { Router } from "express";
import HomeController from "../../controllers/v1/homeController.js";

export default function createHomeRouter(io) {
  const homeRouter = new Router();
  const home = new HomeController(io); // Pass io to controller

  homeRouter.get("/", home.indexAction.bind(home));

  return homeRouter;
}
