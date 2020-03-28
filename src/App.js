import React, { useState, useEffect } from "react";
import Map from "./components/map";
import Table from "./components/table";
import Counter from "./components/counter";
import axios from "axios";

function App() {
  const [districts, setDistricts] = useState({});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched === false) {
      axios
        .get("https://volunteer.coronasafe.network/api/reports")
        .then(response => {
          setDistricts(response.data.kerala);
          setFetched(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [fetched]);

  return (
    <div className="flex min-h-screen min-w-full">
      {!fetched && <div className="spinner min-h-screen min-w-full"></div>}
      {fetched && (
        <div className="flex flex-col p-5 font-inter text-primary overflow-hidden antialiased">
          <div className="flex flex-col xl:flex-row">
            <div className="flex flex-col xl:pr-2 xl:mr-auto">
              <p className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-5xl text-center xl:text-left">
                KERALA COVID-19 TRACKER
              </p>
            </div>
            <div className="flex flex-col pl-0 xl:pl-2">
              <Counter districts={districts} />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row">
            <div className="flex flex-col pl-0 xl:pl-2">
              <Map districts={districts} />
            </div>
            <div className="flex flex-col order-last sm:order-last md:order-last lg:order-first xl:order-first pr-0 xl:pr-2">
              <Table districts={districts} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
