import { openai, pezzo } from "../../lib/pezzo";

async function test() {
  const prompt = await pezzo.getPrompt("TestPrompt", {
    variables: {
      goal: "Become a chef",
      numTasks: 2,
    },
  });

  console.log("prompt.settings", prompt.pezzo.settings);

  try {
    const response = await openai.createChatCompletion(prompt);
    const tasks = JSON.parse(response.data.choices[0].message.content);
    console.log("tasks", tasks);
  } catch (error) {
    console.error("error", error.response.data);
  }
}

test();
