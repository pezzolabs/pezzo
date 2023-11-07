import { DEBUG_MODE } from "~/env";

export const BreakpointDebugger = () => {
  if (!DEBUG_MODE) {
    return null;
  }

  return (
    <div className="absolute bottom-0 flex w-full items-center justify-center">
      <div className="bg-red-500 p-1 hidden sm:block">sm</div>
      <div className="bg-red-500 p-1 hidden md:block">md</div>
      <div className="bg-red-500 p-1 hidden lg:block">lg</div>
      <div className="bg-red-500 p-1 hidden xl:block">xl</div>
    </div>
  );
};
