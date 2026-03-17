import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import DemoBanner from "@/components/common/DemoBanner";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

export default function TopNav({ title, subtitle }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toggleSidebar, toggleMobileNav, theme, toggleTheme } = useUiStore();
  const { signOut } = useAuthStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleMobileNav}>
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-sm dark:bg-slate-900 md:block">
            <div className="font-semibold text-slate-900 dark:text-white">{profile?.full_name}</div>
            <div className="text-slate-500">{profile?.role}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const next = await signOut();
              navigate(next);
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DemoBanner />
    </div>
  );
}
