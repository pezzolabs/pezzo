import fetch from "cross-fetch";

const serverUrl = "http://sn-gai-api.ai.smartnews.net";

export async function getModels(): Promise<[string]> {
  const response = await fetch(serverUrl + "/v3/models", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    if (data?.message) {
      throw new Error(data.message);
    } else {
      throw new Error(
        `Error fetching prompt models and status code is (${data.statusCode}).`
      );
    }
  } else {
    return data.models;
  }
}

// export class Pezzo {
//   options: PezzoClientOptions;
//
//   constructor(options: PezzoClientOptions) {
//     this.options = {
//       serverUrl:
//         options.serverUrl ||
//         process.env["PEZZO_SERVER_URL"] ||
//         defaultOptions.serverUrl,
//       apiKey: options.apiKey || process.env["PEZZO_API_KEY"],
//       projectId: options.projectId || process.env["PEZZO_PROJECT_ID"],
//       environment: options.environment || process.env["PEZZO_ENVIRONMENT"],
//       ...options,
//     };
//   }
//
//   async getPrompt(promptName: string): Promise<{ pezzo: Prompt }> {
//     const url = new URL(`${this.options.serverUrl}/api/prompts/v2/deployment`);
//     url.searchParams.append("name", promptName);
//     url.searchParams.append("environmentName", this.options.environment);
//
//     const response = await fetch(url.toString(), {
//       headers: {
//         "Content-Type": "application/json",
//         "x-pezzo-api-key": this.options.apiKey,
//         "x-pezzo-project-id": this.options.projectId,
//       },
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       if (data?.message) {
//         throw new Error(data.message);
//       } else {
//         throw new Error(
//           `Error fetching prompt "${promptName}" for environment "${this.options.environment}" (${data.statusCode}).`
//         );
//       }
//     }
//
//     const pezzoPrompt: Prompt = {
//       metadata: {
//         promptId: data.promptId,
//         promptVersionSha: data.promptVersionSha,
//         type: data.type,
//       },
//       settings: data.settings,
//       content: data.content,
//     };
//
//     return {
//       pezzo: pezzoPrompt,
//     };
//   }
//
//   async reportPromptExecution(dto: ReportData) {
//     const response = await fetch(
//       `${this.options.serverUrl}/api/reporting/v2/request`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-pezzo-api-key": this.options.apiKey,
//           "x-pezzo-project-id": this.options.projectId,
//         },
//         body: JSON.stringify(dto),
//       }
//     );
//
//     if (!response.ok) {
//       const json = await response.json();
//       console.warn("Could not report prompt execution", json);
//     }
//   }
// }
