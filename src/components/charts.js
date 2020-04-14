import React, { useEffect, useState } from "react";
import Chart from "./chart";

function Charts({ data }) {
  const [chartData, setChartData] = useState([]);
  const colorMap = {
    confirmed: "#f56565",
    active: "#ecc94b",
    recovered: "#48bb78",
    deceased: "#a0aec0",
  };

  useEffect(() => {
    if (data.length > 0) {
      setChartData(data.splice(0));
    }
  }, [data]);

  return (
    <div className="flex flex-col md:flex-row mb-4 xs:mt-0">
      {Object.keys(colorMap).map((k, i) => {
        return <Chart data={chartData} dataKey={k} stroke={colorMap[k]} />;
      })}
    </div>
  );
}

export default Charts;
