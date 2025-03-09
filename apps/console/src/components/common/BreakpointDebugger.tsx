import { DEBUG_MODE } from "~/env";

export const BreakpointDebugger = () => {
  if (!DEBUG_MODE) {
    return null;
  }

  return (
    <div className="absolute bottom-0 flex w-full items-center justify-center">
      <div className="hidden bg-red-500 p-1 sm:block">sm</div>
      <div className="hidden bg-red-500 p-1 md:block">md</div>
      <div className="hidden bg-red-500 p-1 lg:block">lg</div>
      <div className="hidden bg-red-500 p-1 xl:block">xl</div>
    </div>
  );
};
