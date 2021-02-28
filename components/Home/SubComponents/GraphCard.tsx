import { Card } from "@windmill/react-ui";
import React, { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

type GraphCardProps = {
  label: string;
  value: number;
  delta: number;
  data: {
    date: string;
    data: number;
  }[];
};

export default function GraphCard({
  label,
  value,
  delta,
  data,
}: GraphCardProps) {
  const percent = useMemo(() => (delta / value) * 100, []);

  return (
    <Card className="flex flex-col p-2">
      <span className="text-base font-bold whitespace-no-wrap">{label}</span>
      <span>
        {Number.isInteger(value) ? (
          <>
            {`${value} `}
            <span className="text-xxs font-semibold">
              {delta ? (delta > 0 ? `+${delta}` : `-${Math.abs(delta)}`) : "-"}
            </span>
          </>
        ) : (
          value.toFixed(2)
        )}
      </span>
      <span className="text-xs">
        {percent
          ? percent > 0
            ? `+${percent.toFixed(2)}%`
            : `-${Math.abs(percent).toFixed(2)}%`
          : "-"}
      </span>
      <ResponsiveContainer height={75}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <Tooltip />
          <XAxis hide dataKey="date" />
          <Line
            type="monotone"
            dataKey="data"
            stroke="var(--color-purple-400)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
