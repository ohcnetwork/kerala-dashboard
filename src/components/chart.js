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
import { lang } from "../constants";

function Chart({ data, dataKey, stroke }) {
  const CustomizedXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text className="text-xs" x={0} y={0} dy={16} fill="#828997">
          {payload.value.split("-2020")[0]}
        </text>
      </g>
    );
  };

  const CustomizedYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text className="text-xs" x={0} y={0} fill="#828997" textAnchor={"end"}>
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="text-mobile">
          <p>{`Date: ${label}`}</p>
          <p>{`${lang[payload[0].name]}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const customLegendText = (value, entry) => {
    const { color } = entry;
    return (
      <span style={{ color }} className="text-mobile uppercase">
        {lang[value]}
      </span>
    );
  };

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
            stroke="#828997"
          />
          <YAxis interval={0} tick={<CustomizedYAxisTick />} stroke="#828997" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="right"
            verticalAlign="top"
            formatter={customLegendText}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            animationEasing="ease-in-out"
            animationBegin={500}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
