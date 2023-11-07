import { cn } from "@pezzo/ui/utils";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "~/lib/hooks/useBreadcrumbItems";

interface Props {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: Props) => {
  return (
    <div className="text-sm">
      <ul className="flex items-center gap-1">
        {items.map((item, index) => (
          <div className="flex items-center gap-1" key={`div_${index}`}>
            <ChevronRight
              className={cn("h-4 w-4 text-stone-400", { hidden: index === 0 })}
            />
            <li key={item.key}>{item.title}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};
