import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function SearchFilter({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions = []
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Input placeholder="Search..." value={searchValue} onChange={(event) => onSearchChange?.(event.target.value)} />
      {filterOptions.length ? (
        <Select value={filterValue} onChange={(event) => onFilterChange?.(event.target.value)} className="md:max-w-xs">
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
    </div>
  );
}
