import "reflect-metadata";
import express from "express";
import { openaiRouter } from "./routers/openai.router";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/openai/v1", openaiRouter);

app.get("/healthz", (_, res) => {
  res.status(200).send("OK");
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});