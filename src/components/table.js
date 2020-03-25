import React, { useState, useEffect } from "react";
import Griddle, {
  plugins,
  RowDefinition,
  ColumnDefinition
} from "griddle-react";
import useWindowWidth from "hook-usewindowwidth";

function Table(props) {
  const districts = props.districts;
  const [data, setData] = useState([]);
  const windowWidth = useWindowWidth();
  const NewLayout = ({ Table }) => (
    <div>
      <Table />
    </div>
  );
  const sortProperties = [{ id: "corona_positive", sortAscending: false }];
  const Headings = {
    district: "District",
    under_observation: "Under Observation",
    under_home_isolation: "Home Isolation",
    total_hospitalised: "Active",
    hospitalised_today: "Today",
    corona_positive: "Confirmed",
    cured_discharged: "Recovered",
    deaths: "Deaths"
  };
  const CustomColumn = ({ value }) => (
    <span className="text-right text-blue-500">{value}</span>
  );
  const CustomHeading = ({ title }) => (
    <span className="text-right text-red-500">{Headings[title]}</span>
  );
  useEffect(() => {
    if (Object.keys(districts).length > 0) {
      const tmp = [];
      for (const d in districts) {
        tmp.push({
          district: d,
          ...districts[d]
        });
      }
      setData(tmp);
    }
  }, [districts]);

  return (
    <div className="flex text-base px-1 mt-4 sm:mt-0">
      <Griddle
        data={data}
        components={{
          Layout: NewLayout
        }}
        plugins={[plugins.LocalPlugin]}
        sortProperties={sortProperties}
      >
        <RowDefinition>
          <ColumnDefinition
            id="district"
            customHeadingComponent={CustomHeading}
            customComponent={CustomColumn}
          />
          <ColumnDefinition
            id="corona_positive"
            customHeadingComponent={CustomHeading}
          />
          <ColumnDefinition
            id="total_hospitalised"
            customHeadingComponent={CustomHeading}
          />

          <ColumnDefinition
            id="cured_discharged"
            customHeadingComponent={CustomHeading}
          />
          <ColumnDefinition
            id="deaths"
            customHeadingComponent={CustomHeading}
          />
          {windowWidth > 650 && (
            <ColumnDefinition
              id="under_observation"
              customHeadingComponent={CustomHeading}
            />
          )}
          {windowWidth > 650 && (
            <ColumnDefinition
              id="under_home_isolation"
              customHeadingComponent={CustomHeading}
            />
          )}
          {windowWidth > 650 && (
            <ColumnDefinition
              id="hospitalised_today"
              customHeadingComponent={CustomHeading}
            />
          )}
        </RowDefinition>
      </Griddle>
    </div>
  );
}

export default Table;
