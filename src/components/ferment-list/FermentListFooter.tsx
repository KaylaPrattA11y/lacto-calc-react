import React from "react";
import type { Table } from "@tanstack/react-table";
import type { FermentEntry } from "../../types";

interface FermentListFooterProps {
  table: Table<FermentEntry>;
}

export default function FermentListFooter({ table }: FermentListFooterProps) {
  return (
    <div className="ferment-list--footer">
      <div>

        <div>
          <small>
            Page&nbsp;
            <strong>
              {table.getState().pagination.pageIndex + 1}</strong> of{' '}
              {table.getPageCount().toLocaleString()}
          </small>
        </div>
        <div>
          <small>
            Showing <strong>{table.getRowModel().rows.length.toLocaleString()}</strong> of{' '}
            {table.getRowCount().toLocaleString()} Rows
          </small>
        </div>
        <div>
          <select
            className="is-sm"
            aria-label="Select maximum displayed pages"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        {/* <span className="ferment-list--pagination-quicknav">
          <div>Go to page:</div>
          <Input
            id="goto-page"
            label="Go to page"
            showLabel={false}
            addon="#"
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
          />
        </span> */}
      </div>
      <p><small>Your privacy is important; all data is stored locally in your browser and is not shared with anyone.</small></p>  
    </div>
  );
}