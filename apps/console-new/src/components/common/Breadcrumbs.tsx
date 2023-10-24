import { BreadcrumbItem } from "~/lib/hooks/useBreadcrumbItems";

type Props = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {items.map((item, index) => (
          <li key={item.key}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
