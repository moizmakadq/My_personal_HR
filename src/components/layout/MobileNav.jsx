import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/config/constants";
import useAuth from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const { role } = useAuth();
  const { mobileNavOpen, toggleMobileNav } = useUiStore();
  const items = NAV_ITEMS[role] || [];

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden">
      <div className="h-full w-72 bg-slate-950 p-5 text-white">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Menu</h3>
          <button onClick={toggleMobileNav} className="rounded-xl bg-slate-800 px-3 py-1 text-sm">
            Close
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={toggleMobileNav}
              className={({ isActive }) =>
                cn(
                  "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive ? "bg-white text-slate-900" : "bg-slate-900/70 text-slate-200"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
