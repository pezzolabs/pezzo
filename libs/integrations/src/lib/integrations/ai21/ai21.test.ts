import { AI21Executor } from "./Executor";

const apiKey = process.env['AI21_API_KEY'];

if (!apiKey) {
  throw new Error("AI21_API_KEY is not set");
}

const integration = new AI21Executor({
  pezzoServerURL: "http://localhost:3000",
  environment: 'development',
  apiKey,
});

interface TaskResponse {
  tasks: string[];
}

async function main() {
  const { result } = await integration.run<TaskResponse>("TestDellaPrompt", {
  });
  console.log('result', result);
}

main();
