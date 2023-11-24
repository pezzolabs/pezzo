import { Pezzo } from "@pezzo/client";
import { Request } from "express";

export interface RequestWithPezzoClient extends Request {
  pezzo: Pezzo;
}
