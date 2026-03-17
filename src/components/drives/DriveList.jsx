import { useMemo, useState } from "react";
import DriveCard from "@/components/drives/DriveCard";
import SearchFilter from "@/components/common/SearchFilter";

export default function DriveList({ drives = [], onSelect }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(
    () =>
      drives.filter((drive) => {
        const matchesSearch = `${drive.title} ${drive.company_name} ${drive.job_role}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = status === "all" || drive.status === status;
        return matchesSearch && matchesStatus;
      }),
    [drives, search, status]
  );

  return (
    <div className="space-y-4">
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={status}
        onFilterChange={setStatus}
        filterOptions={[
          { label: "All Statuses", value: "all" },
          ...["draft", "upcoming", "screening", "completed"].map((value) => ({ label: value, value }))
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((drive) => (
          <DriveCard key={drive.id} drive={drive} onClick={() => onSelect?.(drive)} />
        ))}
      </div>
    </div>
  );
}
