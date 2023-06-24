import axios from "axios";

export async function askQuestion(
  document: string,
  question: string
) {
  const { data } = await axios.post("/api/research", {
    document,
    question
  });

  return data;
}
