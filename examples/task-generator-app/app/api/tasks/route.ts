import { NextResponse } from "next/server";
import { openai } from "../../lib/pezzo";
import { CreatePezzoChatCompletionRequest } from "@pezzo/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, numTasks } = body;

  let result;

  try {
    const reqBody: CreatePezzoChatCompletionRequest = {
      pezzo: {
        metadata: {
          conversationId: "task-generator",
        },
        properties: {
          userId: "user-uuid123",
        },
      },
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

    result = await openai.createChatCompletion(reqBody);

    // const parsed = JSON.parse(result.data.choices[0].message.content);
    // TODO: this is a temporary place holder for as long as we fix the git state issues
    const parsed = JSON.parse(result.data.choices[0].text);
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
