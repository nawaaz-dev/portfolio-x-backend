import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";

const rootRouter = Router();

/* GET home page. */
rootRouter.get("/", (req: Request, res: Response) => {
  res.json({ title: "Extractor!" });
});

export default rootRouter;
