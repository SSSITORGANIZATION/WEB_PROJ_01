import React from 'react';
import { Line } from '@react-three/drei';

const ContinentOutlines = () => {
  const outlines = [];

  // Simplified continent outlines using approximate coordinates
  const continentData = [
    {
      name: 'North America',
      color: 0x2f6f9f,
      points: [
        [-160, 70], [-125, 70], [-100, 75], [-80, 70], [-60, 60], [-55, 50],
        [-60, 45], [-75, 35], [-80, 25], [-95, 20], [-105, 25], [-115, 32],
        [-125, 35], [-130, 40], [-120, 50], [-125, 60], [-130, 65], [-140, 70],
        [-150, 65], [-160, 60], [-160, 70]
      ]
    },
    {
      name: 'South America',
      color: 0x2f6f9f,
      points: [
        [-80, 10], [-75, 5], [-70, -5], [-75, -15], [-80, -25], [-75, -35],
        [-70, -45], [-65, -50], [-60, -55], [-55, -50], [-50, -40], [-45, -30],
        [-50, -20], [-55, -10], [-60, -5], [-70, 0], [-75, 5], [-80, 10]
      ]
    },
    {
      name: 'Europe',
      color: 0x2f6f9f,
      points: [
        [-10, 35], [-5, 40], [0, 45], [10, 50], [15, 55], [20, 60], [25, 65],
        [30, 70], [35, 70], [40, 65], [45, 60], [50, 55], [45, 50], [40, 45],
        [35, 40], [30, 35], [25, 35], [20, 40], [15, 45], [10, 40], [5, 35],
        [0, 35], [-5, 35], [-10, 35]
      ]
    },
    {
      name: 'Africa',
      color: 0x2f6f9f,
      points: [
        [-15, 35], [-10, 30], [-5, 25], [0, 20], [5, 15], [10, 10], [15, 5],
        [20, 0], [25, -5], [30, -10], [35, -15], [40, -20], [45, -25], [50, -30],
        [45, -35], [40, -30], [35, -25], [30, -20], [25, -15], [20, -10], [15, -5],
        [10, 0], [5, 5], [0, 10], [-5, 15], [-10, 20], [-15, 25], [-20, 30],
        [-15, 35]
      ]
    },
    {
      name: 'Asia',
      color: 0x2f6f9f,
      points: [
        [40, 70], [60, 75], [80, 70], [100, 65], [120, 60], [140, 55], [150, 50],
        [155, 45], [150, 40], [145, 35], [140, 30], [135, 25], [130, 20], [125, 15],
        [120, 10], [115, 5], [110, 0], [105, -5], [100, -10], [95, -5], [90, 0],
        [85, 5], [80, 10], [75, 15], [70, 20], [65, 25], [60, 30], [55, 35],
        [50, 40], [45, 45], [40, 50], [35, 55], [30, 60], [35, 65], [40, 70]
      ]
    },
    {
      name: 'Australia',
      color: 0x2f6f9f,
      points: [
        [115, -20], [125, -15], [135, -20], [145, -25], [150, -30], [155, -35],
        [150, -40], [145, -45], [140, -40], [135, -35], [130, -30], [125, -25],
        [120, -30], [115, -35], [110, -30], [115, -20]
      ]
    }
  ];

  const latLonToVector3 = (lat, lon, radius = 5.15) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));

    return [x, y, z];
  };

  continentData.forEach((continent, continentIndex) => {
    const points = continent.points.map(([lon, lat]) => latLonToVector3(lat, lon));

    // Close the loop
    if (points.length > 0) {
      points.push(points[0]);
    }

    outlines.push(
      <Line
        key={continent.name}
        points={points}
        color={continent.color}
        lineWidth={2}
        opacity={0.5}
        transparent
      />
    );
  });

  return <group>{outlines}</group>;
};

export default ContinentOutlines;
