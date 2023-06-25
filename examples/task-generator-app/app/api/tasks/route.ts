import { NextResponse } from "next/server";
import { pezzo, openai } from "../../lib/pezzo";

export async function POST(request: Request) {
  const body = await request.json();
  const { goal, numTasks } = body;

  let prompt, settings;
  let result;

  try {

    result = await openai.createChatCompletion({
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
          `
				},
      ]
    });

    console.log("result.data", JSON.stringify(result.data, null, 2));

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
