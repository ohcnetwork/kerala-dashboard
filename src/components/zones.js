import React from "react";

function Zones({ zones }) {
  const zv = Object.values(zones);
  const zs = {
    red: "bg-red-600",
    orange: "bg-orange-600",
    green: "bg-green-600",
  };

  return (
    <div className="flex flex-col rounded-lg avg2:mb-0 min-w-full space-y-4 min-h-full text-gray-900">
      {Object.keys(zs).map((z) => (
        <div
          className={`flex flex-grow flex-row flex-no-wrap justify-between p-2 rounded-lg ${zs[z]}`}
        >
          <div className="flex flex-col">
            <div className="font-semibold">{`Districts in ${z} zone`}</div>
            <div className="text-sm">
              {Object.entries(zones).reduce(
                (a, c) =>
                  c[1] == z ? (a == "" ? a + c[0] : a + ", " + c[0]) : a + "",
                ""
              )}
            </div>
          </div>
          <div className="flex text-5xl font-semibold">
            {zv.reduce((a, c) => (c === z ? a + 1 : a), 0)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Zones;
