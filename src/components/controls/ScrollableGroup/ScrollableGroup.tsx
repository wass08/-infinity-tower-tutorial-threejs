import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import * as THREE from "three";

export type ScrollableGroupProps = {
  scroll: number;
  children: React.ReactNode;
  rotationSpeed?: number;
};

export const ScrollableGroup = ({
  scroll,
  children,
  rotationSpeed,
}: ScrollableGroupProps) => {
  const ref = useRef<THREE.Group>(null);
  const { size } = useThree();
  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      -0.72 - (scroll / size.height) * 2,
      0.065
    );
    if (rotationSpeed) {
      ref.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
    }
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {children}
    </group>
  );
};
