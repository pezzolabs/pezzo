import express from "express";
import { MiniMaxV1Handler } from "../lib/MiniMaxHandler";
import { RequestWithPezzoClient } from "../types/common.types";
import { createPezzoClientFromRequest } from "../lib/middleware/create-openai-client-from-request";

export const minimaxRouter = express.Router();

minimaxRouter.use(createPezzoClientFromRequest);
minimaxRouter.use(async (req: RequestWithPezzoClient, res, next) => {
  const handler = new MiniMaxV1Handler(req, res);
  await handler.handleRequest();

  next();
});
