import { pino } from "pino";
import pretty from "pino-pretty";

export function createLogger(context = {}) {
  let logger: pino.Logger;

  if (process.env.PINO_PRETTIFY === "true") {
    const prettyStream = pretty({
      levelFirst: true,
      colorize: true,
    });
    logger = pino({ redact: ["pid", "hostname", "res"] }, prettyStream);
  } else {
    logger = pino({ redact: ["pid", "hostname", "res"] });
  }

  const child = logger.child(context);
  return child;
}
