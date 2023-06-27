import { openai } from "../../lib/pezzo";
import { OpenAIStream, StreamingTextResponse } from "ai";

async function readStreamAndReport(reader, messages) {
  let fullContent = "";
  const textDecoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    fullContent += textDecoder.decode(value);
  }

  const newMessage = {
    role: "assistant",
    content: fullContent,
  };

  const newMessages = [...messages, newMessage];
  console.log("newMessages", newMessages);
}

export async function POST(request: Request) {
  const { messages, chatId } = await request.json();

  console.log("chatId", chatId);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    stream: true,
  });

  // console.log('response', response);

  const stream = OpenAIStream(response);
  // Tee the stream
  const [stream1, stream2] = stream.tee();

  // Get a reader for the first stream
  const reader = stream1.getReader();
  readStreamAndReport(reader, messages);

  // Stream the second stream to the client
  return new StreamingTextResponse(stream2);
}
