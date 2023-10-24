import { BreadcrumbItem } from "~/lib/hooks/useBreadcrumbItems";

interface Props {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: Props) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
