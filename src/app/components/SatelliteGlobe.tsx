"use client";

import { useSatellites } from "@/hooks/useSatellites";
import {
  SatellitePosition,
  computeSatellitePosition,
} from "@/utils/satellite-compute";
import { TLEData } from "@/utils/types";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";

const RADIUS = 5; // Earth's radius in your 3D model scale
const SATELLITE_SCALE_FACTOR = 1.1; // Factor to push satellites slightly above the surface

// Convert latitude, longitude, and altitude to Cartesian coordinates
const sphericalToCartesian = (
  radius: number,
  latitude: number,
  longitude: number
): [number, number, number] => {
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;
  return [
    radius * Math.cos(latRad) * Math.cos(lonRad), // X
    radius * Math.sin(latRad), // Y
    radius * Math.cos(latRad) * Math.sin(lonRad), // Z
  ];
};

export default function SatelliteGlobe() {
  const { data, error, isLoading } = useSatellites();
  const tleData: TLEData[] | undefined = useMemo(
    () =>
      data?.map((satellite) => ({
        name: satellite.name,
        tle: [satellite.tleLine1, satellite.tleLine2],
      })),
    [data]
  );

  const [satellitePositions, setSatellitePositions] = useState<{
    [name: string]: { positions: SatellitePosition[]; cartesianPositions: THREE.Vector3[] };
  }>({});

  useEffect(() => {
    if (tleData) {
      const updatePositions = () => {
        const now = new Date();
        const positions: {
          [name: string]: { positions: SatellitePosition[]; cartesianPositions: THREE.Vector3[] };
        } = {};

        tleData.forEach((satellite) => {
          const pos = computeSatellitePosition(satellite.tle, now);
          const cartesian = new THREE.Vector3(
            ...sphericalToCartesian(RADIUS + pos.altitude * (1 / 6371), pos.latitude, pos.longitude)
          );

          // Store the satellite's position and its cartesian coordinate
          if (!positions[satellite.name]) {
            positions[satellite.name] = { positions: [], cartesianPositions: [] };
          }
          positions[satellite.name].positions.push(pos);
          positions[satellite.name].cartesianPositions.push(cartesian);

          // Keep the position array from growing too large, we only need recent positions
          if (positions[satellite.name].positions.length > 50) {
            positions[satellite.name].positions.shift();
            positions[satellite.name].cartesianPositions.shift();
          }
        });

        setSatellitePositions(positions);
      };

      const interval = setInterval(updatePositions, 1000);
      return () => clearInterval(interval);
    }
  }, [tleData]);

  if (isLoading) return <p>Loading TLE data...</p>;
  if (error) return <p>Error fetching TLE data: {error.message}</p>;

  return (
    <div style={{ height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* Earth */}
        <Sphere args={[RADIUS, 32, 32]}>
          <meshStandardMaterial color="#1e90ff" wireframe={true} />
        </Sphere>

        {/* Satellite Tracks */}
        {Object.entries(satellitePositions).map(([name, { cartesianPositions }]) => (
          <Line
            key={name}
            points={cartesianPositions} // Pass the array of positions to draw the track
            color="red" // Line color
            lineWidth={2} // Line width
            visible={true} // Make the line visible
          />
        ))}

        {/* Satellites */}
        {Object.entries(satellitePositions).map(([name, { cartesianPositions }]) => (
          <mesh key={name} position={cartesianPositions[cartesianPositions.length - 1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
}
