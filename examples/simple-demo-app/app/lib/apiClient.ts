import axios from "axios";

export async function askQuestion(document: string, question: string) {
  const { data } = await axios.post("/api/research", {
    document,
    question,
  });

  return data;
}

export interface FactsResult {
  facts: string[];
}

export async function generateFacts(
  topic: string,
  numFacts: number
): Promise<FactsResult> {
  const { data } = await axios.post("/api/facts", {
    topic,
    numFacts,
  });

  return data as FactsResult;
}
