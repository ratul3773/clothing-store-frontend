"use client";

import { Pick } from "../ui/controls";
import type { PageMeta } from "@/redux/api.utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Select } from "../cms/ui";

interface PaginationProps {
  mode?: "animated" | "normal";
  paginationInfo: PageMeta;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
  itemsLabel?: string;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  showSummary?: boolean;
  firstLabel?: string;
  lastLabel?: string;
}

function generatePageNumbers(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }
      return pages;
    }

    const addPage = (page: number) => {
      if (!pages.includes(page)) {
        pages.push(page);
      }
    };

    const addEllipsis = () => {
      if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    };

    addPage(1);
    addPage(2);

    const startPage = Math.max(3, currentPage - 1);
    const endPage = Math.min(totalPages - 2, currentPage + 1);

    if (startPage > 3) {
      addEllipsis();
    }

    for (let page = startPage; page <= endPage; page++) {
      addPage(page);
    }

    if (endPage < totalPages - 2) {
      addEllipsis();
    }

    addPage(totalPages - 1);
    addPage(totalPages);

    return pages;
  };

export default function PaginationComponent({
  mode = "animated",
  paginationInfo,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 30],
  className = "",
  itemsLabel = "items",
  showFirstLast = false,
  showPageNumbers,
  showSummary = true,
  firstLabel = "First",
  lastLabel = "Last",
}: PaginationProps) {
  const isAdmin = mode === "normal";
  const displayPageNumbers = showPageNumbers ?? !isAdmin;
  const { page: currentPage, totalPage: totalPages, limit: itemsPerPage, total: totalItems } = paginationInfo;
  const showingStart = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalItems);

   const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    if (!isAdmin) window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    onPageChange(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    onItemsPerPageChange?.(limit);
    if (!isAdmin) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = displayPageNumbers ? generatePageNumbers(currentPage, totalPages) : [];

  return (
    <div className={`flex w-full flex-col gap-4 mt-6 sm:mt-8 mb-2 sm:flex-row lg:items-center lg:justify-between ${className}`}>
      {showSummary && (onItemsPerPageChange ? (
        <div className="flex w-full flex-wrap px-2 items-center justify-start gap-2 text-sm text-gray-700">
          <span>Showing</span>
          {isAdmin ? (
            <Select
              aria-label="Items per page"
              value={itemsPerPage}
              onChange={(event) => handleItemsPerPageChange(Number(event.target.value))}
              className="h-8 w-15 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {itemsPerPageOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </Select>
          ) : <Pick 
          value={itemsPerPage.toString()} 
          onChange={(value) => handleItemsPerPageChange(Number(value))}
          options={itemsPerPageOptions.map((option) => ({ value: option.toString(), label: option.toString() }))}
          label="Items per page"
          />}
          <span className="break-words">
            {showingStart && showingEnd
              ? `${showingStart} to ${showingEnd} of ${totalItems} ${itemsLabel}`
              : `of ${totalItems} ${itemsLabel}`}
          </span>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          {showingStart && showingEnd
            ? `Showing ${showingStart} to ${showingEnd} of ${totalItems} ${itemsLabel}`
            : `Showing ${totalItems} ${itemsLabel}`}
        </div>
      ))}

      {totalPages > 0 && (
        
        <Pagination>
          <PaginationContent>
            {showFirstLast && (
              <PaginationItem>
                <PaginationLink
                  mode={mode}
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(1);
                    }
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                >
                  {firstLabel}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationPrevious
                mode={mode}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>

            {displayPageNumbers && pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    mode={mode}
                    href="#"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {isAdmin && !displayPageNumbers && (
              <PaginationItem>
                <span className="px-2 text-xs tabular-nums text-muted-foreground" aria-live="polite">
                  Page {currentPage} / {totalPages}
                </span>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                mode={mode}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>

              {showFirstLast && (
                <PaginationItem>
                  <PaginationLink
                    mode={mode}
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(totalPages);
                      }
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  >
                    {lastLabel}
                  </PaginationLink>
                </PaginationItem>
              )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
