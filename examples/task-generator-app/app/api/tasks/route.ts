import { NextResponse } from "next/server";
import { openai, pezzo } from "../../lib/pezzo";

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, numTasks } = body;

  const resulting = await pezzo.getOpenAiPrompt("TasksGenerator", {
    variables: {
      goal,
      numTasks,
      maxLength: 10,
    }
  });


  const settings = resulting.getChatCompletionSettings();

  let result;

  try {
    result = await openai.createChatCompletion(settings);
    // const parsed = JSON.parse(result.data.choices[0].message.content);
    // TODO: this is a temporary place holder for as long as we fix the git state issues
    const parsed = JSON.parse(result.data.choices[0].message.content);
    return NextResponse.json(parsed, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {

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
