import { getModelDisplayDetails } from "./model-display-details";

interface Props {
  model: string;
  modelAuthor: string;
}

export const ModelDetails = ({ model, modelAuthor }: Props) => {
  // const displayDetails = getModelDisplayDetails(modelAuthor);
  return (
    <div className="flex items-center gap-x-2">
      {/*<img*/}
      {/*  src={displayDetails.image}*/}
      {/*  alt={displayDetails.name}*/}
      {/*  className="h-6 w-6 rounded-sm"*/}
      {/*/>*/}
      <div className="font-mono">{model}</div>
    </div>
  );
};
