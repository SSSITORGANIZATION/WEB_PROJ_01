import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import GeographicLines from './GeographicLines';
import LocationMarker from './LocationMarker';
import ContinentOutlines from './ContinentOutlines';

const Earth = ({ earthRef, textureLoaded, setTextureLoaded }) => {
  const earthTexture = useRef();
  const bumpTexture = useRef();
  const specularTexture = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Load Earth textures
    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      (texture) => {
        earthTexture.current = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        setTextureLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading Earth texture:', error);
        // Fallback to procedural texture
        setTextureLoaded(true);
      }
    );

    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
      (texture) => {
        bumpTexture.current = texture;
      },
      undefined,
      (error) => console.error('Error loading bump texture:', error)
    );

    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
      (texture) => {
        specularTexture.current = texture;
      },
      undefined,
      (error) => console.error('Error loading specular texture:', error)
    );
  }, [setTextureLoaded]);

  return (
    <Sphere ref={earthRef} args={[5, 64, 64]}>
      <meshPhongMaterial
        map={earthTexture.current}
        bumpMap={bumpTexture.current}
        bumpScale={0.05}
        specularMap={specularTexture.current}
        specular={new THREE.Color(0x123b68)}
        shininess={15}
        color={0x123b68}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
};

const Atmosphere = () => {
  const atmosphereRef = useRef();

  useFrame((state) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Sphere ref={atmosphereRef} args={[5.2, 64, 64]}>
      <meshPhongMaterial
        color={0x123b68}
        transparent
        opacity={0.2}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
};

const Clouds = () => {
  const cloudRef = useRef();
  const cloudTexture = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
      (texture) => {
        cloudTexture.current = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
      },
      undefined,
      (error) => console.error('Error loading cloud texture:', error)
    );
  }, []);

  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Sphere ref={cloudRef} args={[5.05, 64, 64]}>
      <meshPhongMaterial
        map={cloudTexture.current}
        color={0xffffff}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
};

const Lights = () => {
  const sunRef = useRef();

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 20;
      sunRef.current.position.z = Math.cos(state.clock.getElapsedTime() * 0.1) * 20;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        ref={sunRef}
        intensity={1.5}
        position={[10, 5, 10]}
        castShadow
      />
      <pointLight intensity={0.5} position={[-10, -5, -10]} />
    </>
  );
};

const GlobeScene = ({ autoRotate = true, showClouds = true, showAtmosphere = true, showGeographicLines = true, showContinentOutlines = true, backgroundOnly = false }) => {
  const earthRef = useRef();
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert lat/lon to 3D coordinates
  const latLonToVector3 = (lat, lon, radius = 5.1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));

    return [x, y, z];
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 18 : 15], fov: isMobile ? 50 : 45 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
      >
        <Stars
          radius={100}
          depth={50}
          count={isMobile ? 2000 : 5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        {!backgroundOnly && (
          <>
            <Lights />
            <Earth
              earthRef={earthRef}
              textureLoaded={textureLoaded}
              setTextureLoaded={setTextureLoaded}
            />
            {showAtmosphere && <Atmosphere />}
            {showClouds && <Clouds />}
            {showGeographicLines && <GeographicLines />}
            {showContinentOutlines && <ContinentOutlines />}
          </>
        )}

        {!backgroundOnly && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={7}
            maxDistance={30}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.8}
          />
        )}
      </Canvas>

      {/* Loading indicator */}
      {!backgroundOnly && !textureLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-20">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading Earth textures...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Globe = (props) => {
  return (
    <div className="w-full h-full">
      <GlobeScene {...props} />
    </div>
  );
};

export default Globe;
