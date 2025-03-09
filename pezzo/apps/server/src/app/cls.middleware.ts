import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { namespace, initRequestWithContext } from "./cls.utils";

@Injectable()
export class ClsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      namespace.bindEmitter(req);
      namespace.bindEmitter(res);
      const nextWithContext = initRequestWithContext(next);
      nextWithContext();
    } catch (err) {
      res.status(500).send({});
    }
  }
}
