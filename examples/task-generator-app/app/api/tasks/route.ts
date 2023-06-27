import { NextResponse } from "next/server";
import { openai } from "../../lib/pezzo";
import axios from "axios";
import { CreateChatCompletionRequest } from "openai";

interface ReportData {
  provider: "openai";
  type: "chat";
  metadata?: Record<string, string | boolean | number>;
  properties?: Record<string, string | boolean | number>;
  request: {
    timestamp: string;
    body: unknown;
  };
  response: {
    timestamp: string;
    body: unknown;
    status: number;
  };
}

async function report(reportData: ReportData) {
  console.log("Reporting...");
  const result = await axios.post(
    "http://localhost:3000/api/reporting/v2/request",
    {
      provider: "openai",
      type: "chat",
      metadata: reportData.metadata || {},
      properties: reportData.properties || {},
      request: reportData.request,
      response: reportData.response,
    },
    {
      headers: {
        "x-pezzo-api-key": "pez_94468bd338413d30832f19f91c4f9d08",
        "x-pezzo-project-id": "cliuaizl60100jepmcj33pdq3",
      },
    }
  );

  const { data } = result;
  console.log("Reported", data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, numTasks } = body;

  let result;

  try {
    const reqBody: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 1000,
      messages: [
        {
          role: "assistant",
          content: `
          You'll help me generate tasks to achieve my goal. You will create exactly ${numTasks} tasks.

          My goal is: ${goal}

          You must respond in valid JSON, strictly adhering to the following schema:
          
          {
            tasks: string[];
          }
          `,
        },
      ],
    };

    const requestTimestamp = new Date().toISOString();

    result = await openai.createChatCompletion(reqBody);

    const responseTimestamp = new Date().toISOString();

    const { request, ...response } = result;

    report({
      provider: "openai",
      type: "chat",
      request: {
        timestamp: requestTimestamp,
        body: reqBody,
      },
      response: {
        timestamp: responseTimestamp,
        body: response.data,
        status: response.status,
      },
      metadata: {
        conversationId: "1234",
      },
    });

    const parsed = JSON.parse(result.data.choices[0].message.content);
    return NextResponse.json(parsed, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error parsing response", error);
    let message;

    if (error.response?.errors) {
      // Handle Pezzo Server GraphQL errors
      message = error.response.errors[0].message;
    } else {
      message =
        "Prompt execution failed. Check the Pezzo History tab for more information.";
    }

    return NextResponse.json(
      {
        message,
      },
      {
        status: 500,
      }
    );
  }
}
