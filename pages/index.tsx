import type { InferGetStaticPropsType } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";

import HomeDistrictSection from "../components/Home/HomeDistrictSection";
import HomeSummarySection from "../components/Home/HomeSummarySection";
import HomeTable from "../components/Home/HomeTable";
import { getMetaProps } from "../lib/getStats";
import { useGlobalStore } from "../lib/stores";

export default function Home({
  lastUpdated,
  histories,
  districtHistories,
  hotspotsHistories,
  testReportHistories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [setLastUpdated] = useGlobalStore(
    (state) => [state.setLastUpdated],
    shallow
  );
  useEffect(() => {
    setLastUpdated(lastUpdated);
  }, []);

  return (
    <>
      <Head>
        <title>Kerala Dashboard</title>
      </Head>

      <div className="flex flex-col mb-6 mt-12 mx-6 overflow-hidden space-y-5">
        <HomeSummarySection
          histories={histories}
          hotspotsHistories={hotspotsHistories}
          testReportHistories={testReportHistories}
        />
        <HomeTable
          districtHistories={districtHistories}
          hotspotsHistories={hotspotsHistories}
        />
        <HomeDistrictSection
          districtHistories={districtHistories}
          hotspotsHistories={hotspotsHistories}
        />
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  return {
    props: await getMetaProps(),
  };
};
