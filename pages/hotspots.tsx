import MapGL, {
  Layer,
  Source,
  Popup,
  GeolocateControl,
} from "@urbica/react-map-gl";
import { Button, Card, Transition, WindmillContext } from "@windmill/react-ui";
import BJSON from "buffer-json";
import fs from "fs";
import geobuf from "geobuf";
import type { Map } from "mapbox-gl";
import type { InferGetStaticPropsType } from "next";
import getConfig from "next/config";
import Head from "next/head";
import path from "path";
import Pbf from "pbf";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import shallow from "zustand/shallow";

import { MAPBOX } from "../lib/constants";
import { getHotspotsHistories } from "../lib/getStats";
import { useGlobalStore, useHotspotsMapStore } from "../lib/stores";

import "mapbox-gl/dist/mapbox-gl.css";

export default function Hotspots({
  lastUpdated,
  hotspots,
  districtPbf,
  lsgdPbf,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [setLastUpdated] = useGlobalStore(
    (state) => [state.setLastUpdated],
    shallow
  );
  useEffect(() => {
    setLastUpdated(lastUpdated);
  }, []);
  const [
    viewport,
    hoveredEntity,
    geoLocEntity,
    setViewport,
    setHoveredEntity,
    setGeoLocEntity,
  ] = useHotspotsMapStore((state) => [
    state.viewport,
    state.hoveredEntity,
    state.geoLocEntity,
    state.setViewport,
    state.setHoveredEntity,
    state.setGeoLocEntity,
  ]);
  const { mode: theme } = useContext(WindmillContext);
  const mapRef = useRef(null);
  const dark = useMemo(() => theme === "dark", [theme]);
  const { lsgd, district } = useMemo(() => {
    const district: GeoJSON.FeatureCollection = geobuf.decode(
      new Pbf(BJSON.parse(districtPbf).buf)
    );
    const lsgd: GeoJSON.FeatureCollection = geobuf.decode(
      new Pbf(BJSON.parse(lsgdPbf).buf)
    );
    lsgd.features = lsgd.features.map((f) => {
      f.properties = {
        ...f.properties,
        CONTAINMENT: false,
        WARDS: "",
        ALL_WARDS: false,
      };
      for (const h of hotspots) {
        if (
          h.lsgd === f.properties.LSGD &&
          h.district === f.properties.DISTRICT
        ) {
          f.properties = {
            ...f.properties,
            CONTAINMENT: true,
            WARDS: h.wards,
            ALL_WARDS: h.wards.toLowerCase().includes("all wards"),
          };
        }
      }
      return f;
    });
    return {
      lsgd,
      district,
    };
  }, []);
  const hoveredEntitySetter = useMemo(
    () => (e) => {
      if (!mapRef) {
        return;
      }
      const feature = mapRef.current
        .getMap()
        .queryRenderedFeatures(e.point)
        .find((e) => e.layer.id === "lsgd-hot");
      if (feature?.properties && !geoLocEntity) {
        setHoveredEntity({
          lngLat: e.lngLat,
          properties: feature.properties,
        });
      }
    },
    [mapRef]
  );

  return (
    <>
      <Head>
        <title>Kerala Dashboard: Hotspots</title>
      </Head>

      <div className="flex flex-grow min-h-screen">
        <Transition
          show={geoLocEntity !== null}
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0 transform translate-y-20"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 transform translate-y-20"
        >
          <Card className="flex flex-initial flex-col bottom-0 inset-x-0 mb-12 mx-auto max-w-xs p-2 fixed z-40">
            <span className="font-bold">You are in</span>
            <span>{`District: ${geoLocEntity?.DISTRICT}`}</span>
            <span>{`LSGD: ${geoLocEntity?.LSGD}`}</span>
            {geoLocEntity?.CONTAINMENT && (
              <>
                <span className="font-bold text-red-600">IN CONTAINMENT</span>
                <span>{`Wards: ${geoLocEntity?.WARDS}`}</span>
              </>
            )}
            <Button
              size="small"
              className="mt-1"
              onClick={() => {
                const map: Map = mapRef.current.getMap();
                map.fitBounds(MAPBOX.MAXBOUNDS);
                document.querySelector(".mapboxgl-user-location-dot")?.remove();
                document
                  .querySelector(".mapboxgl-user-location-accuracy-circle")
                  ?.remove();
                setGeoLocEntity(null);
              }}
            >
              Click here to close
            </Button>
          </Card>
        </Transition>
        <MapGL
          style={{ width: "100%", ZAxis: "0" }}
          mapStyle={dark ? MAPBOX.BASEMAP.DARK : MAPBOX.BASEMAP.LIGHT}
          accessToken={MAPBOX.ACCESS_TOKEN}
          onViewportChange={setViewport}
          maxBounds={MAPBOX.MAXBOUNDS}
          maxZoom={MAPBOX.MAX_ZOOM}
          viewportChangeMethod="flyTo"
          viewportChangeOptions={{ duration: 1000 }}
          {...viewport}
          ref={mapRef}
          onClick={["lsgd-hot", hoveredEntitySetter]}
          onTouchend={["lsgd-hot", hoveredEntitySetter]}
          onMousemove={["lsgd-hot", hoveredEntitySetter]}
        >
          <Source id="district" type="geojson" data={district} />
          <Source id="lsgd" type="geojson" data={lsgd} />
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true, timeout: 1000 }}
            position="top-right"
            onError={(error) => {
              // eslint-disable-next-line no-console
              console.error("A geolocate event has occurred.", error);
            }}
            onGeolocate={(e) => {
              if (!mapRef) {
                return;
              }
              const feature = mapRef.current
                .getMap()
                .queryRenderedFeatures(e.point)
                .find((f) => f.layer.id === "lsgd-hot");
              if (feature?.properties) {
                setGeoLocEntity(feature.properties);
              } else {
                const map: Map = mapRef.current.getMap();
                map.fitBounds(MAPBOX.MAXBOUNDS);
                document.querySelector(".mapboxgl-user-location-dot")?.remove();
                document
                  .querySelector(".mapboxgl-user-location-accuracy-circle")
                  ?.remove();
              }
            }}
          />
          <Layer
            id="lsgd-hot"
            type="fill"
            source="lsgd"
            paint={{
              "fill-color": [
                "case",
                ["all", ["get", "CONTAINMENT"], ["get", "ALL_WARDS"]],
                MAPBOX.COLORS.ALL_WARDS,
                ["all", ["get", "CONTAINMENT"], ["!", ["get", "ALL_WARDS"]]],
                MAPBOX.COLORS.MAIN,
                dark ? MAPBOX.COLORS.NONE_DARK : MAPBOX.COLORS.NONE_LIGHT,
              ],
              "fill-opacity": 0.2,
            }}
          />
          {hoveredEntity && (
            <Popup
              longitude={hoveredEntity.lngLat.lng}
              latitude={hoveredEntity.lngLat.lat}
              closeOnClick
              closeButton={false}
              onClose={() => setHoveredEntity(null)}
            >
              <div className="flex flex-col">
                <span>{`District: ${hoveredEntity.properties.DISTRICT}`}</span>
                <span>{`LSGD: ${hoveredEntity.properties.LSGD}`}</span>
                {hoveredEntity.properties.CONTAINMENT && (
                  <>
                    <span className="font-bold text-red-600">
                      IN CONTAINMENT
                    </span>
                    <span>{`Wards: ${hoveredEntity.properties.WARDS}`}</span>
                  </>
                )}
              </div>
            </Popup>
          )}
          <LinesAndLabels dark={dark} dataKey="lsgd" />
          <LinesAndLabels dark={dark} dataKey="district" />
        </MapGL>
      </div>
    </>
  );
}

type LinesAndLabelsProps = {
  dark: boolean;
  dataKey: string;
};

function LinesAndLabels({ dark, dataKey }: LinesAndLabelsProps) {
  return (
    <>
      <Layer
        id={`${dataKey}-line`}
        before={dataKey === "district" ? "lsgd-label" : "district-label"}
        type="line"
        source={dataKey}
        paint={{
          "line-color": dark ? MAPBOX.LINE.DARK : MAPBOX.LINE.LIGHT,
          "line-width": [
            "interpolate",
            ["cubic-bezier", 0.68, 0.03, 0.2, 0.72],
            ["zoom"],
            MAPBOX.INIT_ZOOM,
            dataKey === "district" ? 1 : 0.1,
            MAPBOX.MAX_ZOOM,
            dataKey === "district" ? 5 : 1,
          ],
          "line-translate-anchor": "viewport",
        }}
      />
      <Layer
        id={`${dataKey}-label`}
        type="symbol"
        source={dataKey}
        paint={{
          "text-color": dark ? "white" : "black",
          "text-translate-anchor": "viewport",
          "text-opacity": [
            "step",
            ["zoom"],
            dataKey === "district" ? 1 : 0,
            9,
            1,
          ],
        }}
        layout={{
          "text-field": ["get", dataKey.toUpperCase()],
          "text-size": dataKey === "district" ? 12 : 10,
          "text-variable-anchor": ["center"],
          "text-justify": "auto",
        }}
      />
    </>
  );
}

export const getStaticProps = async () => {
  const { serverRuntimeConfig } = getConfig();
  const {
    histories: hotspotsHistories,
    lastUpdated,
  } = await getHotspotsHistories();
  const lsgdPbf: string = BJSON.stringify({
    buf: await fs.promises.readFile(
      path.join(serverRuntimeConfig.PROJECT_ROOT, "./data/kerala_lsgd.pbf")
    ),
  });
  const districtPbf: string = BJSON.stringify({
    buf: await fs.promises.readFile(
      path.join(serverRuntimeConfig.PROJECT_ROOT, "./data/kerala_district.pbf")
    ),
  });
  return {
    props: {
      lastUpdated,
      hotspots: hotspotsHistories[hotspotsHistories.length - 1].hotspots,
      lsgdPbf,
      districtPbf,
    },
  };
};
