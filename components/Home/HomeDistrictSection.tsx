import {
  LegendLinear,
  LegendItem,
  LegendLabel,
  LegendOrdinal,
} from "@visx/legend";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Button, Card, Label, Select } from "@windmill/react-ui";
import Link from "next/link";
import React, { useMemo } from "react";
import shallow from "zustand/shallow";

import keralaDistrict from "../../data/kerala_district_simplified.json";
import keralaLSGD from "../../data/kerala_lsgd.json";
import {
  Districts,
  SummaryLang,
  DistrictProjConfig,
  SummaryKeys,
  MapMode,
} from "../../lib/constants";
import { useHomeDistrictStore } from "../../lib/stores";
import GraphCard from "./SubComponents/GraphCard";
import Map from "./SubComponents/Map";

type HomeDistrictSectionProps = {
  districtHistories: Stats.DistrictHistories;
  hotspotsHistories: Stats.HotspotHistories;
};

export default function HomeDistrictSection({
  districtHistories,
  hotspotsHistories,
}: HomeDistrictSectionProps) {
  const [
    selectedDistrict,
    setSelectedDistrict,
    dataKey,
    setDataKey,
    mapMode,
    setMapMode,
  ] = useHomeDistrictStore(
    (state) => [
      state.selectedDistrict,
      state.setSelectedDistrict,
      state.dataKey,
      state.setDataKey,
      state.mapMode,
      state.setMapMode,
    ],
    shallow
  );

  const colorScale = useMemo(
    () =>
      scaleLinear({
        domain: [
          0,
          Math.max(
            ...Object.values(
              districtHistories[districtHistories.length - 1].summary
            ).map((a) => a[dataKey])
          ),
        ],
        range: ["#a4cafe", "#1e429f"],
      }),
    [dataKey]
  );

  return (
    <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
      <Card className="items-center flex flex-1 flex-col justify-center overflow-hidden p-2 relative">
        <div className="bottom-0 left-0 p-2 absolute">
          {mapMode === MapMode.State ? (
            <>
              <span className="text-xxs capitalize">
                {SummaryLang[dataKey]}
              </span>
              <LegendLinear
                scale={colorScale}
                labelFormat={(d) => Math.floor(d as number)}
              >
                {(labels) =>
                  labels.map((label, i) => (
                    <LegendItem key={`legend-${i}`}>
                      <svg className="h-3 w-3">
                        <rect fill={label.value} className="h-3 w-3" />
                      </svg>
                      <LegendLabel
                        margin="0px 3px"
                        className="text-xxs leading-none ml-1"
                      >
                        {label.text}
                      </LegendLabel>
                    </LegendItem>
                  ))
                }
              </LegendLinear>
            </>
          ) : (
            <>
              <LegendOrdinal
                scale={scaleOrdinal<string, string>({
                  domain: ["Normal", "Hotspot"],
                  range: ["var(--color-green-300)", "var(--color-red-500)"],
                })}
              >
                {(labels) =>
                  labels.map((label, i) => (
                    <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                      <svg className="h-3 w-3">
                        <rect fill={label.value} className="h-3 w-3" />
                      </svg>
                      <LegendLabel
                        margin="0px 3px"
                        className="text-xxs leading-none ml-1"
                      >
                        {label.text}
                      </LegendLabel>
                    </LegendItem>
                  ))
                }
              </LegendOrdinal>
            </>
          )}
        </div>
        {mapMode === MapMode.State ? (
          <Map
            center={[76.2, 10.568_310_664_701_643]}
            fill={(geo) =>
              colorScale(
                districtHistories[districtHistories.length - 1].summary[
                  geo.properties.DISTRICT.toLowerCase()
                ][dataKey]
              )
            }
            stroke={(geo) =>
              selectedDistrict === geo.properties.DISTRICT.toLowerCase()
                ? "var(--color-blue-200)"
                : null
            }
            geoJSON={keralaDistrict}
            labelKey="DISTRICT"
            onClick={(geo) =>
              setSelectedDistrict(
                geo.properties.DISTRICT.toLowerCase() as Districts
              )
            }
            scale={5000}
            zoom={1.5}
          />
        ) : (
          <Map
            center={DistrictProjConfig[selectedDistrict] || [0, 0]}
            fill={(g) =>
              hotspotsHistories[hotspotsHistories.length - 1].hotspots.find(
                (t) =>
                  t.district === g.properties.DISTRICT &&
                  t.lsgd === g.properties.LSGD
              ) === undefined
                ? "var(--color-green-300)"
                : "var(--color-red-500)"
            }
            geoJSON={keralaLSGD}
            labelKey="LSGD"
            scale={35_000}
            filter={(geo) =>
              geo.properties.DISTRICT.toLowerCase() === selectedDistrict
            }
          />
        )}
      </Card>
      <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
        <Card className="flex flex-col p-2 space-y-2">
          <Label>
            <span>Select District:</span>
            <Select
              className="mt-1 capitalize"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as Districts)}
            >
              {Object.entries(Districts).map(([k, d]) => (
                <option value={d} key={d}>
                  {k}
                </option>
              ))}
            </Select>
          </Label>
          <Label>
            <span>Map Options:</span>
            <div className="grid gap-2 grid-cols-2 h-10">
              <Button
                size="small"
                className="mt-1 whitespace-no-wrap"
                onClick={() =>
                  mapMode === MapMode.State
                    ? setMapMode(MapMode.District)
                    : setMapMode(MapMode.State)
                }
              >
                {mapMode === MapMode.State
                  ? "Show Hotspots Map"
                  : "Show Kerala Map"}
              </Button>
              {mapMode === MapMode.State ? (
                <Select
                  className="mt-1 capitalize"
                  value={dataKey}
                  onChange={(e) => setDataKey(e.target.value as SummaryKeys)}
                >
                  {Object.values(SummaryKeys).map((d) => (
                    <option value={d} key={d}>
                      {SummaryLang[d]}
                    </option>
                  ))}
                </Select>
              ) : (
                <Link href="/hotspots" passHref>
                  <Button size="small" className="mt-1 whitespace-no-wrap">
                    Show Detailed
                  </Button>
                </Link>
              )}
            </div>
          </Label>
        </Card>
        {Object.values(SummaryKeys).map((k) => (
          <GraphCard
            key={k}
            label={SummaryLang[k]}
            value={
              districtHistories[districtHistories.length - 1].summary[
                selectedDistrict
              ][k]
            }
            delta={
              districtHistories[districtHistories.length - 1].delta[
                selectedDistrict
              ][k]
            }
            data={districtHistories.map((f) => ({
              date: f.date,
              data: f.summary[selectedDistrict][k],
            }))}
          />
        ))}
        <GraphCard
          label="Hotspots"
          value={
            hotspotsHistories[hotspotsHistories.length - 1].hotspots.filter(
              (h) => h.district.toLowerCase() === selectedDistrict
            ).length
          }
          delta={
            hotspotsHistories[hotspotsHistories.length - 1].hotspots.filter(
              (h) => h.district.toLowerCase() === selectedDistrict
            ).length -
            hotspotsHistories[hotspotsHistories.length - 2].hotspots.filter(
              (h) => h.district.toLowerCase() === selectedDistrict
            ).length
          }
          data={hotspotsHistories.map((f) => ({
            date: f.date,
            data: f.hotspots.filter(
              (h) => h.district.toLowerCase() === selectedDistrict
            ).length,
          }))}
        />
      </div>
    </div>
  );
}
