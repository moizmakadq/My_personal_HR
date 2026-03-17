import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ items = [], defaultValue, onChange }) {
  const [active, setActive] = useState(defaultValue || items[0]?.value);
  const selected = items.find((item) => item.value === active) || items[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-900">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              setActive(item.value);
              onChange?.(item.value);
            }}
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-semibold transition",
              active === item.value
                ? "bg-white text-brand-700 shadow dark:bg-slate-800 dark:text-brand-300"
                : "text-slate-600 dark:text-slate-300"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{selected?.content}</div>
    </div>
  );
}

export default Tabs;
