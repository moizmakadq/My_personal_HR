import { initials } from "@/lib/utils";

export default function Avatar({ name, src, className = "h-10 w-10" }) {
  if (src) {
    return <img src={src} alt={name} className={`${className} rounded-full object-cover`} />;
  }

  return (
    <div className={`${className} flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300`}>
      {initials(name)}
    </div>
  );
}
