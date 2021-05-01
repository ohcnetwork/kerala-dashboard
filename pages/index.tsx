import type { InferGetStaticPropsType } from "next";
import Head from "next/head";

import Header from "../components/Header";
import HomeDistrictSection from "../components/Home/HomeDistrictSection";
import HomeSummarySection from "../components/Home/HomeSummarySection";
import HomeTable from "../components/Home/HomeTable";
import { Districts } from "../lib/constants";
import { getMetaProps } from "../lib/getStats";

export default function Home({
  lastUpdated,
  histories,
  districtHistories,
  hotspotsSummaries,
  hotspotsLatest,
  testReportHistories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Kerala Dashboard</title>
      </Head>

      <div className="flex flex-col mb-6 mx-6 overflow-hidden space-y-5">
        <Header text="Kerala Dashboard" lastUpdated={lastUpdated} />
        <HomeSummarySection
          histories={histories}
          hotspotsSummaries={hotspotsSummaries}
          testReportHistories={testReportHistories}
        />
        <HomeTable
          districtHistories={districtHistories}
          hotspotsSummaries={hotspotsSummaries}
        />
        <HomeDistrictSection
          districtHistories={districtHistories}
          hotspotsLatest={hotspotsLatest}
          hotspotsSummaries={hotspotsSummaries}
        />
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  const {
    lastUpdated,
    histories,
    districtHistories,
    hotspotsHistories,
    testReportHistories,
  } = await getMetaProps();
  const hotspotsSummaries: Stats.HotspotSummaries = hotspotsHistories.map((c) =>
    Object.keys(Districts).reduce(
      (a, d) => {
        a[d.toLowerCase()] = c.hotspots.filter((h) => h.district === d).length;
        return a;
      },
      {
        date: c.date,
        total: c.hotspots.length,
        alappuzha: 0,
        ernakulam: 0,
        idukki: 0,
        kannur: 0,
        kasaragod: 0,
        kollam: 0,
        kottayam: 0,
        kozhikode: 0,
        malappuram: 0,
        palakkad: 0,
        pathanamthitta: 0,
        thiruvananthapuram: 0,
        thrissur: 0,
        wayanad: 0,
      }
    )
  );
  const hotspotsLatest = hotspotsHistories[hotspotsHistories.length - 1];
  return {
    props: {
      lastUpdated,
      histories,
      districtHistories,
      hotspotsSummaries,
      hotspotsLatest,
      testReportHistories,
    },
  };
};
