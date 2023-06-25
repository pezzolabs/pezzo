import { NextResponse } from "next/server";
import { pezzo, openai } from "../../lib/pezzo";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(request: Request) {
  const body = await request.json();
  const { document, question, prompt: _prompt } = body;

  // let prompt;

  try {
    // prompt = await pezzo.getPrompt("ResearchDocument", {
    //   variables: {
    //     document,
    //     question,
    //   },
    // });
  } catch (error) {
    console.error("Could not get prompt from Pezzo", error);
    return NextResponse.json(
      {
        message: "Could not get prompt from Pezzo",
      },
      {
        status: 500,
      }
    );
  }

  try {
    // const settings = prompt.getChatCompletionSettings();
    // console.log("_prompt", _prompt);
    // console.log("settings", settings)

    const response = await openai.createChatCompletion({
      temperature: 1,
      max_tokens: 200,
      model: "gpt-3.5-turbo",
      // stream: true,
      messages: [
        { role: "user", content: "What year was Israel established?" },
      ]
    });

    console.log("response", response);

    // const settings = prompt.getChatCompletionSettings();
    // const response = await openai.createChatCompletion({ ...settings, stream: true, messages });
    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);
    const parsed = JSON.parse(response.data.choices[0].message.content);
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
