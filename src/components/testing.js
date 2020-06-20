import React from "react";

function Testing({ testReport }) {
  const lang = {
    total: "Total samples tested",
    today: "Samples tested today",
    positive: "Total positive samples tested",
    today_positive: "Samples tested positive today",
  };

  return (
    <div className="flex flex-col flex-1 min-w-full p-4 space-y-2 rounded-lg avg2:mb-0 bg-fiord-800">
      {Object.keys(lang).map((k) => (
        <div className="flex flex-col">
          <div className="flex">{lang[k]}</div>
          <div className="flex text-3xl font-semibold leading-none">{testReport[k]}</div>
        </div>
      ))}
    </div>
  );
}

export default Testing;
