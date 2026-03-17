import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DropdownMenu({ items = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button size="sm" variant="ghost" onClick={() => setOpen((value) => !value)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 min-w-[180px] rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
