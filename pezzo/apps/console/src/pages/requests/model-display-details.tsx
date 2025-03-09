import OpenAILogo from "src/assets/providers/openai-logo.png";
import MistralLogo from "src/assets/providers/mistral-logo.png";
import MetaLogo from "src/assets/providers/meta-logo.png";

export const modelAuthorDetails = {
  openai: {
    image: OpenAILogo,
    name: "OpenAI",
    color: "#3B976B",
  },
  mistral: {
    image: MistralLogo,
    name: "Mistral",
    color: "#cf651f",
  },
  meta: {
    image: MetaLogo,
    name: "Meta",
    color: "#579BE0",
  },
};

export const getModelDisplayDetails = (modelAuthor: string) => {
  const authorDetails = modelAuthorDetails[modelAuthor];

  if (!authorDetails) {
    return {
      image: <span></span>,
      name: "Unknown",
    };
  }

  return authorDetails;
};
