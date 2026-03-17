export default function Tooltip({ content, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-1 text-xs text-white shadow-lg group-hover:block">
        {content}
      </span>
    </span>
  );
}
