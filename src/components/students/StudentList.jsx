import { useMemo, useState } from "react";
import SearchFilter from "@/components/common/SearchFilter";
import StudentCard from "@/components/students/StudentCard";

export default function StudentList({ students = [], onSelect }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  const filtered = useMemo(
    () =>
      students.filter((student) => {
        const matchesSearch = `${student.parsed_name} ${student.roll_number} ${student.skills.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesDepartment = department === "all" || student.department === department;
        return matchesSearch && matchesDepartment;
      }),
    [students, search, department]
  );

  return (
    <div className="space-y-4">
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={department}
        onFilterChange={setDepartment}
        filterOptions={[
          { label: "All Departments", value: "all" },
          ...["CSE", "IT", "ECE", "ME"].map((value) => ({ label: value, value }))
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((student) => (
          <StudentCard key={student.id} student={student} onClick={() => onSelect?.(student)} />
        ))}
      </div>
    </div>
  );
}
