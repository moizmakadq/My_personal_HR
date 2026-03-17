import { cn } from "@/lib/utils";

export default function Slider({ className, value, ...props }) {
  return (
    <input
      type="range"
      value={value}
      className={cn("h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600", className)}
      {...props}
    />
  );
}
