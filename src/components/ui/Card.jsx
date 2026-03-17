import { cn } from "@/lib/utils";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
