import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "~/lib/hooks/useBreadcrumbItems";

interface Props {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: Props) => {
  return (
    <div className="text-sm">
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <>
            <ChevronRight className="h-4 w-4 text-stone-400 first:hidden" />
            <li key={item.key}>
              {item.title}
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};
