import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Card className="py-10 text-center">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{description}</p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
