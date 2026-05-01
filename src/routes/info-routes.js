import { Router } from 'express';
import { } from "./../controllers/info-controller.js"

const infoRouter = Router();

infoRouter.route("/health-check")
  .get((request, response) => {
    res.json({ message: "hello world" });
  })

export default infoRouter
