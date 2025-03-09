import { NextFunction, Response } from "express";
import { RequestWithPezzoClient } from "../../types/common.types";
import { Pezzo } from "pezzo/libs/client/src";

export function createPezzoClientFromRequest(
  req: RequestWithPezzoClient,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["x-pezzo-api-key"]) {
    return res.status(400).send("Missing x-pezzo-api-key header");
  }

  if (!req.headers["x-pezzo-project-id"]) {
    return res.status(400).send("Missing x-pezzo-project-id header");
  }

  if (!req.headers["x-pezzo-environment"]) {
    return res.status(400).send("Missing x-pezzo-environment header");
  }

  const options: {
    apiKey: string;
    projectId: string;
    environment: string;
    serverUrl?: string;
  } = {
    apiKey: req.headers["x-pezzo-api-key"] as string,
    projectId: req.headers["x-pezzo-project-id"] as string,
    environment: req.headers["x-pezzo-environment"] as string,
  };

  if (req.headers["x-pezzo-server-url"]) {
    options.serverUrl = req.headers["x-pezzo-server-url"] as string;
  }

  req.pezzo = new Pezzo(options);
  next();
}
