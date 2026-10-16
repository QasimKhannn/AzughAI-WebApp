
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface Carousel3DProps {
  categories: Category[];
  onSelect: (categoryId: string) => void;
  selectedCategories: string[];
}

const CategoryItem = ({ position, rotation, category, isSelected, onSelect }: {
  position: [number, number, number];
  rotation: [number, number, number];
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(category.image);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh
      position={position}
      rotation={rotation}
      ref={mesh}
      onClick={onSelect}
    >
      <boxGeometry args={[2, 2, 0.1]} />
      <meshStandardMaterial
        emissive={isSelected ? new THREE.Color(0x4E2B25) : undefined}
        emissiveIntensity={isSelected ? 0.5 : 0}
      >
        <primitive attach="map" object={texture} />
      </meshStandardMaterial>
    </mesh>
  );
};

const Carousel3DScene = ({ categories, selectedCategories, onSelect }: Carousel3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const radius = 5;
  const itemCount = categories.length;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <group ref={groupRef}>
        {categories.map((category, index) => {
          const angle = (index / itemCount) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <CategoryItem
              key={category.id}
              position={[x, 0, z]}
              rotation={[0, -angle, 0]}
              category={category}
              isSelected={selectedCategories.includes(category.id)}
              onSelect={() => onSelect(category.id)}
            />
          );
        })}
      </group>
    </>
  );
};

const Carousel3D: React.FC<Carousel3DProps> = (props) => {
  return (
    <motion.div
      className="w-full h-[500px] rounded-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Canvas>
        <Carousel3DScene {...props} />
      </Canvas>
    </motion.div>
  );
};

export default Carousel3D;
