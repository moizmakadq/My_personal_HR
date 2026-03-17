import { Target } from "lucide-react";
import { DEMO_MODE_MESSAGE, isDemoMode } from "@/config/supabase";

export default function DemoBanner() {
  if (!isDemoMode) return null;
  return (
    <div className="rounded-3xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-200">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        {DEMO_MODE_MESSAGE}
      </div>
    </div>
  );
}
