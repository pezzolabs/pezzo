// import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
// import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
//
// import { errorHandler } from "supertokens-node/framework/express";
// import { Error as STError } from "supertokens-node";
//
// @Catch(STError)
// export class SupertokensExceptionFilter implements ExceptionFilter {
//   handler: ErrorRequestHandler;
//
//   constructor() {
//     this.handler = errorHandler();
//   }
//
//   catch(exception: Error, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//
//     const resp = ctx.getResponse<Response>();
//     if (resp.headersSent) {
//       return;
//     }
//
//     this.handler(
//       exception,
//       ctx.getRequest<Request>(),
//       resp,
//       ctx.getNext<NextFunction>()
//     );
//   }
// }
