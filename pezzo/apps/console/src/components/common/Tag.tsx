import { cn } from "../../../../../libs/ui/src/utils";
import colors from "tailwindcss/colors";

type Props = {
  children: React.ReactNode;
  color?: string;
  className?: string;
};

export const Tag = ({ children, color = "stone", className = "" }: Props) => {
  const baseCn = cn(
    "rounded-sm border p-1 text-xs inline-flex gap-1 items-center h-6",
    className
  );

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
