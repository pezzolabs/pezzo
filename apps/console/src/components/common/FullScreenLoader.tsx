import { Loader } from "./Loader";

export const FullScreenLoader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Loader />
    </div>
  );
};
