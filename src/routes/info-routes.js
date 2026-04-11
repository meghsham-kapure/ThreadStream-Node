import { Router } from 'express';

const infoRouter = Router();

infoRouter.route("/health-check")
  .get((req, res) => {
    res.json({ message: "hello world" });
  })

export default infoRouter
