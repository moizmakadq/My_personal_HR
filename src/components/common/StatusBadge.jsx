import Badge from "@/components/ui/Badge";

const toneMap = {
  shortlisted: "emerald",
  selected: "emerald",
  completed: "emerald",
  upcoming: "sky",
  screening: "amber",
  waitlisted: "amber",
  rejected: "rose",
  filtered_out: "rose",
  draft: "slate",
  pending: "slate"
};

export default function StatusBadge({ value }) {
  return <Badge tone={toneMap[value] || "slate"}>{String(value || "unknown").replace("_", " ")}</Badge>;
}
