import Badge from "@/components/ui/Badge";

export default function TrustScoreBadge({ value }) {
  const tone = value >= 80 ? "emerald" : value >= 60 ? "amber" : "rose";
  return <Badge tone={tone}>Trust {Math.round(value)}/100</Badge>;
}
