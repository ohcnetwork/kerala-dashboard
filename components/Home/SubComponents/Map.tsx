import polylabel from "polylabel";
import React from "react";
import type { Point } from "react-simple-maps";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

type GeoObject = { properties: { DISTRICT: string; LSGD?: string } };

type MapProps = {
  geoJSON: string | Record<string, any> | string[];
  scale: number;
  zoom?: number;
  fill: string | ((geo: GeoObject) => string);
  stroke?: string | ((geo: GeoObject) => string);
  onClick?: (geo: GeoObject) => void;
  labelKey?: string;
  filter?: (geo: GeoObject) => boolean;
  center: Point;
};

export default function Map({
  geoJSON,
  scale,
  zoom = 1,
  fill,
  stroke,
  onClick,
  labelKey,
  filter,
  center,
}: MapProps) {
  return (
    <ComposableMap
      className="flex flex-grow"
      projection="geoMercator"
      projectionConfig={{
        scale,
      }}
    >
      <ZoomableGroup center={center} zoom={zoom}>
        <Geographies geography={geoJSON}>
          {({ geographies }) => {
            const filteredGeographies = filter
              ? geographies.filter(filter)
              : geographies;
            return (
              <>
                {filteredGeographies.map((geo) => {
                  return (
                    <Geography
                      className="appearance-none focus:outline-none"
                      onClick={() => onClick?.(geo)}
                      key={geo.rsmKey}
                      geography={geo}
                      fill={typeof fill === "function" ? fill(geo) : fill}
                      stroke={
                        typeof stroke === "function" ? stroke(geo) : stroke
                      }
                    />
                  );
                })}
                {labelKey &&
                  filteredGeographies.map((geo) => (
                    <Marker
                      key={geo.rsmKey}
                      coordinates={polylabel(geo.geometry.coordinates)}
                    >
                      <text
                        fontSize="0.25rem"
                        textAnchor="middle"
                        color="black"
                      >
                        {geo.properties[labelKey]}
                      </text>
                    </Marker>
                  ))}
              </>
            );
          }}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
