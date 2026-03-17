import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import Switch from "@/components/ui/Switch";
import { useUiStore } from "@/store/uiStore";

export default function Settings() {
  const { theme, toggleTheme } = useUiStore();
  return (
    <MainLayout title="Settings" subtitle="Environment, theme, and demo-mode controls.">
      <Card className="space-y-4">
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Dark mode</p>
            <p className="text-sm text-slate-500">Toggle the full dashboard theme.</p>
          </div>
          <Switch checked={theme === "dark"} onChange={toggleTheme} />
        </div>
      </Card>
    </MainLayout>
  );
}
