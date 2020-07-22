import React, { useState } from "react";

function ListItem({ h, d }) {
  const [active, setActive] = useState(false);

  return (
    <div>
      <div
        onClick={() => setActive(!active)}
        className="flex justify-between group "
      >
        <div className="flex">
          <svg
            className={`w-3 fill-current transform transition ease-in-out duration-200  ${
              active
                ? "rotate-180 group-hover:rotate-0"
                : "rotate-0 group-hover:rotate-180"
            }`}
            viewBox="0 0 20 20"
          >
            <path
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
          <div className="ml-1">{h}</div>
        </div>
        <div>{d.length}</div>
      </div>
      {active && (
        <div className="mb-0 ml-4 text-sm last:mb-2">{d.join(", ")}</div>
      )}
    </div>
  );
}

function Hotspots({ hotspots }) {
  return (
    <div className="flex-col flex-1 min-w-full p-4 rounded-lg bg-fiord-800 avg2:mb-0">
      <div className="flex justify-between pointer-events-none">
        <div className="font-semibold">District-wise Containment Zones</div>
        <div className="inline">
          {Object.values(hotspots).reduce((a, c) => a + c.length, 0)}
        </div>
      </div>
      {Object.keys(hotspots).map((d) => {
        return <ListItem h={d} d={hotspots[d]} />;
      })}
    </div>
  );
}

export default Hotspots;
