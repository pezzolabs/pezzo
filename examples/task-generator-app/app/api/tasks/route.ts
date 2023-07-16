import { NextResponse } from "next/server";
import { openai, pezzo } from "../../lib/pezzo";
import { GetPromptResult } from "@pezzo/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, numTasks } = body;

  let prompt: GetPromptResult;

  try {
    prompt = await pezzo.getPrompt("GenerateTasks", {
      variables: {
        goal,
        numTasks,
      },
    });
  } catch (error) {
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
    const result = await openai.createChatCompletion(prompt);
    console.log("result", result.data.choices);

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
