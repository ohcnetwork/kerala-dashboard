import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CustomizedXAxisTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text className="text-xs" x={0} y={0} dy={16} fill="#666">
        {payload.value.split("-2020")[0]}
      </text>
    </g>
  );
}

function CustomizedYAxisTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text className="text-xs" x={0} y={0} fill="#666" textAnchor={"end"}>
        {payload.value}
      </text>
    </g>
  );
}

function Chart({ data, dataKey, stroke }) {
  return (
    <div className="flex-auto max-w-none min-w-0 rounded-lg bg-fiord-800 p-2 mt-4 avg:mt-0 md:mr-4 last:mr-0">
      <ResponsiveContainer minWidth={150} minHeight={150}>
        <LineChart
          data={data}
          syncId="chart"
          margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
        >
          <XAxis
            dataKey="date"
            tick={<CustomizedXAxisTick />}
            padding={{ right: 40 }}
          />
          <YAxis interval={0} tick={<CustomizedYAxisTick />} />
          <Tooltip />
          <Legend align="right" verticalAlign="top" />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            animationBegin={2000}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
