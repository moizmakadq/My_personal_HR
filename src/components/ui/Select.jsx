import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";

export default Select;
