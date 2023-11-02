import { cn } from "@pezzo/ui/utils";
import colors from "tailwindcss/colors";

type Props = {
  children: React.ReactNode;
  color?: string;
};

export const Tag = ({ children, color = "stone" }: Props) => {
  const baseCn = "rounded-sm border p-1 text-xs flex gap-1 items-center h-6";

  return (
    <div
      className={cn(
        baseCn,
        `border-${color}-600 bg-${color}-950/70 text-${color}-400`
      )}
    style={{
      backgroundColor: colors[color][950],
      borderColor: colors[color][600],
      color: colors[color][400],
    }}
    >
      {children}
    </div>
  );
};
