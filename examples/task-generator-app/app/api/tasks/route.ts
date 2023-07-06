import { NextResponse } from "next/server";
import { openai, pezzo } from "../../lib/pezzo";

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, numTasks } = body;

  let prompt;
  let settings;

  try {
    prompt = await pezzo.getOpenAIPrompt("GenerateTasks", {
      variables: {
        goal,
        numTasks,
      },
    });

    settings = prompt.getChatCompletionSettings();
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

  let result;

  try {
    result = await openai.createChatCompletion(settings);

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
