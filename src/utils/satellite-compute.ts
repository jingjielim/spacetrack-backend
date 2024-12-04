import * as satellite from "satellite.js";
import { TLE } from "./types";

export interface SatellitePosition {
  latitude: number;
  longitude: number;
  altitude: number;
}

export const computeSatellitePosition = (
  tle: TLE,
  timestamp: Date
): SatellitePosition => {
  const satrec = satellite.twoline2satrec(tle[0], tle[1]);
  const positionAndVelocity = satellite.propagate(satrec, timestamp);
  const positionGd = satellite.eciToGeodetic(
    positionAndVelocity.position! as satellite.EciVec3<satellite.Kilometer>,
    satellite.gstime(timestamp)
  );

  return {
    latitude: satellite.degreesLat(positionGd.latitude),
    longitude: satellite.degreesLong(positionGd.longitude),
    altitude: positionGd.height,
  };
};
