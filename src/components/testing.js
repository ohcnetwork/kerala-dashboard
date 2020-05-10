import React from "react";

function Testing({ testReport }) {
  const lang = {
    total: "Total samples tested",
    positive: "Total positive samples tested",
    negative: "Total negative samples tested",
    pending: "Pending samples to be tested",
  };

  return (
    <div className="flex flex-1 min-w-full flex-col rounded-lg avg2:mb-0 space-y-2 bg-fiord-800 p-4">
      {Object.keys(testReport.summary).map((k) => (
        <div className="flex flex-col">
          <div className="flex">{lang[k]}</div>
          <div className="flex text-3xl font-semibold">
            <div className="flex leading-none"> {testReport.summary[k]}</div>
            <div className="flex text-mobile">
              {testReport.delta[k] > 0
                ? "+" + testReport.delta[k]
                : testReport.delta[k] != 0
                ? testReport.delta[k]
                : "-"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Testing;
