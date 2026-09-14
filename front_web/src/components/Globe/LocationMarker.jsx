import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

const LocationMarker = ({ position, label, onClick, isSelected }) => {
  const markerRef = useRef();
  const ringRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.3);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15);
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[0.25, 32, 32]}>
        <meshBasicMaterial
          color={isSelected ? 0x4fc3f7 : 0x29b6f6}
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Pulsing ring */}
      <Sphere ref={ringRef} args={[0.18, 32, 32]}>
        <meshBasicMaterial
          color={isSelected ? 0x4fc3f7 : 0x29b6f6}
          transparent
          opacity={0.4}
        />
      </Sphere>
      
      {/* Inner dot */}
      <Sphere args={[0.1, 32, 32]}>
        <meshBasicMaterial color={isSelected ? 0x4fc3f7 : 0xffffff} />
      </Sphere>

      {/* Label */}
      {label && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.18}
          color={isSelected ? 0x4fc3f7 : 0xffffff}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          outlineOpacity={0.8}
        >
          {label}
        </Text>
      )}
    </group>
  );
};

export default LocationMarker;
