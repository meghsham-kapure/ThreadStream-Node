import { Router } from 'express';
import { } from "./../controllers/info-controller.js"

const infoRouter = Router();

infoRouter.route("/health-check")
  .get((req, res) => {
    res.json({ message: "hello world" });
  })

export default infoRouter
