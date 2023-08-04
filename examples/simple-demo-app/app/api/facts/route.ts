import { NextResponse } from "next/server";
import { openai, pezzo } from "../../lib/pezzo";
import { GetPromptResult } from "@pezzo/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, numFacts } = body;

  let prompt: GetPromptResult;

  try {
    prompt = await pezzo.getPrompt("GenerateFacts");
  } catch (error) {
    console.log("Failed to fetch prompt from Pezzo", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }

  try {
    const result = await openai.createChatCompletion(prompt, {
      variables: {
        numFacts,
        topic,
      },
      properties: {
        traceId: "SomeTraceId123",
      },
    });

    const parsed = JSON.parse(result.data.choices[0].message.content);
    return NextResponse.json(parsed, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "Prompt execution failed. Check the Pezzo History tab for more information.",
      },
      {
        status: 500,
      }
    );
  }
}
