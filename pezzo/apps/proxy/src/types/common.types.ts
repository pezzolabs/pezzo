import { Pezzo } from "pezzo/libs/client/src";
import { Request } from "express";

export interface RequestWithPezzoClient extends Request {
  pezzo: Pezzo;
}
