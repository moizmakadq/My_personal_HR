import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const colorFor = (category) =>
  category === "diamond" ? "#22c55e" : category === "paper_tiger" ? "#f97316" : "#0891b2";

export default function ScatterPlot({ data = [] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="preScore" name="Pre Score" domain={[0, 100]} />
          <YAxis type="number" dataKey="interviewScore" name="Interview Score" domain={[0, 100]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={colorFor(entry.category)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
