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
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { SetStateAction, useState } from "react";

const PagePagination = ({
  totalPages,
  itemsPerPage,
}: {
  totalPages: number;
  itemsPerPage: number;
}) => {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [selectedPageCount, setSelectedPageCount] =
    useState<number>(itemsPerPage);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    params.set("count", selectedPageCount?.toString());
    return `${pathname}?${params.toString()}`;
  };

  const createPageCount = (value: number) => {
    setSelectedPageCount(value);
    const params = new URLSearchParams(searchParams);
    params.set("count", value.toString());
    params.set("page", '1'); // Reset to the first page when count changes
    const newURL = `${pathname}?${params.toString()}`;
    router.push(newURL);
  };


  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="w-full flex items-center justify-between">
      <div className="w-full flex items-center gap-2">
        <p className="text-sm">Items Per Page</p>
        <Select onValueChange={(value) => createPageCount(Number(value))}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent className="w-fit">
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
