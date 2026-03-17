import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";

const colors = ["#f97316", "#fb7185", "#818cf8", "#22d3ee"];

export default function RejectionAnalysis({ data = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Rejection Analysis</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" outerRadius={100}>
              {data.map((item, index) => (
                <Cell key={item.label} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
