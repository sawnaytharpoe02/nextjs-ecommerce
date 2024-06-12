"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from "@/utils/generatePagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { usePathname, useSearchParams } from "next/navigation";

import React from "react";

const PagePagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage <= 1 ? (
              <div className="flex items-center gap-1 pr-6 cursor-pointer">
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="text-sm">Previous</span>
              </div>
            ) : (
              <PaginationPrevious href={createPageURL(currentPage - 1)} />
            )}
          </PaginationItem>

          {allPages.map((page, index) => {
            const isActive = currentPage === page;
            const isEllipsis = page === "...";

            const renderPaginationItem = () => {
              if (isActive) {
                return (
                  <PaginationLink href="#" isActive>
                    {page}
                  </PaginationLink>
                );
              }
              if (isEllipsis) {
                return <PaginationEllipsis />;
              }
              return (
                <PaginationLink href={createPageURL(page)}>
                  {page}
                </PaginationLink>
              );
            };

            return (
              <PaginationItem key={`${index}_${page}`}>
                {renderPaginationItem()}
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {currentPage >= totalPages ? (
              <div className="flex items-center gap-1 pl-6 cursor-pointer">
                <span className="text-sm">Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </div>
            ) : (
              <PaginationNext href={createPageURL(currentPage + 1)} />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PagePagination;
