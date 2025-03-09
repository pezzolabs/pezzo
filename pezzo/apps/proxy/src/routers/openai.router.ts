import express from "express";
import { OpenAIV1Handler } from "../lib/OpenAIHandler";
import { RequestWithPezzoClient } from "../types/common.types";
import { createPezzoClientFromRequest } from "../lib/middleware/create-openai-client-from-request";

export const openaiRouter = express.Router();

openaiRouter.use(createPezzoClientFromRequest);
openaiRouter.use(async (req: RequestWithPezzoClient, res, next) => {
  const handler = new OpenAIV1Handler(req, res);
  await handler.handleRequest();

  next();
});
