import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";

const colors = ["#0891b2", "#22c55e", "#f97316", "#e11d48", "#8b5cf6"];

export default function DepartmentChart({ data = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Department Mix</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" outerRadius={100}>
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
