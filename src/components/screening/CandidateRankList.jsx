import DataTable from "@/components/common/DataTable";
import TrustScoreBadge from "@/components/common/TrustScoreBadge";
import StatusBadge from "@/components/common/StatusBadge";

export default function CandidateRankList({ applications = [], onSelect }) {
  return (
    <DataTable
      columns={[
        { key: "student_name", label: "Candidate" },
        { key: "match_score", label: "Match", render: (row) => `${Math.round(row.match_score)}%` },
        { key: "trust", label: "Trust", render: (row) => <TrustScoreBadge value={row.trust_score_at_application} /> },
        { key: "status", label: "Status", render: (row) => <StatusBadge value={row.screening_status} /> },
        {
          key: "action",
          label: "",
          render: (row) => (
            <button className="text-brand-600" onClick={() => onSelect?.(row)}>
              View
            </button>
          )
        }
      ]}
      data={[...applications].sort((a, b) => b.match_score - a.match_score)}
    />
  );
}
