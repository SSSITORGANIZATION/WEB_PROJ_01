import React from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const GeographicLines = () => {
  const lines = [];

  // Latitude lines (every 15 degrees for more detail)
  for (let lat = -75; lat <= 75; lat += 15) {
    const radius = 5.1;
    const y = Math.sin((lat * Math.PI) / 180) * radius;
    const r = Math.cos((lat * Math.PI) / 180) * radius;

    const points = [];
    for (let lon = 0; lon <= 360; lon += 3) {
      const x = r * Math.cos((lon * Math.PI) / 180);
      const z = r * Math.sin((lon * Math.PI) / 180);
      points.push([x, y, z]);
    }

    // Equator is more prominent
    const isEquator = lat === 0;
    const isTropic = Math.abs(lat) === 23.5;

    lines.push(
      <Line
        key={`lat-${lat}`}
        points={points}
        color={isEquator ? 0x2f6f9f : isTropic ? 0x3f80ad : 0x245b88}
        lineWidth={isEquator ? 3 : isTropic ? 2 : 1}
        opacity={isEquator ? 0.6 : isTropic ? 0.5 : 0.3}
        transparent
      />
    );
  }

  // Longitude lines (every 15 degrees for more detail)
  for (let lon = 0; lon < 360; lon += 15) {
    const radius = 5.1;
    const points = [];

    for (let lat = -90; lat <= 90; lat += 3) {
      const y = Math.sin((lat * Math.PI) / 180) * radius;
      const r = Math.cos((lat * Math.PI) / 180) * radius;
      const x = r * Math.cos((lon * Math.PI) / 180);
      const z = r * Math.sin((lon * Math.PI) / 180);
      points.push([x, y, z]);
    }

    // Prime meridian and international date line are more prominent
    const isPrimeMeridian = lon === 0;
    const isDateLine = lon === 180;

    lines.push(
      <Line
        key={`lon-${lon}`}
        points={points}
        color={isPrimeMeridian || isDateLine ? 0x2f6f9f : 0x245b88}
        lineWidth={isPrimeMeridian || isDateLine ? 3 : 1}
        opacity={isPrimeMeridian || isDateLine ? 0.6 : 0.3}
        transparent
      />
    );
  }

  return <group>{lines}</group>;
};

export default GeographicLines;
