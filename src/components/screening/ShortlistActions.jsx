import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ShortlistActions({ onShortlist, onWaitlist }) {
  return (
    <Card className="flex flex-wrap gap-3">
      <Button onClick={onShortlist}>Shortlist Candidate</Button>
      <Button variant="secondary" onClick={onWaitlist}>
        Move To Waitlist
      </Button>
    </Card>
  );
}
