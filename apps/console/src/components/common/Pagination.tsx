import { Button } from "@pezzo/ui";
import { cn } from "@pezzo/ui/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  offset: number;
  limit: number;
  totalResults: number;
  onChange: (page: number, limit: number) => void;
};

function generatePagination(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const pages: (number | string)[] = [];

  // Lower limit for pagination
  const lowerLimit = Math.max(1, currentPage - 3);

  // Upper limit for pagination
  const upperLimit = Math.min(totalPages, currentPage + 1);

  // If there are more pages before the lower limit, add "..."
  if (lowerLimit > 1) {
    pages.push(1);
    pages.push("...");
  }

  // Add the page numbers
  for (let i = lowerLimit; i <= upperLimit; i++) {
    pages.push(i);
  }

  // If there are more pages after the upper limit, add "..."
  if (upperLimit < totalPages) {
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

export const Pagination = ({
  offset,
  limit,
  totalResults,
  onChange,
}: Props) => {
  // calculate currentPage, bsaed on offset and totalResults and limit (size of page)
  const currentPage = Math.ceil((offset + 1) / limit);
  const totalPages = Math.ceil(totalResults / limit);
  const pagination = generatePagination(currentPage + 1, totalPages);

  const handlePageClick = (_page: string) => {
    const page = parseInt(_page);
    onChange(page, limit);
  };

  const pagesToRender = pagination.map((page, idx) => {
    if (page === "...") {
      return (
        <li key={idx}>
          <Button disabled size="icon" variant="ghost">
            {page}
          </Button>
        </li>
      );
    }

    const selected = page === currentPage;

    return (
      <li key={idx}>
        <Button
          key={idx}
          size="icon"
          variant={selected ? "outline" : "ghost"}
          className={cn(selected && "border-primary text-primary")}
          onClick={() => handlePageClick(`${page}`)}
        >
          {page}
        </Button>
      </li>
    );
  });

  return (
    <ul className="flex gap-x-1">
      <li>
        <Button
          onClick={() => handlePageClick(`${currentPage - 1}`)}
          disabled={currentPage <= 1}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </li>

      {pagesToRender.map((Page) => Page)}

      <li>
        <Button
          onClick={() => handlePageClick(`${currentPage + 1}`)}
          disabled={currentPage >= totalPages}
          size="icon"
          variant="ghost"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </li>
    </ul>
  );
};
