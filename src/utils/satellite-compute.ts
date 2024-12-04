import { TLEData } from "./types"; // Assuming you have TLE type

// Constants
const EARTH_RADIUS = 6371; // Earth's radius in km
const GRAVITATIONAL_PARAMETER = 398600.4418; // Standard gravitational parameter in km^3/s^2

export interface SatellitePosition {
  latitude: number;
  longitude: number;
  altitude: number;
  period: number; // Add orbital period
}

// Helper function to parse the TLE epoch into a JavaScript Date object
const parseEpochDate = (epoch: string): Date => {
  const year = 2000 + parseInt(epoch.substring(0, 2)); // 2000 + year from TLE (e.g., "22" -> 2022)
  const dayOfYear = parseInt(epoch.substring(2, 5)); // Day of the year (e.g., "063" -> 63rd day)
  const fractionalDay = parseFloat(epoch.substring(5, 11)); // Fractional day (e.g., "0.48247685")

  // Create a new Date object for the beginning of the year
  const date = new Date(year, 0, dayOfYear); // January 1st of the given year

  // Add the fractional day (in milliseconds) to the date
  date.setHours(0, 0, 0, 0); // Set to midnight (start of the day)
  date.setMilliseconds(date.getMilliseconds() + fractionalDay * 24 * 60 * 60 * 1000); // Add fractional day to the time

  return date;
};

// Helper function to compute the orbital period from mean motion
const computeOrbitalPeriod = (meanMotion: number): number => {
  // Calculate the orbital period using the mean motion (revolutions per day)
  const periodInSeconds = 86400 / meanMotion; // Orbital period in seconds
  return periodInSeconds;
};

// Modify this function to include period
export const computeSatellitePosition = (
  tle: string[],
  date: Date
): SatellitePosition => {
  // Parse the epoch date from the TLE
  const epochDate = parseEpochDate(tle[0].substring(18, 32)); // Extract epoch from Line 1

  // Parse mean motion from TLE (Line 2, position 52-63)
  const meanMotion = parseFloat(tle[1].substring(52, 63)); // Mean motion in revolutions per day

  const period = computeOrbitalPeriod(meanMotion); // Calculate orbital period in seconds
  const timeSinceEpoch = (date.getTime() - epochDate.getTime()) / 1000; // Time in seconds since TLE epoch

  // Simulate the satellite's position based on its orbital mechanics
  const meanAnomaly = (2 * Math.PI * (timeSinceEpoch / period)) % (2 * Math.PI); // Mean anomaly

  // Compute position using simplified orbital mechanics or use a library for accuracy
  const longitude = (meanAnomaly * 180) / Math.PI; // Example simplified position calculation
  const latitude = Math.sin(meanAnomaly) * 50; // Example latitude calculation
  const altitude = 1000; // Altitude (example)

  return {
    latitude,
    longitude,
    altitude,
    period, // Include orbital period in the return value
  };
};
