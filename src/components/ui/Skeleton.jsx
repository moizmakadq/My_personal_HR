export default function Skeleton({ className = "h-5 w-full" }) {
  return <div className={`${className} animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800`} />;
}
