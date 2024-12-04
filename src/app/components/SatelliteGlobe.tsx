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

const calculateFuturePositions = (
  tle: string[],
  numPositions: number = 100
): SatellitePosition[] => {
  const futurePositions: SatellitePosition[] = [];
  const now = new Date();
  const period = computeSatellitePosition(tle, now).period; // Get the orbital period in seconds

  // Calculate positions at intervals throughout the period of the revolution
  for (let i = 0; i < numPositions; i++) {
    const timeOffset = (period / numPositions) * i;
    const futureTime = new Date(now.getTime() + timeOffset * 1000);
    const position = computeSatellitePosition(tle, futureTime);
    futurePositions.push(position);
  }

  return futurePositions;
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

  const [satelliteFuturePositions, setSatelliteFuturePositions] = useState<{
    [name: string]: SatellitePosition[];
  }>({});

  useEffect(() => {
    if (tleData) {
      const updatePositions = () => {
        const futurePositions: { [name: string]: SatellitePosition[] } = {};

        tleData.forEach((satellite) => {
          const positions = calculateFuturePositions(satellite.tle);
          futurePositions[satellite.name] = positions;
        });

        setSatelliteFuturePositions(futurePositions);
      };

      updatePositions(); // Initialize immediately
      const interval = setInterval(updatePositions, 1000); // Update every second
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

        {/* Satellite Future Tracks */}
        {Object.entries(satelliteFuturePositions).map(([name, positions]) => (
          <Line
            key={name}
            points={positions.map((pos) =>
              new THREE.Vector3(
                ...sphericalToCartesian(RADIUS + pos.altitude * (1 / 6371) * SATELLITE_SCALE_FACTOR, pos.latitude, pos.longitude)
              )
            )}
            color="green" // Line color for future track
            lineWidth={2} // Line width
            visible={true} // Make the line visible
          />
        ))}

        {/* Satellites */}
        {Object.entries(satelliteFuturePositions).map(([name, positions]) => (
          <mesh
            key={name}
            position={new THREE.Vector3(
              ...sphericalToCartesian(RADIUS + positions[positions.length - 1].altitude * (1 / 6371) * SATELLITE_SCALE_FACTOR, positions[positions.length - 1].latitude, positions[positions.length - 1].longitude)
            )}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
}
