import React from "react";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi";
import type { Table } from "@tanstack/react-table";
import type { FermentEntry } from "../../types";
import IconButton from "../IconButton";

interface FermentListFooterProps {
  table: Table<FermentEntry>;
}

export default function FermentListPagination({ table }: FermentListFooterProps) {
  return (
    <div className="ferment-list--pagination">
      <div className="ferment-list--pagination-controls" role="group">
        <IconButton 
          label="First page"
          variant="secondary"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <HiChevronDoubleLeft size={18} />
        </IconButton>
        <IconButton
          label="Previous page"
          variant="secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <HiChevronLeft size={18} />
        </IconButton>
        <IconButton
          label="Next page"
          variant="secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <HiChevronRight size={18} />
        </IconButton>
        <IconButton
          label="Last page"
          variant="secondary"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <HiChevronDoubleRight size={18} />
        </IconButton>
      </div>
    </div>
  );
}