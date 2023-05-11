// import { Pezzo } from "@pezzo/client";
// import  AI21Integration from "@pezzo/integrations/src/lib/integrations/ai21";

// const apiKey = process.env["AI21_API_KEY"];

// if (!apiKey) {
//   throw new Error("AI21_API_KEY is not set");
// }

// async function main() {
//   const pezzo = new Pezzo({
//     pezzoServerURL: "http://localhost:3000",
//     environment: "development",
//   });

//   const ai21 = new AI21Integration.Executor(pezzo, {
//     apiKey,
//   });

//   const { result } = await ai21.run("CreateTasks", {
//     goal: "Renovate my bathroom",
//   });
//   console.log("result", result);
// }

// main();
