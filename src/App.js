import React, { useState, useEffect } from "react";
import Map from "./components/map";
import Table from "./components/table";
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
    <div className="app">
      {!fetched && (
        <div className="spinner mx-auto my-auto w-screen h-screen"></div>
      )}
      {fetched && (
        <div>
          <div className="flex flex-col items-center m-5">
            <p className="items-center font-sans text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl">
              Kerala COVID-19 Tracker
            </p>
            <div className="flex flex-wrap w-screen">
              <div className="flex w-auto sm:w-1/2 flex-col items-center">
                <Map districts={districts} />
              </div>
              <div className="flex w-auto sm:w-1/2 flex-col items-center self-center order-last sm:order-first">
                <Table districts={districts} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
