import { Link, NavLink } from "react-router-dom";
import { APP_NAME, NAV_ITEMS } from "@/config/constants";
import useAuth from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { role } = useAuth();
  const { sidebarOpen } = useUiStore();
  const items = NAV_ITEMS[role] || [];

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-white/50 bg-slate-950 px-4 py-6 text-slate-300 lg:flex",
        sidebarOpen ? "w-72" : "w-24"
      )}
    >
      <Link to="/" className="mb-8 flex items-center gap-3 px-3">
        <div className="rounded-2xl bg-brand-500 px-3 py-2 font-display text-lg font-bold text-white">PR</div>
        {sidebarOpen ? (
          <div>
            <div className="font-display text-lg font-bold text-white">{APP_NAME}</div>
            <div className="text-xs text-slate-400">Trust-first placements</div>
          </div>
        ) : null}
      </Link>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive ? "bg-white text-slate-900" : "hover:bg-slate-900 hover:text-white"
              )
            }
          >
            {sidebarOpen ? item.label : item.label.slice(0, 1)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
