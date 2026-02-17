import React from "react";
import { HiSearch } from "react-icons/hi";
import Input from "../Input";

interface FiltersProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

export default function FermentListFilters({ globalFilter, setGlobalFilter, statusFilter, setStatusFilter }: FiltersProps) {
  return (
    <div className="ferment-list--filters">
      <select 
        onChange={e => setStatusFilter(e.target.value)} 
        aria-label="Filter ferments" 
        value={statusFilter}
        name="status"
      >
        <option value="">All Ferments</option>
        <option value="Active">Active Ferments</option>
        <option value="Complete">Completed Ferments</option>
        <option value="Planned">Planned Ferments</option>
      </select>
      <Input 
        id="ferment-search"
        label="Search ferments"
        showLabel={false}
        addon={<HiSearch size={18} />}
        type="search" 
        placeholder="Search ferments..." 
        value={String(globalFilter || '')} 
        onChange={e => setGlobalFilter(e.target.value)} 
      />
    </div>
  );
}